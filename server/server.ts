// import "dotenv/config";
// import express, { NextFunction, Request, Response } from 'express';
// import cors from "cors";
// import authRouter from "./routes/authRoutes.js";
// import productRouter from "./routes/productRoutes.js";
// import uploadRouter from "./routes/uploadRoutes.js";
// import orderRouter from "./routes/orderRoutes.js";
// import { serve } from "inngest/express";
// import { inngest, functions } from "./inngest/index.js"
// import addressRouter from "./routes/addressRoutes.js";
// import adminRouter from "./routes/adminRoutes.js";
// import deliveryPartnerRouter from "./routes/deliveryPartnerRoutes.js";
// import { stripeWebhook } from "./controllers/webhooks.js";
// const app = express();

// app.post("/api/stripe",express.raw({type:'application/json'}),stripeWebhook)

// // Middleware
// app.use(cors())
// app.use(express.json());

// const port = process.env.PORT || 5000;

// app.get('/', (req: Request, res: Response) => {
//     res.send('Server is Live!');
// });
// app.use('/api/auth',authRouter)
// app.use('/api/products',productRouter)
// app.use('/api/upload',uploadRouter)
// app.use('/api/orders',orderRouter)



// app.use("/api/inngest", serve({ client: inngest, functions }));

// app.use('/api/addresses',addressRouter)
// app.use('/api/admin',adminRouter)
// app.use('/api/delivery',deliveryPartnerRouter)


// // Error handling
// app.use((error:any,req:Request,res:Response,next:NextFunction)=>{
//     console.error(error)
//     res.status(500).json({message: error.message})
// })
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });

// import "dotenv/config";
// import express, { NextFunction, Request, Response } from 'express';
// import cors from "cors";
// import helmet from "helmet";
// import { ZodError } from "zod";
// import authRouter from "./routes/authRoutes.js";
// import productRouter from "./routes/productRoutes.js";
// import uploadRouter from "./routes/uploadRoutes.js";
// import orderRouter from "./routes/orderRoutes.js";
// import { serve } from "inngest/express";
// import { inngest, functions } from "./inngest/index.js"
// import addressRouter from "./routes/addressRoutes.js";
// import adminRouter from "./routes/adminRoutes.js";
// import deliveryPartnerRouter from "./routes/deliveryPartnerRoutes.js";
// import couponRouter from "./routes/couponRoutes.js";
// import { stripeWebhook } from "./controllers/webhooks.js";
// import { apiLimiter, authLimiter } from "./middleware/rateLimit.js";
// import { HttpError } from "./utils/errors.js";

// const app = express();

// // We sit behind Vercel's proxy: needed so rate limiting sees the real client IP
// app.set("trust proxy", 1);

// // Stripe needs the raw body to verify its signature, so this must come before express.json()
// app.post("/api/stripe",express.raw({type:'application/json'}),stripeWebhook)

// // Middleware
// app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))

// // CORS: open by default (same as before). To lock it to your frontend, set
// // CORS_ORIGINS=https://your-frontend.vercel.app  (comma separated for several)
// const allowedOrigins=(process.env.CORS_ORIGINS||"")
//     .split(",")
//     .map((o)=>o.trim().replace(/\/+$/,""))
//     .filter(Boolean);
// app.use(cors(allowedOrigins.length>0?{
//     origin:(origin,callback)=>callback(null,!origin || allowedOrigins.includes(origin)),
// }:undefined))
// app.use(express.json({limit:"1mb"}));

// const port = process.env.PORT || 5000;

// if(!process.env.JWT_SECRET) console.error("WARNING: JWT_SECRET is not set - logins will fail");
// if(!process.env.DATABASE_URL) console.error("WARNING: DATABASE_URL is not set");

// app.get('/', (req: Request, res: Response) => {
//     res.send('Server is Live!');
// });

// // Inngest calls this itself, so it is not rate limited
// app.use("/api/inngest", serve({ client: inngest, functions }));

// app.use('/api',apiLimiter)
// app.use('/api/auth',authLimiter,authRouter)
// app.use('/api/products',productRouter)
// app.use('/api/upload',uploadRouter)
// app.use('/api/orders',orderRouter)
// app.use('/api/coupons',couponRouter)
// app.use('/api/addresses',addressRouter)
// app.use('/api/admin',adminRouter)
// app.use('/api/delivery',deliveryPartnerRouter)

