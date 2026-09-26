

// // // import { Request, Response } from "express";
// // // import { prisma } from "../config/prisma.js";
// // // import { inngest } from "../inngest/index.js";
// // // import Stripe from 'stripe'

// // // //Create order
// // // //POST/api/orders

// // // export const createOrder=async(req:Request,res:Response)=>{
// // //     const {items,shippingAddress,paymentMethod}=req.body;

// // //     //Check if order items are empty
// // //     if(!items || items.length===0){
// // //         return res.status(400).json({message:"No order items"})
// // //     }
// // //     //Look up actual prices from the database
// // //     const productIds=items.map((i:any)=>i.product);
// // //     const products=await prisma.product.findMany({where:{id:{in:productIds}}})

// // //     const productMap:Record<string,(typeof products)[0]>={}
// // //     products.forEach((p:any)=>(productMap[p.id]=p))

// // //     //Check if product is in stock
// // //     for(const item of items){
// // //         const product=productMap[item.product]
// // //         if(!product || (product.stock ?? 0)<item.quantity){
// // //             return res.status(404).json({message:"Product out of stock"})
// // //         }
// // //     }
// // //     const orderItems=items.map((item:any)=>{
// // //         const dpProduct=productMap[item.product];
// // //         if(!dpProduct)throw new Error(`Product ${item.product} not found`);
// // //         return {
// // //             product:dpProduct.id,
// // //             name:dpProduct.name,
// // //             image:dpProduct.image,
// // //             price:dpProduct.price,
// // //             quantity:item.quantity,
// // //             unit:dpProduct.unit,
            
// // //         }
// // //     })
// // //     const subtotal=orderItems.reduce((sum:number,item:any)=>sum+item.price*item.quantity,0)
// // //     const deliveryFee=subtotal>20?0:1.99;
// // //     const tax=Math.round(subtotal*0.08*100)/100;
// // //     const total=Math.round((subtotal+deliveryFee+tax)*100)/100;
// // //     const order=await prisma.order.create({
// // //         data:{
// // //             userId:req.user!.id,
// // //             items:orderItems,
// // //             shippingAddress,
// // //             paymentMethod,
// // //             subtotal,
// // //             deliveryFee,
// // //             tax,
// // //             total,
// // //             statusHistory:[{status:"Placed",note:"order placed successfully",timestamp:new Date()}]
// // //         }
// // //     })
// // //     if(paymentMethod=="card"){
// // //         //stripe payment link
// // //         const stripe=new Stripe(process.env.STRIPE_SECRET_KEY as string)
// // //         //create session
// // // const session = await stripe.checkout.sessions.create({
// // //   success_url: `${req.headers.origin}/orders?clearCart=true`,
// // //   cancel_url:`${req.headers.origin}/checkout`,
// // //   line_items: [
// // //     {
// // //       price_data: {
// // //         currency:"usd",
// // //         product_data:{
// // //             name:"Payment Groceries"
// // //         },
// // //         unit_amount:Math.round(total*100)
// // //       },
// // //       quantity: 1,
// // //     },
// // //   ],
// // //   mode: 'payment',
// // //   metadata:{orderId:order.id}
// // // });
// // // return res.json({url:session.url})
// // //     }
// // //     res.json({order})

// // //     //Decrease stock
// // //     for(const item of orderItems){
// // //         await prisma.product.update({
// // //             where:{id:item.product},
// // //             data:{stock:{decrement:item.quantity}}
// // //         })
// // //     }

// // //     //Send stock update events for each product in the order
// // //     for(const item of orderItems){
// // //         await inngest.send({name:"inventory/stock.updated",data:{productId:item.product}})
// // //     }
// // //     await inngest.send({name:"order/placed",data:{orderId:order.id}})
// // // }

// // // //Get user's orders
// // // //GET/api/orders


// // // export const getUserOrders=async(req:Request,res:Response)=>{
// // //     const {status}=req.query;
// // //     const where:any={
// // //         userId:req.user!.id,
// // //         NOT:[{paymentMethod:"card",isPaid:false}]
// // //     }
// // //     if(status && status !=="all"){
// // //         where.status=status;
// // //     }
// // //     const orders=await prisma.order.findMany({
// // //         where,
// // //         include:{deliveryPartner:{select:{name:true,phone:true}}},
// // //         orderBy:{createdAt:"desc"},
// // //     })
// // //     res.json({orders})
// // // }


// // // //Get single order
// // // //GET /api/orders/:id

// // // export const getOrder=async(req:Request,res:Response)=>{
// // // const order=await prisma.order.findFirst({
// // //     where:{id:req.params.id as string,userId:req.user!.id},
// // //     include:{deliveryPartner:{select:{name:true,phone:true,avatar:true,vehicleType:true}}}
// // // })
// // // if(!order){
// // //     return res.status(400).json({message:"Order not found"});
// // // }
// // // res.json({order})
// // // }

// // // //Update order status (admin)
// // // //PUT/api/orders/:id/status

// // // export const updateOrderStatus=async(req:Request,res:Response)=>{
// // // const {status,note}=req.body;
// // // const order=await prisma.order.findUnique({where:{id:req.params.id as string}})
// // // if(!order){
// // //     return res.status(404).json({message:"Order not found"});
// // // }
// // // const history=(Array.isArray(order.statusHistory)?order.statusHistory:[])as any[];
// // // history.push({status,note:note|| `Order ${status.toLowerCase()}`,timestamp:new Date()})

// // // const updatedOrder=await prisma.order.update({
// // //     where:{id:req.params.id as string},
// // //     data:{status,statusHistory:history}
// // // })
// // // res.json({order:updatedOrder})
// // // }

