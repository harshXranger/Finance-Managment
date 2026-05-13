import express from "express";

import { exportTransactionsCsv, getReportOverview } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, getReportOverview);
router.get("/export/transactions.csv", protect, exportTransactionsCsv);

export default router;
