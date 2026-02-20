import express from "express";
import { generateContent, chat } from "../controllers/ai.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/generate", authenticate, generateContent);
router.post("/chat", authenticate, chat);

export default router;