// // // //Get all orders (admin)
// // // //GET/api/orders/all
// // // export const getAllOrders=async(req:Request,res:Response)=>{
   
// // //     const orders=await prisma.order.findMany({
// // //         where:{NOT:[{paymentMethod:"card",isPaid:false}]},
// // //         include:{
// // //             user:{select:{name:true,email:true}},
// // //         deliveryPartner:{select:{name:true,phone:true,email:true}}
// // //     },
// // //     orderBy:{createdAt:"desc"},
       
// // //     })
// // //     res.json({orders})
// // // }

// // // //Get order Location
// // // //GET /api/orders/:id/location
// // // export const getOrderLocation=async (req:Request,res:Response)=>{
// // //     const order=await prisma.order.findFirst({
// // //         where:{id:req.params.id as string,userId:req.user!.id},
// // //         select:{liveLocation:true,status:true}
// // //     })
// // //     if(!order)return res.status(404).json({message:"Order not found"});
// // //     res.json({liveLocation:order.liveLocation,status:order.status})
// // // }

// // import { Request, Response } from "express";
// // import { z } from "zod";
// // import { prisma } from "../config/prisma.js";
// // import type { Prisma } from "../generated/prisma/client.js";
// // import { inngest } from "../inngest/index.js";
// // import { getStripe } from "../config/stripe.js";
// // import { computeTotals, getPricing, MAX_QTY_PER_ITEM, round2 } from "../config/pricing.js";
// // import { HttpError } from "../utils/errors.js";
// // import { evaluateCoupon, redeemCoupon } from "../utils/coupon.js";
// // import {
// //   appendHistory,
// //   ORDER_STATUSES,
// //   releaseOrderResources,
// //   TERMINAL_STATUSES,
// //   visibleOrdersFilter,
// // } from "../utils/orderHelpers.js";

// // /* ------------------------------------------------------------------ */
// // /*  Validation                                                         */
// // /* ------------------------------------------------------------------ */

// // const cartItemSchema = z.object({
// //   product: z.string().min(1, "Product is required"),
// //   quantity: z.coerce
// //     .number()
// //     .int("Quantity must be a whole number")
// //     .min(1, "Quantity must be at least 1")
// //     .max(MAX_QTY_PER_ITEM, `You can order at most ${MAX_QTY_PER_ITEM} of one item`),
// // });

// // const itemsSchema = z.array(cartItemSchema).min(1, "Your cart is empty").max(100);

// // const addressSchema = z.object({
// //   label: z.string().trim().max(40).default("Home"),
// //   address: z.string().trim().min(1, "Delivery address is required").max(300),
// //   city: z.string().trim().min(1, "City is required").max(100),
// //   state: z.string().trim().max(100).default(""),
// //   zip: z.string().trim().max(20).default(""),
// //   lat: z.coerce.number().min(-90).max(90).default(0),
// //   lng: z.coerce.number().min(-180).max(180).default(0),
// // });

// // const createOrderSchema = z.object({
// //   items: itemsSchema,
// //   shippingAddress: addressSchema,
// //   paymentMethod: z.enum(["card", "cash", "cod"]).default("card"),
// //   couponCode: z.string().trim().max(30).optional(),
// // });

// // const quoteSchema = z.object({
// //   items: itemsSchema,
// //   couponCode: z.string().trim().max(30).optional(),
// // });

// // /** Merges duplicate product lines (same product twice => one line with the summed quantity). */
// // function mergeItems(items: { product: string; quantity: number }[]) {
// //   const merged = new Map<string, number>();
// //   for (const { product, quantity } of items) {
// //     const total = (merged.get(product) ?? 0) + quantity;
// //     if (total > MAX_QTY_PER_ITEM) {
// //       throw new HttpError(400, `You can order at most ${MAX_QTY_PER_ITEM} of one item`);
// //     }
// //     merged.set(product, total);
// //   }
// //   return [...merged].map(([product, quantity]) => ({ product, quantity }));
// // }

// // const stockMessage = (name: string, stock: number | null) =>
// //   (stock ?? 0) <= 0 ? `${name} is out of stock` : `Only ${stock} of ${name} left in stock`;

// // /** Sends events to Inngest without ever failing the request if Inngest is unreachable. */
// // async function sendEvents(events: { name: string; data: Record<string, unknown> }[]) {
// //   if (events.length === 0) return;
// //   try {
// //     await inngest.send(events);
// //   } catch (error) {
// //     console.error("Inngest send failed:", error);
// //   }
// // }

// // /* ------------------------------------------------------------------ */
// // /*  Quote (price breakdown, used by the checkout page)                 */
// // /* ------------------------------------------------------------------ */

// // //POST /api/orders/quote
// // export const quoteOrder = async (req: Request, res: Response) => {
// //   const { items, couponCode } = quoteSchema.parse(req.body);
// //   const lines = mergeItems(items);

// //   const products = await prisma.product.findMany({
// //     where: { id: { in: lines.map((l) => l.product) } },
// //   });
// //   const byId = new Map(products.map((p) => [p.id, p]));

// //   let subtotal = 0;
// //   const stockIssues: { product: string; name: string; available: number }[] = [];
// //   for (const line of lines) {
// //     const p = byId.get(line.product);
// //     if (!p) throw new HttpError(400, "One of the items in your cart is no longer available");
// //     subtotal += p.price * line.quantity;
// //     if ((p.stock ?? 0) < line.quantity) {
// //       stockIssues.push({ product: p.id, name: p.name, available: p.stock ?? 0 });
// //     }
// //   }
// //   subtotal = round2(subtotal);

