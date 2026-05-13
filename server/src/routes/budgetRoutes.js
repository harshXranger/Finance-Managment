import express from "express";

import { deleteBudget, listBudgets, upsertBudget } from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listBudgets).post(upsertBudget);
router.delete("/:id", deleteBudget);

export default router;

