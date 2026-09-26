import express from "express";
import auth from "../middleware/auth.js";
import { createOrder, getAllOrders, getOrder, getOrderLocation, getUserOrders, quoteOrder, updateOrderStatus, cancelMyOrder } from "../controllers/orderController.js";
import admin from "../middleware/admin.js";

const orderRouter=express.Router();
orderRouter.post('/',auth,createOrder);
orderRouter.post('/quote',auth,quoteOrder);
orderRouter.get('/',auth,getUserOrders);
orderRouter.get('/all',auth,admin, getAllOrders);
orderRouter.get('/:id',auth,getOrder);
orderRouter.put('/:id/status',auth,admin,updateOrderStatus);
orderRouter.put('/:id/cancel',auth,cancelMyOrder);
orderRouter.get('/:id/location',auth,getOrderLocation);

export default orderRouter