// //   let discount = 0;
// //   let coupon: { code: string; description: string | null } | null = null;
// //   let couponError: string | undefined;
// //   if (couponCode) {
// //     const result = await evaluateCoupon(prisma, couponCode, req.user!.id, subtotal);
// //     if (result.valid) {
// //       discount = result.discount;
// //       coupon = { code: result.coupon.code, description: result.coupon.description };
// //     } else {
// //       couponError = result.message;
// //     }
// //   }

// //   res.json({
// //     ...computeTotals(subtotal, discount),
// //     coupon,
// //     couponError,
// //     stockIssues,
// //     currency: getPricing().currency,
// //   });
// // };

// // /* ------------------------------------------------------------------ */
// // /*  Create order                                                       */
// // /* ------------------------------------------------------------------ */

// // //Create order
// // //POST/api/orders
// // export const createOrder = async (req: Request, res: Response) => {
// //   const input = createOrderSchema.parse(req.body);
// //   const userId = req.user!.id;
// //   const lines = mergeItems(input.items);
// //   const paymentMethod = input.paymentMethod === "cod" ? "cash" : input.paymentMethod;

// //   // Everything that must succeed together happens in ONE transaction:
// //   // stock check + stock reservation + coupon redemption + order creation.
// //   // If anything fails, nothing is kept (no half-reserved stock, no burned coupon).
// //   const { order, orderItems, totals } = await prisma.$transaction(
// //     async (tx) => {
// //       const products = await tx.product.findMany({
// //         where: { id: { in: lines.map((l) => l.product) } },
// //       });
// //       const byId = new Map(products.map((p) => [p.id, p]));

// //       const orderItems: {
// //         product: string;
// //         name: string;
// //         image: string;
// //         price: number;
// //         quantity: number;
// //         unit: string | null;
// //       }[] = [];

// //       for (const line of lines) {
// //         const p = byId.get(line.product);
// //         if (!p) throw new HttpError(400, "One of the items in your cart is no longer available");

// //         // Atomic: only decrements if enough stock is still there right now,
// //         // so two people buying the last item can never both succeed.
// //         const reserved = await tx.product.updateMany({
// //           where: { id: p.id, stock: { gte: line.quantity } },
// //           data: { stock: { decrement: line.quantity } },
// //         });
// //         if (reserved.count === 0) throw new HttpError(409, stockMessage(p.name, p.stock));

// //         orderItems.push({
// //           product: p.id,
// //           name: p.name,
// //           image: p.image,
// //           price: p.price, // price always comes from the database, never from the client
// //           quantity: line.quantity,
// //           unit: p.unit,
// //         });
// //       }

// //       const subtotal = round2(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0));

// //       let discount = 0;
// //       let couponCode: string | null = null;
// //       if (input.couponCode) {
// //         const result = await evaluateCoupon(tx, input.couponCode, userId, subtotal);
// //         if (!result.valid) throw new HttpError(400, result.message);
// //         if (!(await redeemCoupon(tx, result.coupon.id))) {
// //           throw new HttpError(400, "This coupon has been fully redeemed");
// //         }
// //         discount = result.discount;
// //         couponCode = result.coupon.code;
// //       }

// //       const totals = computeTotals(subtotal, discount);
// //       const fullyDiscounted = paymentMethod === "card" && totals.total <= 0;

// //       const order = await tx.order.create({
// //         data: {
// //           userId,
// //           items: orderItems,
// //           shippingAddress: input.shippingAddress,
// //           paymentMethod,
// //           subtotal: totals.subtotal,
// //           deliveryFee: totals.deliveryFee,
// //           tax: totals.tax,
// //           total: totals.total,
// //           discount: totals.discount,
// //           couponCode,
// //           isPaid: fullyDiscounted,
// //           stockReserved: true,
// //           statusHistory: [{ status: "Placed", note: "Order placed successfully", timestamp: new Date() }],
// //         },
// //       });

// //       return { order, orderItems, totals };
// //     },
// //     { maxWait: 5000, timeout: 20000 }
// //   );

// //   const stockEvents = orderItems.map((i) => ({
// //     name: "inventory/stock.updated",
// //     data: { productId: i.product },
// //   }));

// //   // ----- Card payment: send the customer to Stripe -----
// //   if (paymentMethod === "card" && totals.total > 0) {
// //     const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";
// //     try {
// //       const session = await getStripe().checkout.sessions.create({
// //         success_url: `${origin}/orders?clearCart=true`,
// //         cancel_url: `${origin}/checkout`,
// //         line_items: [
// //           {
// //             price_data: {
// //               currency: getPricing().currency,
// //               product_data: { name: "Instacart grocery order" },
// //               unit_amount: Math.round(totals.total * 100),
// //             },
// //             quantity: 1,
// //           },
// //         ],
// //         mode: "payment",
// //         client_reference_id: order.id,
// //         metadata: { orderId: order.id },
// //         // Also stored on the PaymentIntent so payment_intent.* webhooks know which order it is
// //         payment_intent_data: { metadata: { orderId: order.id } },
// //         // Unpaid stock is held for 30 minutes at most
// //         expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
// //       });

// //       await sendEvents(stockEvents);
// //       return res.json({ url: session.url });
// //     } catch (error) {
// //       console.error("Stripe session creation failed:", error);
// //       // Give the reserved stock back and drop the unpaid order
// //       await releaseOrderResources(order.id);
// //       await prisma.order.deleteMany({ where: { id: order.id, isPaid: false } });
// //       throw new HttpError(
// //         502,
// //         "We couldn't start the payment. Please try again or choose Cash on Delivery."
// //       );
// //     }
// //   }

// //   // ----- Cash on delivery (or a fully discounted order): it's confirmed right away -----
// //   await sendEvents([...stockEvents, { name: "order/placed", data: { orderId: order.id } }]);
// //   res.json({ order });
// // };