// app.use((req:Request,res:Response)=>{
//     res.status(404).json({message:"Route not found"})
// })

// // Error handling: every controller can simply throw
// app.use((error:any,req:Request,res:Response,next:NextFunction)=>{
//     if(res.headersSent) return next(error);

//     // Validation errors -> 400 with the first problem in plain words
//     if(error instanceof ZodError){
//         const issue=error.issues[0];
//         const field=issue?.path?.length?`${issue.path.join(".")}: `:"";
//         return res.status(400).json({message:`${field}${issue?.message||"Invalid input"}`})
//     }
//     if(error instanceof HttpError){
//         return res.status(error.status).json({message:error.message})
//     }
//     // Client mistakes raised by libraries (bad JSON, upload too large, ...)
//     const status=Number(error?.status||error?.statusCode);
//     if((status>=400 && status<500) || error?.name==="MulterError"){
//         return res.status(status>=400&&status<500?status:400).json({message:error.message})
//     }

//     console.error(error)
//     // Don't leak internals (database errors, file paths) to users in production
//     const message=process.env.NODE_ENV==="production"
//         ?"Something went wrong. Please try again."
//         :error.message;
//     res.status(500).json({message})
// })
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });


import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import helmet from "helmet";
import { ZodError } from "zod";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import deliveryPartnerRouter from "./routes/deliveryPartnerRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import { stripeWebhook } from "./controllers/webhooks.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimit.js";
import { HttpError } from "./utils/errors.js";

const app = express();

// We sit behind Vercel's proxy: needed so rate limiting sees the real client IP
app.set("trust proxy", 1);

// Stripe needs the raw body to verify its signature, so this must come before express.json()
app.post("/api/stripe",express.raw({type:'application/json'}),stripeWebhook)

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))

// CORS: open by default (same as before). To lock it to your frontend, set
// CORS_ORIGINS=https://your-frontend.vercel.app  (comma separated for several)
const allowedOrigins=(process.env.CORS_ORIGINS||"")
    .split(",")
    .map((o)=>o.trim().replace(/\/+$/,""))
    .filter(Boolean);
app.use(cors(allowedOrigins.length>0?{
    origin:(origin,callback)=>callback(null,!origin || allowedOrigins.includes(origin)),
}:undefined))
app.use(express.json({limit:"1mb"}));

const port = process.env.PORT || 5000;

if(!process.env.JWT_SECRET) console.error("WARNING: JWT_SECRET is not set - logins will fail");
if(!process.env.GEMINI_API_KEY) console.warn("NOTE: GEMINI_API_KEY is not set - the chat widget will show as unavailable");
if(!process.env.DATABASE_URL) console.error("WARNING: DATABASE_URL is not set");

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

// Inngest calls this itself, so it is not rate limited
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use('/api',apiLimiter)
app.use('/api/auth',authLimiter,authRouter)
app.use('/api/products',productRouter)
app.use('/api/upload',uploadRouter)
app.use('/api/orders',orderRouter)
app.use('/api/coupons',couponRouter)
app.use('/api/chat',chatRouter)
app.use('/api/addresses',addressRouter)
app.use('/api/admin',adminRouter)
app.use('/api/delivery',deliveryPartnerRouter)

app.use((req:Request,res:Response)=>{
    res.status(404).json({message:"Route not found"})
})

// Error handling: every controller can simply throw
app.use((error:any,req:Request,res:Response,next:NextFunction)=>{
    if(res.headersSent) return next(error);

    // Validation errors -> 400 with the first problem in plain words
    if(error instanceof ZodError){
        const issue=error.issues[0];
        const field=issue?.path?.length?`${issue.path.join(".")}: `:"";
        return res.status(400).json({message:`${field}${issue?.message||"Invalid input"}`})
    }
    if(error instanceof HttpError){
        return res.status(error.status).json({message:error.message})
    }
    // Client mistakes raised by libraries (bad JSON, upload too large, ...)
    const status=Number(error?.status||error?.statusCode);
    if((status>=400 && status<500) || error?.name==="MulterError"){
        return res.status(status>=400&&status<500?status:400).json({message:error.message})
    }

    console.error(error)
    // Don't leak internals (database errors, file paths) to users in production
    const message=process.env.NODE_ENV==="production"
        ?"Something went wrong. Please try again."
        :error.message;
    res.status(500).json({message})
})
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
