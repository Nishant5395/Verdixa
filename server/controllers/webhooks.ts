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
//     } catch (err) {
//       console.log(`⚠️ Webhook signature verification failed.`, err.message);
//       return response.sendStatus(400);
//     }

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
// }
import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const stripeWebhook = async (
  request: Request,
  response: Response
) => {
  let event: Stripe.Event;

  try {
    const signature = request.headers["stripe-signature"] as string;

    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      endpointSecret
    );
  } catch (err: any) {
    console.log(
      "⚠️ Webhook signature verification failed:",
      err.message
    );
    return response.sendStatus(400);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        // Find checkout session linked to this payment intent
        const sessions =
          await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });

        if (!sessions.data.length) {
          return response
            .status(400)
            .json({ message: "Session not found" });
        }

        const orderId =
          sessions.data[0].metadata?.orderId;

        if (!orderId) {
          return response
            .status(400)
            .json({ message: "Order ID not found" });
        }

        const existingOrder =
          await prisma.order.findUnique({
            where: { id: orderId },
          });

        if (!existingOrder) {
          return response
            .status(404)
            .json({ message: "Order not found" });
        }

        // Prevent duplicate processing
        if (existingOrder.isPaid) {
          return response.json({
            received: true,
          });
        }

        // Mark order as paid
        const paidOrder =
          await prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true },
          });

        const orderItems = Array.isArray(
          paidOrder.items
        )
          ? (paidOrder.items as any[])
          : [];

        // Decrease stock
        for (const item of orderItems) {
          await prisma.product.update({
            where: { id: item.product },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Inventory events
        for (const item of orderItems) {
          await inngest.send({
            name: "inventory/stock.updated",
            data: {
              productId: item.product,
            },
          });
        }

        // Order placed event
        await inngest.send({
          name: "order/placed",
          data: { orderId },
        });

        break;
      }

      case "payment_intent.payment_failed":
      case "payment_intent.canceled": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        const sessions =
          await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });

        if (!sessions.data.length) {
          break;
        }

        const orderId =
          sessions.data[0].metadata?.orderId;

        if (!orderId) {
          break;
        }

        await prisma.order.delete({
          where: { id: orderId },
        });

        break;
      }

      default:
        console.log(
          `Unhandled event type ${event.type}`
        );
    }

    return response.json({
      received: true,
    });
  } catch (error: any) {
    console.error(
      "Stripe webhook error:",
      error.message
    );

    return response.status(500).json({
      message: "Webhook processing failed",
    });
  }
};