// // /* ------------------------------------------------------------------ */
// // /*  Reading orders                                                     */
// // /* ------------------------------------------------------------------ */

// // //Get user's orders
// // //GET/api/orders
// // export const getUserOrders = async (req: Request, res: Response) => {
// //   const { status } = req.query;
// //   const where: any = { userId: req.user!.id, ...visibleOrdersFilter };
// //   if (status && status !== "all") {
// //     where.status = status;
// //   }
// //   const orders = await prisma.order.findMany({
// //     where,
// //     include: { deliveryPartner: { select: { name: true, phone: true } } },
// //     orderBy: { createdAt: "desc" },
// //   });
// //   res.json({ orders });
// // };

// // //Get single order
// // //GET /api/orders/:id
// // export const getOrder = async (req: Request, res: Response) => {
// //   const order = await prisma.order.findFirst({
// //     where: { id: req.params.id as string, userId: req.user!.id },
// //     include: {
// //       deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } },
// //     },
// //   });
// //   if (!order) throw new HttpError(404, "Order not found");
// //   res.json({ order });
// // };

// // //Update order status (admin)
// // //PUT/api/orders/:id/status
// // export const updateOrderStatus = async (req: Request, res: Response) => {
// //   const { status, note } = z
// //     .object({
// //       status: z.enum(ORDER_STATUSES, { message: "Invalid order status" }),
// //       note: z.string().trim().max(300).optional(),
// //     })
// //     .parse(req.body);

// //   const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });
// //   if (!order) throw new HttpError(404, "Order not found");

// //   if (TERMINAL_STATUSES.includes(order.status)) {
// //     throw new HttpError(400, `This order is already ${order.status.toLowerCase()} and can't be changed`);
// //   }
// //   if (order.status === status) {
// //     throw new HttpError(400, `Order is already ${status}`);
// //   }

// //   const data: Prisma.OrderUpdateInput = {
// //     status,
// //     statusHistory: appendHistory(order.statusHistory, status, note || `Order ${status.toLowerCase()}`),
// //   };
// //   if (status === "Delivered") {
// //     // Cash orders are paid when they are handed over
// //     if (order.paymentMethod !== "card") data.isPaid = true;
// //   }

// //   const updatedOrder = await prisma.order.update({ where: { id: order.id }, data });

// //   // Cancelling gives the stock (and coupon use) back. NOTE: refunds for paid card orders
// //   // are not automated yet - do those from the Stripe dashboard.
// //   if (status === "Cancelled") await releaseOrderResources(order.id);

// //   res.json({ order: updatedOrder });
// // };

// // //Get all orders (admin)
// // //GET/api/orders/all
// // export const getAllOrders = async (req: Request, res: Response) => {
// //   const orders = await prisma.order.findMany({
// //     where: visibleOrdersFilter,
// //     include: {
// //       user: { select: { name: true, email: true } },
// //       deliveryPartner: { select: { name: true, phone: true, email: true } },
// //     },
// //     orderBy: { createdAt: "desc" },
// //   });
// //   res.json({ orders });
// // };

// // //Get order Location
// // //GET /api/orders/:id/location
// // export const getOrderLocation = async (req: Request, res: Response) => {
// //   const order = await prisma.order.findFirst({
// //     where: { id: req.params.id as string, userId: req.user!.id },
// //     select: { liveLocation: true, status: true },
// //   });
// //   if (!order) throw new HttpError(404, "Order not found");
// //   res.json({ liveLocation: order.liveLocation, status: order.status });
// // };

// import { Request, Response } from "express";
// import { z } from "zod";
// import { prisma } from "../config/prisma.js";
// import type { Prisma } from "../generated/prisma/client.js";
// import { inngest } from "../inngest/index.js";
// import { getStripe } from "../config/stripe.js";
// import { computeTotals, getPricing, MAX_QTY_PER_ITEM, round2 } from "../config/pricing.js";
// import { HttpError } from "../utils/errors.js";
// import { evaluateCoupon, redeemCoupon } from "../utils/coupon.js";
// import {
//   appendHistory,
//   ORDER_STATUSES,
//   releaseOrderResources,
//   TERMINAL_STATUSES,
//   visibleOrdersFilter,
// } from "../utils/orderHelpers.js";

// /* ------------------------------------------------------------------ */
// /*  Validation                                                         */
// /* ------------------------------------------------------------------ */

// const cartItemSchema = z.object({
//   product: z.string().min(1, "Product is required"),
//   quantity: z.coerce
//     .number()
//     .int("Quantity must be a whole number")
//     .min(1, "Quantity must be at least 1")
//     .max(MAX_QTY_PER_ITEM, `You can order at most ${MAX_QTY_PER_ITEM} of one item`),
// });

// const itemsSchema = z.array(cartItemSchema).min(1, "Your cart is empty").max(100);

// const addressSchema = z.object({
//   label: z.string().trim().max(40).default("Home"),
//   address: z.string().trim().min(1, "Delivery address is required").max(300),
//   city: z.string().trim().min(1, "City is required").max(100),
//   state: z.string().trim().max(100).default(""),
//   zip: z.string().trim().max(20).default(""),
//   country: z.string().trim().max(100).default("India"),
//   lat: z.coerce.number().min(-90).max(90).default(0),
//   lng: z.coerce.number().min(-180).max(180).default(0),
// });

// const createOrderSchema = z.object({
//   items: itemsSchema,
//   shippingAddress: addressSchema,
//   paymentMethod: z.enum(["card", "cash", "cod"]).default("card"),
//   couponCode: z.string().trim().max(30).optional(),
// });

