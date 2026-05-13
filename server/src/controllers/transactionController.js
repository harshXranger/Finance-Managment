import Transaction from "../models/Transaction.js";
import { syncRecurringTransactions } from "../utils/recurring.js";

const getTransactionQuery = (userId, query) => {
  const filters = { userId };

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filters.date = {};

    if (query.startDate) {
      filters.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.date.$lte = new Date(query.endDate);
    }
  }

  return filters;
};

const listTransactions = async (req, res, next) => {
  try {
    await syncRecurringTransactions(req.user._id);
    const filters = getTransactionQuery(req.user._id, req.query);
    const transactions = await Transaction.find(filters).sort({ date: -1, createdAt: -1 });
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, date, note } = req.body;

    if (!type || !category || !amount || !date) {
      res.status(400);
      throw new Error("Type, category, amount, and date are required");
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      category,
      amount: Number(amount),
      date,
      note,
    });

    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    Object.assign(transaction, {
      type: req.body.type ?? transaction.type,
      category: req.body.category ?? transaction.category,
      amount: req.body.amount !== undefined ? Number(req.body.amount) : transaction.amount,
      date: req.body.date ?? transaction.date,
      note: req.body.note ?? transaction.note,
    });

    await transaction.save();

    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    res.json({ message: "Transaction removed" });
  } catch (error) {
    next(error);
  }
};

export {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
};
