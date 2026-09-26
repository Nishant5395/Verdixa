// import { Request, Response } from "express";
// import Stripe from 'stripe'
// import { prisma } from "../config/prisma.js";
// import { inngest } from "../inngest/index.js";
// const stripe=new Stripe(process.env.STRIPE_SECRET_KEY as string)
// const endpointSecret=process.env.STRIPE_WEBHOOK_SECRET;
// export const stripeWebhook=async(request:Request,response:Response)=>{
//     let event;
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = request.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature as string,
//         endpointSecret
//       );
//     } catch (err: any) {
//   console.log(
//     "⚠️ Webhook signature verification failed.",
//     err.message
//   );
//   return response.sendStatus(400);
// }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       const paymentIntentId=paymentIntent.id;

//       //Getting Session Metadata
//       const session=await stripe.checkout.sessions.list({})
//       const {orderId}=session.data[0].metadata as any;
//      //Mark Payment as Paid
//      const paidOrder=await prisma.order.update({
//         where:{id:orderId},
//         data:{isPaid:true}
//      })
//      //Decrase Stock
//      const orderItems=(Array.isArray(paidOrder.items))?paidOrder.items:[]as any[];

//      for(const item of orderItems){
//         await prisma.product.update({
//             where:{id:item.product},
//             data:{stock:{decrement:item.quantity}}
//         })
//     }
//     if(paidOrder){
//         await inngest.send({name:"order/placed",data:{orderId}})
//     }
//       //Send stock update events for each product in the order
//     for(const item of orderItems){
//         await inngest.send({name:"inventory/stock.updated",data:{productId:item.product}})
//     }
//       break;
//     case 'payment_intent.canceled':
//     case 'payment_intent.payment_failed':{
//         const paymentIntentFailure=event.data.object as Stripe.PaymentIntent;
//         const paymentIntentFailureId=paymentIntentFailure.id;

//         //Getting Session Metadata
//         const sessionFailure=await stripe.checkout.sessions.list({
//             payment_intent:paymentIntentFailureId
//         })
//         const failureOrderId=(sessionFailure.data[0].metadata as any).orderId;

//         await prisma.order.delete({where:{id:failureOrderId}})
//         break;
//     }
//      default:
//         console.log(`Unhandled event type ${event.type}`);
//   // Return a response to acknowledge receipt of the event
//   response.json({received: true});


// }
//   }}

import { Request, Response } from "express";
import Stripe from "stripe";
import { inngest } from "../inngest/index.js";
import { getStripe } from "../config/stripe.js";
import { abandonUnpaidOrder, markOrderPaid } from "../utils/orderHelpers.js";

/** Marks the order paid (once) and tells the rest of the system it was placed. */
async function fulfillOrder(orderId: string) {
  const justPaid = await markOrderPaid(orderId);
  if (justPaid) {
    // Stock was already reserved when the order was created, so only the
    // "order placed" event (rider auto-assignment) is needed here.
    try {
      await inngest.send({ name: "order/placed", data: { orderId } });
    } catch (error) {
      console.error("Inngest send failed:", error);
    }
  }
}

/** Finds the order id for a PaymentIntent (older payments may not carry it in their metadata). */
async function orderIdForPaymentIntent(pi: Stripe.PaymentIntent): Promise<string | undefined> {
  if (pi.metadata?.orderId) return pi.metadata.orderId;
  const sessions = await getStripe().checkout.sessions.list({ payment_intent: pi.id, limit: 1 });
  return sessions.data[0]?.metadata?.orderId;
}

//POST /api/stripe  (raw body - registered before express.json in server.ts)
export const stripeWebhook = async (req: Request, res: Response) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return res.status(500).send("Webhook secret is not configured");
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"] as string,
      endpointSecret
    );
  } catch (error: any) {
    console.error("Stripe signature check failed:", error.message);
    return res.status(400).send("Invalid signature");
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid" && session.metadata?.orderId) {
          await fulfillOrder(session.metadata.orderId);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const orderId = await orderIdForPaymentIntent(event.data.object as Stripe.PaymentIntent);
        if (orderId) await fulfillOrder(orderId);
        break;
      }

      // The customer never paid: give the reserved stock back.
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.orderId) await abandonUnpaidOrder(session.metadata.orderId);
        break;
      }

      // payment_intent.payment_failed is deliberately ignored: Stripe lets the customer
      // retry inside the same checkout session, so the order must not be deleted yet.
      default:
        break;
    }

    // Always acknowledge, otherwise Stripe keeps retrying the event
    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler failed:", error);
    // A 5xx makes Stripe retry later, which is what we want for a temporary failure
    res.status(500).json({ message: "Webhook handler failed" });
  }
};
