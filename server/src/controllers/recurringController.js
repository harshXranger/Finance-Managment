import RecurringTransaction from "../models/RecurringTransaction.js";
import { addInterval, syncRecurringTransactions, toStartOfDay } from "../utils/recurring.js";

const listRecurringTransactions = async (req, res, next) => {
  try {
    await syncRecurringTransactions(req.user._id);
    const recurringTransactions = await RecurringTransaction.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ recurringTransactions });
  } catch (error) {
    next(error);
  }
};

const createRecurringTransaction = async (req, res, next) => {
  try {
    const { name, type, category, amount, note, interval, startDate } = req.body;

    if (!name || !type || !category || !amount || !interval || !startDate) {
      res.status(400);
      throw new Error("Name, type, category, amount, interval, and start date are required");
    }

    const normalizedStartDate = toStartOfDay(startDate);
    const recurringTransaction = await RecurringTransaction.create({
      userId: req.user._id,
      name,
      type,
      category,
      amount: Number(amount),
      note,
      interval,
      startDate: normalizedStartDate,
      nextRunDate: normalizedStartDate,
    });

    await syncRecurringTransactions(req.user._id);
    res.status(201).json({ recurringTransaction });
  } catch (error) {
    next(error);
  }
};

const toggleRecurringTransaction = async (req, res, next) => {
  try {
    const recurringTransaction = await RecurringTransaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recurringTransaction) {
      res.status(404);
      throw new Error("Recurring transaction not found");
    }

    recurringTransaction.active = req.body.active ?? !recurringTransaction.active;

    if (recurringTransaction.active && recurringTransaction.nextRunDate < recurringTransaction.startDate) {
      recurringTransaction.nextRunDate = addInterval(recurringTransaction.startDate, recurringTransaction.interval);
    }

    await recurringTransaction.save();
    res.json({ recurringTransaction });
  } catch (error) {
    next(error);
  }
};

const deleteRecurringTransaction = async (req, res, next) => {
  try {
    const recurringTransaction = await RecurringTransaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recurringTransaction) {
      res.status(404);
      throw new Error("Recurring transaction not found");
    }

    res.json({ message: "Recurring transaction removed" });
  } catch (error) {
    next(error);
  }
};

export {
  createRecurringTransaction,
  deleteRecurringTransaction,
  listRecurringTransactions,
  toggleRecurringTransaction,
};

