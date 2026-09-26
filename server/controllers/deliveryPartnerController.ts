import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { HttpError } from "../utils/errors.js";
import {
    ACTIVE_DELIVERY_STATUSES,
    appendHistory,
    releaseOrderResources,
    TERMINAL_STATUSES,
} from "../utils/orderHelpers.js";

const generateToken=(id:string)=>{
    return jwt.sign({id,role:"delivery"},process.env.JWT_SECRET as string,{expiresIn:"30d"})
}
//Login Delivery Partner
//POST/api/delivery/login
export const loginPartner=async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    if(typeof email!=="string" || typeof password!=="string" || !email || !password){
        return res.status(400).json({message:"Please provide email and password"});
    }
    const partner=await prisma.deliveryPartner.findUnique({where:{email:email.trim().toLowerCase()}})

    if(!partner){
        return res.status(400).json({message:"Invalid email or password"});
    }
    if(!partner.isActive){
        return res.status(403).json({message:"Your account has been deactivated"});
    }
    const isMatch=await bcrypt.compare(password,partner.password)
    if(!isMatch){
          return res.status(400).json({message:"Invalid email or password"});
    
    }
    const token=generateToken(partner.id)
    const {password: _, ...partnerData}=partner;
    res.json({partner:partnerData,token})
}
//get assigned deliveries
//GET/api/delivery/my-deliveries
export const getMyDeliveries=async (req:Request,res:Response)=>{
    const {status}=req.query;
    const where:any={deliveryPartnerId:req.partner!.id}
    if(status==="active"){
        where.status={in:ACTIVE_DELIVERY_STATUSES}
    }else if(status==="completed"){
        where.status={in:["Delivered","Cancelled"]}
    }
    const orders=await prisma.order.findMany({
        where,
        include:{user:{select:{name:true,email:true,phone:true}}},
        orderBy:{createdAt:"desc"}
    })
    res.json({orders})
}
//Get single delivery detail
//GET/api/delivery/my-deliveries/:id
export const getDeliveryDetail=async (req:Request,res:Response)=>{
    const order=await prisma.order.findFirst({
        where:{id:req.params.id as string,deliveryPartnerId:req.partner!.id},
        include:{user:{select:{name:true,email:true,phone:true}}}
    })
    if(!order){
        return res.status(404).json({message:"Delivery not found"});
    }
    res.json({order})
}
//Complete delivery with OTP
//PUT/api/delivery/my-deliveries/:id/complete
export const completeDelivery=async (req:Request,res:Response)=>{
    const otp=typeof req.body?.otp==="string"?req.body.otp.trim():"";
    const order=await prisma.order.findFirst({
        where:{id:req.params.id as string,deliveryPartnerId:req.partner!.id}
    })
    if(!order || TERMINAL_STATUSES.includes(order.status)){
        throw new HttpError(400,"Invalid Request");
    }
    // An empty stored OTP must never match (new orders start with an empty OTP until assigned)
    if(!otp || !order.deliveryOtp || order.deliveryOtp!==otp){
        throw new HttpError(400,"Invalid OTP");
    }
    const updatedOrder=await prisma.order.update({
        where:{id:order.id},
        data:{
            status:"Delivered",
            statusHistory:appendHistory(order.statusHistory,"Delivered","Delivered by partner"),
            deliveryOtp:"",
            // cash orders are paid at the door
            ...(order.paymentMethod!=="card"?{isPaid:true}:{}),
        }
    })
    res.json({order:updatedOrder,message:"Delivery completed successfully"})
}
//Cancel delivery
//PUT/api/delivery/my-deliveries/:id/cancel
export const cancleDelivery=async (req:Request,res:Response)=>{
    const reason=typeof req.body?.reason==="string"?req.body.reason.trim().slice(0,300):"";
    const order=await prisma.order.findFirst({
        where:{id:req.params.id as string,deliveryPartnerId:req.partner!.id}
    })
    if(!order){
        throw new HttpError(404,"Delivery not found");
    }
    if(order.status==="Delivered"){
        throw new HttpError(400,"Cannot cancel a delivered order");
    }
    if(order.status==="Cancelled"){
        throw new HttpError(400,"This order is already cancelled");
    }
    const updatedOrder=await prisma.order.update({
        where:{id:order.id},
        data:{
            status:"Cancelled",
            statusHistory:appendHistory(order.statusHistory,"Cancelled",reason||"Cancelled by delivery partner"),
            deliveryOtp:"",
        }
    })
    // put the stock (and coupon use) back. Refunds for paid card orders are done from Stripe.
    await releaseOrderResources(order.id);
    res.json({order:updatedOrder,message:"Delivery cancelled"})
}
//Update order status
//PUT/api/delivery/my-deliveries/:id/status

export const updateDeliveryStatus=async (req:Request,res:Response)=>{
    const {status}=req.body;
    const allowedStatuses=["Packed","Out for Delivery"];
    if(!allowedStatuses.includes(status)){
        throw new HttpError(400,"Invalid status update");
    }
    const order=await prisma.order.findFirst({
        where:{id:req.params.id as string,deliveryPartnerId:req.partner!.id}
    })
    if(!order){
        throw new HttpError(404,"Delivery not found");
    }
    if(TERMINAL_STATUSES.includes(order.status)){
        throw new HttpError(400,`This order is already ${order.status.toLowerCase()}`);
    }
    const updatedOrder=await prisma.order.update({
        where:{id:order.id},
        data:{status,statusHistory:appendHistory(order.statusHistory,status,`Status updated to ${status}`)}
    })
    res.json({order:updatedOrder})
}

//Update live location
//PUT/api/delivery/my-deliveries/:id/location
export const updateLocation=async (req:Request,res:Response)=>{
    const lat=Number(req.body?.lat);
    const lng=Number(req.body?.lng);
    if(!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat)>90 || Math.abs(lng)>180){
        throw new HttpError(400,"Invalid location");
    }
    const order=await prisma.order.findFirst({
        where:{
            id:req.params.id as string,
            deliveryPartnerId:req.partner!.id,
            status:{in:ACTIVE_DELIVERY_STATUSES}
        }
    })
    if(!order){
        throw new HttpError(404,"No active delivery found");
    }
    await prisma.order.update({
        where:{id:order.id},
        data:{liveLocation:{lat,lng,updated:new Date()}}
    })
    res.json({success:true})
}
