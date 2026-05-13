import express from "express";

import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listTransactions).post(createTransaction);
router.route("/:id").put(updateTransaction).delete(deleteTransaction);

export default router;