// const quoteSchema = z.object({
//   items: itemsSchema,
//   couponCode: z.string().trim().max(30).optional(),
// });

// /** Merges duplicate product lines (same product twice => one line with the summed quantity). */
// function mergeItems(items: { product: string; quantity: number }[]) {
//   const merged = new Map<string, number>();
//   for (const { product, quantity } of items) {
//     const total = (merged.get(product) ?? 0) + quantity;
//     if (total > MAX_QTY_PER_ITEM) {
//       throw new HttpError(400, `You can order at most ${MAX_QTY_PER_ITEM} of one item`);
//     }
//     merged.set(product, total);
//   }
//   return [...merged].map(([product, quantity]) => ({ product, quantity }));
// }

// const stockMessage = (name: string, stock: number | null) =>
//   (stock ?? 0) <= 0 ? `${name} is out of stock` : `Only ${stock} of ${name} left in stock`;

// /** Sends events to Inngest without ever failing the request if Inngest is unreachable. */
// async function sendEvents(events: { name: string; data: Record<string, unknown> }[]) {
//   if (events.length === 0) return;
//   try {
//     await inngest.send(events);
//   } catch (error) {
//     console.error("Inngest send failed:", error);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*  Quote (price breakdown, used by the checkout page)                 */
// /* ------------------------------------------------------------------ */

// //POST /api/orders/quote
// export const quoteOrder = async (req: Request, res: Response) => {
//   const { items, couponCode } = quoteSchema.parse(req.body);
//   const lines = mergeItems(items);

//   const products = await prisma.product.findMany({
//     where: { id: { in: lines.map((l) => l.product) } },
//   });
//   const byId = new Map(products.map((p) => [p.id, p]));

//   let subtotal = 0;
//   const stockIssues: { product: string; name: string; available: number }[] = [];
//   for (const line of lines) {
//     const p = byId.get(line.product);
//     if (!p) throw new HttpError(400, "One of the items in your cart is no longer available");
//     subtotal += p.price * line.quantity;
//     if ((p.stock ?? 0) < line.quantity) {
//       stockIssues.push({ product: p.id, name: p.name, available: p.stock ?? 0 });
//     }
//   }
//   subtotal = round2(subtotal);

//   let discount = 0;
//   let coupon: { code: string; description: string | null } | null = null;
//   let couponError: string | undefined;
//   if (couponCode) {
//     const result = await evaluateCoupon(prisma, couponCode, req.user!.id, subtotal);
//     if (result.valid) {
//       discount = result.discount;
//       coupon = { code: result.coupon.code, description: result.coupon.description };
//     } else {
//       couponError = result.message;
//     }
//   }

//   res.json({
//     ...computeTotals(subtotal, discount),
//     coupon,
//     couponError,
//     stockIssues,
//     currency: getPricing().currency,
//   });
// };

// /* ------------------------------------------------------------------ */
// /*  Create order                                                       */
// /* ------------------------------------------------------------------ */

// //Create order
// //POST/api/orders
// export const createOrder = async (req: Request, res: Response) => {
//   const input = createOrderSchema.parse(req.body);
//   const userId = req.user!.id;
//   const lines = mergeItems(input.items);
//   const paymentMethod = input.paymentMethod === "cod" ? "cash" : input.paymentMethod;

//   // Everything that must succeed together happens in ONE transaction:
//   // stock check + stock reservation + coupon redemption + order creation.
//   // If anything fails, nothing is kept (no half-reserved stock, no burned coupon).
//   const { order, orderItems, totals } = await prisma.$transaction(
//     async (tx) => {
//       const products = await tx.product.findMany({
//         where: { id: { in: lines.map((l) => l.product) } },
//       });
//       const byId = new Map(products.map((p) => [p.id, p]));

//       const orderItems: {
//         product: string;
//         name: string;
//         image: string;
//         price: number;
//         quantity: number;
//         unit: string | null;
//       }[] = [];

//       for (const line of lines) {
//         const p = byId.get(line.product);
//         if (!p) throw new HttpError(400, "One of the items in your cart is no longer available");

//         // Atomic: only decrements if enough stock is still there right now,
//         // so two people buying the last item can never both succeed.
//         const reserved = await tx.product.updateMany({
//           where: { id: p.id, stock: { gte: line.quantity } },
//           data: { stock: { decrement: line.quantity } },
//         });
//         if (reserved.count === 0) throw new HttpError(409, stockMessage(p.name, p.stock));

//         orderItems.push({
//           product: p.id,
//           name: p.name,
//           image: p.image,
//           price: p.price, // price always comes from the database, never from the client
//           quantity: line.quantity,
//           unit: p.unit,
//         });
//       }

//       const subtotal = round2(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0));

//       let discount = 0;
//       let couponCode: string | null = null;
//       if (input.couponCode) {
//         const result = await evaluateCoupon(tx, input.couponCode, userId, subtotal);
//         if (!result.valid) throw new HttpError(400, result.message);
//         if (!(await redeemCoupon(tx, result.coupon.id))) {
//           throw new HttpError(400, "This coupon has been fully redeemed");
//         }
//         discount = result.discount;
//         couponCode = result.coupon.code;
//       }

//       const totals = computeTotals(subtotal, discount);
//       const fullyDiscounted = paymentMethod === "card" && totals.total <= 0;

//       const order = await tx.order.create({
//         data: {
//           userId,
//           items: orderItems,
//           shippingAddress: input.shippingAddress,
//           paymentMethod,
//           subtotal: totals.subtotal,
//           deliveryFee: totals.deliveryFee,
//           tax: totals.tax,
//           total: totals.total,
//           discount: totals.discount,
//           couponCode,
//           isPaid: fullyDiscounted,
//           stockReserved: true,
//           statusHistory: [{ status: "Placed", note: "Order placed successfully", timestamp: new Date() }],
//         },
//       });

