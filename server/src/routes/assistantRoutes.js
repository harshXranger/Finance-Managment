import express from "express";

import { chatWithAssistant } from "../controllers/assistantController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/chat", chatWithAssistant);

export default router;

