import express from "express";

import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  listRecurringTransactions,
  toggleRecurringTransaction,
} from "../controllers/recurringController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listRecurringTransactions).post(createRecurringTransaction);
router.route("/:id").patch(toggleRecurringTransaction).delete(deleteRecurringTransaction);

export default router;

