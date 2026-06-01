// import express from "express";
// import auth from "../middleware/auth.js";
// import admin from "../middleware/admin.js";
// import { assignDeliveryPartner, getAdminStats, getDeliveryPartners, updateDeliveryPartner } from "../controllers/adminController.js";
// const adminRouter=express.Router();
// adminRouter.get('/stats',auth,admin,getAdminStats)
// adminRouter.get('/delivery-partners',auth,admin,getDeliveryPartners)
// adminRouter.post('/delivery-partners/:id',auth,admin,updateDeliveryPartner)
// adminRouter.put('/orders/:id/assign',auth,admin,assignDeliveryPartner)
// export default adminRouter

import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

import {
  getAdminStats,
  getDeliveryPartners,
  createDeliveryPartner,
  updateDeliveryPartner,
  assignDeliveryPartner,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Dashboard stats
adminRouter.get("/stats", auth, admin, getAdminStats);

// Get all delivery partners
adminRouter.get(
  "/delivery-partners",
  auth,
  admin,
  getDeliveryPartners
);

// Create delivery partner
adminRouter.post(
  "/delivery-partners",
  auth,
  admin,
  createDeliveryPartner
);

// Update delivery partner
adminRouter.put(
  "/delivery-partners/:id",
  auth,
  admin,
  updateDeliveryPartner
);

// Assign partner to order
adminRouter.put(
  "/orders/:id/assign",
  auth,
  admin,
  assignDeliveryPartner
);

export default adminRouter;