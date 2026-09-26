import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { z } from "zod";
import { HttpError } from "../utils/errors.js";

const registerSchema=z.object({
    name:z.string().trim().min(1,"Please Provide all fields").max(100),
    email:z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address")),
    password:z.string().min(6,"Password must be at least 6 characters").max(200),
})
const loginSchema=z.object({
    email:z.string().trim().toLowerCase().min(1),
    password:z.string().min(1),
})

//Generate JWT token

const generateToken=(id:string)=>{
    return jwt.sign({id},process.env.JWT_SECRET as string,{expiresIn:"30d"})
}
// Check if user is admin
const getAdminStatus=(email:string | null | undefined): boolean=>{
    if(!email)return false;
    const adminEmails=process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e)=>e.trim().toLowerCase()):[];
    return adminEmails.includes(email.toLocaleLowerCase())
}
// Register
//POST/api/auth/register
export const register=async(req:Request,res:Response)=>{
    const parsed=registerSchema.safeParse(req.body);
    if(!parsed.success){
        throw new HttpError(400,parsed.error.issues[0]?.message || "Please Provide all fields");
    }
    const {name,email,password}=parsed.data;
    const existingUser=await prisma.user.findUnique({where:{email}})
    if(existingUser){
        return res.status(400).json({message: "User already exists with this email"})
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const user=await prisma.user.create({
        data:{name,email,password:hashedPassword}
    })
    const token=generateToken(user.id)
    const userData:any={...user};
    delete userData.password;
    userData.isAdmin=getAdminStatus(userData.email)
    res.status(201).json({user:userData,token})
}
// Login
//POST/api/auth/login
export const login=async(req:Request,res:Response)=>{
    const parsed=loginSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({message:"Please Provide email and password"})
    }
    const {email,password}=parsed.data;
    const user=await prisma.user.findUnique({where:{email},include:{addresses:true}})
    if(!user){
        return res.status(401).json({message: "Invalid email or password"})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({message:"Invalid email or password"});
    }
   
    const token=generateToken(user.id)
    const userData:any={...user};
    delete userData.password;
    userData.isAdmin=getAdminStatus(userData.email)
    res.json({user:userData,token})
}