//       return { order, orderItems, totals };
//     },
//     { maxWait: 5000, timeout: 20000 }
//   );

//   const stockEvents = orderItems.map((i) => ({
//     name: "inventory/stock.updated",
//     data: { productId: i.product },
//   }));

//   // ----- Card payment: send the customer to Stripe -----
//   if (paymentMethod === "card" && totals.total > 0) {
//     const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";
//     try {
//       const session = await getStripe().checkout.sessions.create({
//         success_url: `${origin}/orders?clearCart=true`,
//         cancel_url: `${origin}/checkout`,
//         line_items: [
//           {
//             price_data: {
//               currency: getPricing().currency,
//               product_data: { name: "Instacart grocery order" },
//               unit_amount: Math.round(totals.total * 100),
//             },
//             quantity: 1,
//           },
//         ],
//         mode: "payment",
//         client_reference_id: order.id,
//         metadata: { orderId: order.id },
//         // Also stored on the PaymentIntent so payment_intent.* webhooks know which order it is
//         payment_intent_data: { metadata: { orderId: order.id } },
//         // Unpaid stock is held for 30 minutes at most
//         expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
//       });

//       await sendEvents(stockEvents);
//       return res.json({ url: session.url });
//     } catch (error) {
//       console.error("Stripe session creation failed:", error);
//       // Give the reserved stock back and drop the unpaid order
//       await releaseOrderResources(order.id);
//       await prisma.order.deleteMany({ where: { id: order.id, isPaid: false } });
//       throw new HttpError(
//         502,
//         "We couldn't start the payment. Please try again or choose Cash on Delivery."
//       );
//     }
//   }

//   // ----- Cash on delivery (or a fully discounted order): it's confirmed right away -----
//   await sendEvents([...stockEvents, { name: "order/placed", data: { orderId: order.id } }]);
//   res.json({ order });
// };

// /* ------------------------------------------------------------------ */
// /*  Reading orders                                                     */
// /* ------------------------------------------------------------------ */

// //Get user's orders
// //GET/api/orders
// export const getUserOrders = async (req: Request, res: Response) => {
//   const { status } = req.query;
//   const where: any = { userId: req.user!.id, ...visibleOrdersFilter };
//   if (status && status !== "all") {
//     where.status = status;
//   }
//   const orders = await prisma.order.findMany({
//     where,
//     include: { deliveryPartner: { select: { name: true, phone: true } } },
//     orderBy: { createdAt: "desc" },
//   });
//   res.json({ orders });
// };

// //Get single order
// //GET /api/orders/:id
// export const getOrder = async (req: Request, res: Response) => {
//   const order = await prisma.order.findFirst({
//     where: { id: req.params.id as string, userId: req.user!.id },
//     include: {
//       deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } },
//     },
//   });
//   if (!order) throw new HttpError(404, "Order not found");
//   res.json({ order });
// };

// //Update order status (admin)
// //PUT/api/orders/:id/status
// export const updateOrderStatus = async (req: Request, res: Response) => {
//   const { status, note } = z
//     .object({
//       status: z.enum(ORDER_STATUSES, { message: "Invalid order status" }),
//       note: z.string().trim().max(300).optional(),
//     })
//     .parse(req.body);

//   const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });
//   if (!order) throw new HttpError(404, "Order not found");

//   if (TERMINAL_STATUSES.includes(order.status)) {
//     throw new HttpError(400, `This order is already ${order.status.toLowerCase()} and can't be changed`);
//   }
//   if (order.status === status) {
//     throw new HttpError(400, `Order is already ${status}`);
//   }

//   const data: Prisma.OrderUpdateInput = {
//     status,
//     statusHistory: appendHistory(order.statusHistory, status, note || `Order ${status.toLowerCase()}`),
//   };
//   if (status === "Delivered") {
//     // Cash orders are paid when they are handed over
//     if (order.paymentMethod !== "card") data.isPaid = true;
//   }

//   const updatedOrder = await prisma.order.update({ where: { id: order.id }, data });

//   // Cancelling gives the stock (and coupon use) back. NOTE: refunds for paid card orders
//   // are not automated yet - do those from the Stripe dashboard.
//   if (status === "Cancelled") await releaseOrderResources(order.id);

//   res.json({ order: updatedOrder });
// };

// //Get all orders (admin)
// //GET/api/orders/all
// export const getAllOrders = async (req: Request, res: Response) => {
//   const orders = await prisma.order.findMany({
//     where: visibleOrdersFilter,
//     include: {
//       user: { select: { name: true, email: true } },
//       deliveryPartner: { select: { name: true, phone: true, email: true } },
//     },
//     orderBy: { createdAt: "desc" },
//   });
//   res.json({ orders });
// };

// //Get order Location
// //GET /api/orders/:id/location
// export const getOrderLocation = async (req: Request, res: Response) => {
//   const order = await prisma.order.findFirst({
//     where: { id: req.params.id as string, userId: req.user!.id },
//     select: { liveLocation: true, status: true },
//   });
//   if (!order) throw new HttpError(404, "Order not found");
//   res.json({ liveLocation: order.liveLocation, status: order.status });
// };

