import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { syncRecurringTransactions } from "../utils/recurring.js";
import { refreshNotifications } from "../utils/notifications.js";

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
const getMonthRange = (month) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthIndex, 0, 23, 59, 59, 999));
  return { start, end };
};

const listBudgets = async (req, res, next) => {
  try {
    await syncRecurringTransactions(req.user._id);
    const month = req.query.month || getCurrentMonth();
    const { start, end } = getMonthRange(month);
    const budgets = await Budget.find({ userId: req.user._id, month }).sort({ category: 1 });
    const expenses = await Transaction.find({
      userId: req.user._id,
      type: "expense",
      date: {
        $gte: start,
        $lte: end,
      },
    });

    const spentByCategory = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    const budgetStatus = budgets.map((budget) => {
      const spent = spentByCategory[budget.category] || 0;
      return {
        ...budget.toObject(),
        spent,
        remaining: Math.max(budget.limit - spent, 0),
        exceeded: spent > budget.limit,
        usagePercent: budget.limit ? Math.round((spent / budget.limit) * 100) : 0,
      };
    });

    await refreshNotifications(req.user._id, { month, budgetStatus });
    res.json({ budgets: budgetStatus });
  } catch (error) {
    next(error);
  }
};

const upsertBudget = async (req, res, next) => {
  try {
    const { category, limit, month = getCurrentMonth() } = req.body;

    if (!category || !limit) {
      res.status(400);
      throw new Error("Category and limit are required");
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, category, month },
      { userId: req.user._id, category, month, limit: Number(limit) },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ budget });
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      res.status(404);
      throw new Error("Budget not found");
    }

    res.json({ message: "Budget deleted" });
  } catch (error) {
    next(error);
  }
};

export { listBudgets, upsertBudget, deleteBudget };
