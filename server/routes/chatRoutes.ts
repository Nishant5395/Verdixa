import express from "express";
import optionalAuth from "../middleware/optionalAuth.js";
import { chatLimiter } from "../middleware/rateLimit.js";
import { sendMessage } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/", chatLimiter, optionalAuth, sendMessage);

export default chatRouter;