import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { inngest } from "../inngest/index.js";
import { getStripe } from "../config/stripe.js";
import { computeTotals, getPricing, MAX_QTY_PER_ITEM, round2 } from "../config/pricing.js";
import { HttpError } from "../utils/errors.js";
import { evaluateCoupon, redeemCoupon } from "../utils/coupon.js";
import {
  appendHistory,
  CUSTOMER_CANCELLABLE_STATUSES,
  ORDER_STATUSES,
  releaseOrderResources,
  TERMINAL_STATUSES,
  visibleOrdersFilter,
} from "../utils/orderHelpers.js";

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const cartItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(MAX_QTY_PER_ITEM, `You can order at most ${MAX_QTY_PER_ITEM} of one item`),
});

const itemsSchema = z.array(cartItemSchema).min(1, "Your cart is empty").max(100);

const addressSchema = z.object({
  label: z.string().trim().max(40).default("Home"),
  address: z.string().trim().min(1, "Delivery address is required").max(300),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().max(100).default(""),
  zip: z.string().trim().max(20).default(""),
  country: z.string().trim().max(100).default("India"),
  lat: z.coerce.number().min(-90).max(90).default(0),
  lng: z.coerce.number().min(-180).max(180).default(0),
});

const createOrderSchema = z.object({
  items: itemsSchema,
  shippingAddress: addressSchema,
  paymentMethod: z.enum(["card", "cash", "cod"]).default("card"),
  couponCode: z.string().trim().max(30).optional(),
});

const quoteSchema = z.object({
  items: itemsSchema,
  couponCode: z.string().trim().max(30).optional(),
});

/** Merges duplicate product lines (same product twice => one line with the summed quantity). */
function mergeItems(items: { product: string; quantity: number }[]) {
  const merged = new Map<string, number>();
  for (const { product, quantity } of items) {
    const total = (merged.get(product) ?? 0) + quantity;
    if (total > MAX_QTY_PER_ITEM) {
      throw new HttpError(400, `You can order at most ${MAX_QTY_PER_ITEM} of one item`);
    }
    merged.set(product, total);
  }
  return [...merged].map(([product, quantity]) => ({ product, quantity }));
}

const stockMessage = (name: string, stock: number | null) =>
  (stock ?? 0) <= 0 ? `${name} is out of stock` : `Only ${stock} of ${name} left in stock`;

/** Sends events to Inngest without ever failing the request if Inngest is unreachable. */
async function sendEvents(events: { name: string; data: Record<string, unknown> }[]) {
  if (events.length === 0) return;
  try {
    await inngest.send(events);
  } catch (error) {
    console.error("Inngest send failed:", error);
  }
}

/* ------------------------------------------------------------------ */
/*  Quote (price breakdown, used by the checkout page)                 */
/* ------------------------------------------------------------------ */

//POST /api/orders/quote
export const quoteOrder = async (req: Request, res: Response) => {
  const { items, couponCode } = quoteSchema.parse(req.body);
  const lines = mergeItems(items);

  const products = await prisma.product.findMany({
    where: { id: { in: lines.map((l) => l.product) } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const stockIssues: { product: string; name: string; available: number }[] = [];
  for (const line of lines) {
    const p = byId.get(line.product);
    if (!p) throw new HttpError(400, "One of the items in your cart is no longer available");
    subtotal += p.price * line.quantity;
    if ((p.stock ?? 0) < line.quantity) {
      stockIssues.push({ product: p.id, name: p.name, available: p.stock ?? 0 });
    }
  }
  subtotal = round2(subtotal);

  let discount = 0;
  let coupon: { code: string; description: string | null } | null = null;
  let couponError: string | undefined;
  if (couponCode) {
    const result = await evaluateCoupon(prisma, couponCode, req.user!.id, subtotal);
    if (result.valid) {
      discount = result.discount;
      coupon = { code: result.coupon.code, description: result.coupon.description };
    } else {
      couponError = result.message;
    }
  }

  res.json({
    ...computeTotals(subtotal, discount),
    coupon,
    couponError,
    stockIssues,
    currency: getPricing().currency,
  });
};

/* ------------------------------------------------------------------ */
/*  Create order                                                       */
/* ------------------------------------------------------------------ */

//Create order
//POST/api/orders
export const createOrder = async (req: Request, res: Response) => {
  const input = createOrderSchema.parse(req.body);
  const userId = req.user!.id;
  const lines = mergeItems(input.items);
  const paymentMethod = input.paymentMethod === "cod" ? "cash" : input.paymentMethod;

  // Everything that must succeed together happens in ONE transaction:
  // stock check + stock reservation + coupon redemption + order creation.
  // If anything fails, nothing is kept (no half-reserved stock, no burned coupon).
  const { order, orderItems, totals } = await prisma.$transaction(
    async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: lines.map((l) => l.product) } },
      });
      const byId = new Map(products.map((p) => [p.id, p]));

      const orderItems: {
        product: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        unit: string | null;
      }[] = [];

      for (const line of lines) {
        const p = byId.get(line.product);
        if (!p) throw new HttpError(400, "One of the items in your cart is no longer available");

        // Atomic: only decrements if enough stock is still there right now,
        // so two people buying the last item can never both succeed.
        const reserved = await tx.product.updateMany({
          where: { id: p.id, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (reserved.count === 0) throw new HttpError(409, stockMessage(p.name, p.stock));

        orderItems.push({
          product: p.id,
          name: p.name,
          image: p.image,
          price: p.price, // price always comes from the database, never from the client
          quantity: line.quantity,
          unit: p.unit,
        });
      }

      const subtotal = round2(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0));

      let discount = 0;
      let couponCode: string | null = null;
      if (input.couponCode) {
        const result = await evaluateCoupon(tx, input.couponCode, userId, subtotal);
        if (!result.valid) throw new HttpError(400, result.message);
        if (!(await redeemCoupon(tx, result.coupon.id))) {
          throw new HttpError(400, "This coupon has been fully redeemed");
        }
        discount = result.discount;
        couponCode = result.coupon.code;
      }

      const totals = computeTotals(subtotal, discount);
      const fullyDiscounted = paymentMethod === "card" && totals.total <= 0;

      const order = await tx.order.create({
        data: {
          userId,
          items: orderItems,
          shippingAddress: input.shippingAddress,
          paymentMethod,
          subtotal: totals.subtotal,
          deliveryFee: totals.deliveryFee,
          tax: totals.tax,
          total: totals.total,
          discount: totals.discount,
          couponCode,
          isPaid: fullyDiscounted,
          stockReserved: true,
          statusHistory: [{ status: "Placed", note: "Order placed successfully", timestamp: new Date() }],
        },
      });

      return { order, orderItems, totals };
    },
    { maxWait: 5000, timeout: 20000 }
  );

  const stockEvents = orderItems.map((i) => ({
    name: "inventory/stock.updated",
    data: { productId: i.product },
  }));

  // ----- Card payment: send the customer to Stripe -----
  if (paymentMethod === "card" && totals.total > 0) {
    const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";
    try {
      const session = await getStripe().checkout.sessions.create({
        success_url: `${origin}/orders?clearCart=true`,
        cancel_url: `${origin}/checkout`,
        line_items: [
          {
            price_data: {
              currency: getPricing().currency,
              product_data: { name: "Instacart grocery order" },
              unit_amount: Math.round(totals.total * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        client_reference_id: order.id,
        metadata: { orderId: order.id },
        // Also stored on the PaymentIntent so payment_intent.* webhooks know which order it is
        payment_intent_data: { metadata: { orderId: order.id } },
        // Unpaid stock is held for 30 minutes at most
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });

      await sendEvents(stockEvents);
      return res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe session creation failed:", error);
      // Give the reserved stock back and drop the unpaid order
      await releaseOrderResources(order.id);
      await prisma.order.deleteMany({ where: { id: order.id, isPaid: false } });
      throw new HttpError(
        502,
        "We couldn't start the payment. Please try again or choose Cash on Delivery."
      );
    }
  }

  // ----- Cash on delivery (or a fully discounted order): it's confirmed right away -----
  await sendEvents([...stockEvents, { name: "order/placed", data: { orderId: order.id } }]);
  res.json({ order });
};

/* ------------------------------------------------------------------ */
/*  Reading orders                                                     */
/* ------------------------------------------------------------------ */

//Get user's orders
//GET/api/orders
export const getUserOrders = async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = { userId: req.user!.id, ...visibleOrdersFilter };
  if (status && status !== "all") {
    where.status = status;
  }
  const orders = await prisma.order.findMany({
    where,
    include: { deliveryPartner: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
};

//Get single order
//GET /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    include: {
      deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } },
    },
  });
  if (!order) throw new HttpError(404, "Order not found");
  res.json({ order });
};

