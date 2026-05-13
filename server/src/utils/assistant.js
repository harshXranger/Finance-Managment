import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { syncRecurringTransactions } from "./recurring.js";

const buildSnapshot = async (userId) => {
  await syncRecurringTransactions(userId);
  const transactions = await Transaction.find({ userId }).sort({ date: -1 });
  const budgets = await Budget.find({ userId }).sort({ month: -1 });

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  const spendingByCategory = transactions.reduce((acc, item) => {
    if (item.type === "expense") {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
    }
    return acc;
  }, {});

  const topCategory = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0];

  return {
    balance,
    totalIncome,
    totalExpenses,
    budgets,
    recentTransactions: transactions.slice(0, 8),
    topSpendingCategory: topCategory ? { category: topCategory[0], amount: topCategory[1] } : null,
  };
};

const buildFallbackReply = (message, snapshot) => {
  const query = message.toLowerCase();

  if (query.includes("budget")) {
    const exceeded = snapshot.budgets.filter((item) => item.limit > 0);
    if (exceeded.length === 0) {
      return "You have not set budgets yet. Start with your top spending category so alerts become meaningful.";
    }
    return `You currently have ${exceeded.length} budget target${exceeded.length === 1 ? "" : "s"} configured. Review categories where spending is close to the limit and tighten non-essential expenses first.`;
  }

  if (query.includes("save") || query.includes("savings")) {
    const savingsRate = snapshot.totalIncome
      ? ((snapshot.balance / snapshot.totalIncome) * 100).toFixed(1)
      : "0.0";
    return `Your current savings rate is ${savingsRate}%. ${
      Number(savingsRate) >= 20
        ? "That is a strong base. Keep recurring expenses under control to protect it."
        : "Try reducing your top expense category or setting a tighter monthly budget to improve it."
    }`;
  }

  if (query.includes("spend") || query.includes("expense")) {
    if (!snapshot.topSpendingCategory) {
      return "I need a few expense entries before I can identify patterns. Add your recent spending and I’ll highlight the biggest category.";
    }
    return `Your highest expense category so far is ${snapshot.topSpendingCategory.category} at Rs. ${snapshot.topSpendingCategory.amount.toLocaleString()}. That is the best place to review for quick savings.`;
  }

  return `Here is your current snapshot: balance Rs. ${snapshot.balance.toLocaleString()}, income Rs. ${snapshot.totalIncome.toLocaleString()}, expenses Rs. ${snapshot.totalExpenses.toLocaleString()}. Ask me about spending, savings, budgets, or planning and I’ll tailor the advice.`;
};

const askFinanceAssistant = async (userId, message) => {
  const snapshot = await buildSnapshot(userId);
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    return {
      reply: buildFallbackReply(message, snapshot),
      source: "local-insight-engine",
    };
  }

  try {
    const prompt = [
      "You are WealthWave, a concise personal finance assistant.",
      "Use the provided financial snapshot only.",
      "Keep answers actionable and under 120 words.",
      `Snapshot: ${JSON.stringify(snapshot)}`,
      `User question: ${message}`,
    ].join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
      }),
    });

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    const data = await response.json();
    return {
      reply: data.output_text || buildFallbackReply(message, snapshot),
      source: "openai",
    };
  } catch (_error) {
    return {
      reply: buildFallbackReply(message, snapshot),
      source: "local-insight-engine",
    };
  }
};

export { askFinanceAssistant, buildSnapshot };

