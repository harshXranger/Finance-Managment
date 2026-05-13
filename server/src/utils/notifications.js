import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";
import Transaction from "../models/Transaction.js";
import { syncRecurringTransactions } from "./recurring.js";

const upsertNotification = async (userId, payload) =>
  Notification.findOneAndUpdate(
    { userId, kind: payload.kind, scope: payload.scope },
    { ...payload, userId, read: false },
    { upsert: true, new: true, runValidators: true }
  );

const removeNotification = async (userId, kind, scope) => {
  await Notification.findOneAndDelete({ userId, kind, scope });
};

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const getMonthRange = (month) => {
  const [year, monthIndex] = month.split("-").map(Number);
  return {
    start: new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0, 0)),
    end: new Date(Date.UTC(year, monthIndex, 0, 23, 59, 59, 999)),
  };
};

const refreshNotifications = async (userId, options = {}) => {
  const recurringResult = await syncRecurringTransactions(userId);

  const month = options.month || getCurrentMonth();
  const budgetStatus = options.budgetStatus || [];
  const { start, end } = getMonthRange(month);

  const budgets =
    budgetStatus.length > 0
      ? budgetStatus
      : await (async () => {
          const budgetDocs = await Budget.find({ userId, month });
          const expenses = await Transaction.find({
            userId,
            type: "expense",
            date: { $gte: start, $lte: end },
          });
          const spentByCategory = expenses.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.amount;
            return acc;
          }, {});

          return budgetDocs.map((budget) => ({
            category: budget.category,
            limit: budget.limit,
            spent: spentByCategory[budget.category] || 0,
            exceeded: (spentByCategory[budget.category] || 0) > budget.limit,
          }));
        })();

  for (const budget of budgets) {
    const scope = `${month}:${budget.category}`;
    if (budget.exceeded) {
      await upsertNotification(userId, {
        kind: "budget-exceeded",
        scope,
        title: "Budget exceeded",
        message: `${budget.category} spending is over the monthly limit by Rs. ${(budget.spent - budget.limit).toLocaleString()}.`,
        level: "warning",
      });
    } else {
      await removeNotification(userId, "budget-exceeded", scope);
    }
  }

  for (const plan of recurringResult.createdPlans) {
    await upsertNotification(userId, {
      kind: "recurring-posted",
      scope: plan.id,
      title: "Recurring transaction posted",
      message: `${plan.count} ${plan.name} entr${plan.count === 1 ? "y was" : "ies were"} added automatically.`,
      level: "success",
    });
  }

  const allTransactions = await Transaction.find({ userId });
  const totalIncome = allTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = allTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  if (totalIncome > 0 && totalExpenses > totalIncome * 0.85) {
    await upsertNotification(userId, {
      kind: "cash-flow-warning",
      scope: month,
      title: "High expense ratio",
      message: "Your expenses are above 85% of income. Review discretionary categories soon.",
      level: "warning",
    });
  } else {
    await removeNotification(userId, "cash-flow-warning", month);
  }

  return Notification.find({ userId }).sort({ read: 1, updatedAt: -1 });
};

export { refreshNotifications, removeNotification, upsertNotification };