//Update order status (admin)
//PUT/api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status, note } = z
    .object({
      status: z.enum(ORDER_STATUSES, { message: "Invalid order status" }),
      note: z.string().trim().max(300).optional(),
    })
    .parse(req.body);

  const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });
  if (!order) throw new HttpError(404, "Order not found");

  if (TERMINAL_STATUSES.includes(order.status)) {
    throw new HttpError(400, `This order is already ${order.status.toLowerCase()} and can't be changed`);
  }
  if (order.status === status) {
    throw new HttpError(400, `Order is already ${status}`);
  }

  const data: Prisma.OrderUpdateInput = {
    status,
    statusHistory: appendHistory(order.statusHistory, status, note || `Order ${status.toLowerCase()}`),
  };
  if (status === "Delivered") {
    // Cash orders are paid when they are handed over
    if (order.paymentMethod !== "card") data.isPaid = true;
  }

  const updatedOrder = await prisma.order.update({ where: { id: order.id }, data });

  // Cancelling gives the stock (and coupon use) back. NOTE: refunds for paid card orders
  // are not automated yet - do those from the Stripe dashboard.
  if (status === "Cancelled") await releaseOrderResources(order.id);

  res.json({ order: updatedOrder });
};

//Get all orders (admin)
//GET/api/orders/all
export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: visibleOrdersFilter,
    include: {
      user: { select: { name: true, email: true } },
      deliveryPartner: { select: { name: true, phone: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
};

//Get order Location
//GET /api/orders/:id/location
export const getOrderLocation = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    select: { liveLocation: true, status: true },
  });
  if (!order) throw new HttpError(404, "Order not found");
  res.json({ liveLocation: order.liveLocation, status: order.status });
};

/* ------------------------------------------------------------------ */
/*  Customer-initiated cancellation                                    */
/* ------------------------------------------------------------------ */

//Cancel your own order (only while it hasn't started being packed)
//PUT /api/orders/:id/cancel
export const cancelMyOrder = async (req: Request, res: Response) => {
  const { reason } = z
    .object({ reason: z.string().trim().max(300).optional() })
    .parse(req.body ?? {});

  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
  });
  if (!order) throw new HttpError(404, "Order not found");

  if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
    throw new HttpError(
      400,
      order.status === "Cancelled"
        ? "This order is already cancelled"
        : "This order can no longer be cancelled - it's already being prepared. Please contact support."
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "Cancelled",
      statusHistory: appendHistory(order.statusHistory, "Cancelled", reason || "Cancelled by customer"),
      // clear so a rider can't complete a cancelled delivery with a stale code
      deliveryOtp: "",
    },
  });

  // Give the stock (and coupon use) back. Paid card orders are refunded from the
  // Stripe dashboard - this doesn't move money, only inventory and coupon usage.
  await releaseOrderResources(order.id);

  res.json({ order: updatedOrder });
};
