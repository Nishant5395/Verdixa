import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getAvailableCoupons,
  updateCoupon,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.get("/available", auth, getAvailableCoupons);
couponRouter.get("/", auth, admin, getAllCoupons);
couponRouter.post("/", auth, admin, createCoupon);
couponRouter.put("/:id", auth, admin, updateCoupon);
couponRouter.delete("/:id", auth, admin, deleteCoupon);

export default couponRouter;
