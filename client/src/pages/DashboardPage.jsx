import { useEffect, useState } from "react";

import api from "../api/client";
import AssistantPanel from "../components/AssistantPanel.jsx";
import BudgetPanel from "../components/BudgetPanel.jsx";
import ChartsPanel from "../components/ChartsPanel.jsx";
import Layout from "../components/Layout.jsx";
import NotificationsPanel from "../components/NotificationsPanel.jsx";
import RecurringPanel from "../components/RecurringPanel.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { downloadCsvExport, downloadPdfReport } from "../utils/export.js";

const defaultReports = {
  categoryBreakdown: [],
  monthlyTrends: [],
  incomeVsExpense: [],
};

const DashboardPage = () => {
  const { logout, user } = useAuth();
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    savingsRate: 0,
    recentTransactions: [],
  });
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [reports, setReports] = useState(defaultReports);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: "assistant",
      text: "Ask me how to reduce spending, improve savings, or plan around your current budget.",
      source: "local-insight-engine",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const monthlyGrowth =
    reports.monthlyTrends.length >= 2
      ? reports.monthlyTrends[reports.monthlyTrends.length - 1].balance -
      reports.monthlyTrends[reports.monthlyTrends.length - 2].balance
      : 0;

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [
        summaryRes,
        transactionsRes,
        budgetsRes,
        reportsRes,
        recurringRes,
        notificationsRes,
      ] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/transactions"),
        api.get("/budgets"),
        api.get("/reports/overview"),
        api.get("/recurring"),
        api.get("/notifications"),
      ]);

      setSummary(summaryRes.data);
      setTransactions(transactionsRes.data.transactions);
      setBudgets(budgetsRes.data.budgets);
      setReports(reportsRes.data);
      setRecurringTransactions(recurringRes.data.recurringTransactions);
      setNotifications(notificationsRes.data.notifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const createTransaction = async (payload) => {
    setBusyAction("transaction");
    try {
      await api.post("/transactions", payload);
      await loadDashboard();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.response?.data?.message || "Could not save transaction" };
    } finally {
      setBusyAction("");
    }
  };

  const saveBudget = async (payload) => {
    setBusyAction("budget");
    try {
      await api.post("/budgets", payload);
      await loadDashboard();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.response?.data?.message || "Could not save budget" };
    } finally {
      setBusyAction("");
    }
  };

  const deleteBudget = async (id) => {
    setBusyAction(`budget-delete-${id}`);
    try {
      await api.delete(`/budgets/${id}`);
      await loadDashboard();
    } finally {
      setBusyAction("");
    }
  };

  const deleteTransaction = async (id) => {
    setBusyAction(id);
    try {
      await api.delete(`/transactions/${id}`);
      await loadDashboard();
    } finally {
      setBusyAction("");
    }
  };

  const createRecurringTransaction = async (payload) => {
    setBusyAction("recurring");
    try {
      await api.post("/recurring", payload);
      await loadDashboard();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Could not save recurring transaction",
      };
    } finally {
      setBusyAction("");
    }
  };

  const toggleRecurringTransaction = async (item) => {
    setBusyAction(item._id);
    try {
      await api.patch(`/recurring/${item._id}`, { active: !item.active });
      await loadDashboard();
    } finally {
      setBusyAction("");
    }
  };

  const deleteRecurringTransaction = async (id) => {
    setBusyAction(`delete-${id}`);
    try {
      await api.delete(`/recurring/${id}`);
      await loadDashboard();
    } finally {
      setBusyAction("");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      // API call
      await api.patch(`/notifications/${id}/read`);

      // IMPORTANT: update state
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, read: true }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const askAssistant = async (message) => {
    setBusyAction("assistant");
    setAssistantMessages((current) => [...current, { role: "user", text: message }]);
    try {
      const { data } = await api.post("/assistant/chat", { message });
      setAssistantMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.reply,
          source: data.source,
        },
      ]);
    } finally {
      setBusyAction("");
    }
  };
  function SummaryCard({ accent, label, value, helper, delta, secured }) {
    return (
      <div className={`summary-card ${accent}`}>
        {secured && <span className="card-secured">Secured</span>}
        <p className="card-label">{label}</p>
        <p className="card-value">{value}</p>
        {delta && <span className="card-delta">{delta}</span>}
        <p className="card-helper">{helper}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <Layout onLogout={logout} user={user}>
        <section className="hero-strip" id="overview">
          <div className="skeleton-line wide" />
          <div className="skeleton-line medium" />
        </section>
        <section className="summary-grid">
          <article className="summary-card skeleton-card" />
          <article className="summary-card skeleton-card" />
          <article className="summary-card skeleton-card" />
          <article className="summary-card skeleton-card" />
        </section>
        <section className="content-grid">
          <article className="panel skeleton-panel" />
          <article className="panel skeleton-panel" />
        </section>
      </Layout>
    );



  }



  return (
    <Layout onLogout={logout} user={user}>
      <section className="hero-strip" id="overview">
        <div>
          <span className="dashboard-text">Dashboard</span>
          <h2 className="dashboard-subtext">Financial trust and clarity for every decision.</h2>
          <p className="dashboard-p">
            Monitor net worth, spending quality, and monthly growth in one secure workspace that
            stays fast on every device.
          </p>
        </div>
        <div className="hero-actions">
          <button className="export-ghost-button" onClick={downloadCsvExport} type="button">
            Export CSV
          </button>
          <button
            className="export-primary-button"
            onClick={() => downloadPdfReport({ budgets, reports, summary, transactions })}
            type="button"
          >
            Export PDF
          </button>
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard
          accent="balance-card"
          helper="Total assets minus liabilities"
          label="Net Worth"
          secured
          value={`Rs.${Number(summary.totalBalance).toLocaleString()}`}
        />
        <SummaryCard
          accent={monthlyGrowth >= 0 ? "income-card" : "expense-card"}
          helper="Change from previous month"
          label="Monthly Growth"
          value={`${monthlyGrowth >= 0 ? "+" : "-"}Rs.${Math.abs(Number(monthlyGrowth)).toLocaleString()}`}
          delta={monthlyGrowth >= 0 ? "Upward momentum" : "Needs attention"}
        />
        <SummaryCard
          accent="savings-card"
          helper={`${summary.autoGeneratedCount || 0} recurring entries auto-posted`}
          label="Savings Rate"
          secured
          value={`${summary.savingsRate}%`}
        />
        <SummaryCard
          accent="expense-card"
          helper="Money flowing out this period"
          label="Total Expenses"
          value={`Rs.${Number(summary.totalExpenses).toLocaleString()}`}
          
        />
      </section>

      <section className="content-grid">
        <TransactionForm busy={busyAction === "transaction"} onSubmit={createTransaction} />
        <BudgetPanel
          budgets={budgets}
          busy={busyAction === "budget"}
          deletingId={busyAction.startsWith("budget-delete-") ? busyAction.replace("budget-delete-", "") : ""}
          onDelete={deleteBudget}
          onSave={saveBudget}
        />
      </section>

      <section className="content-grid">
        <RecurringPanel
          busy={busyAction === "recurring"}
          onCreate={createRecurringTransaction}
          onDelete={deleteRecurringTransaction}
          onToggle={toggleRecurringTransaction}
          recurringTransactions={recurringTransactions}
        />
        <NotificationsPanel
          notifications={notifications}
          onMarkRead={handleMarkRead}
        />
      </section>


      <section className="dashboard-bottom-grid">
        <AssistantPanel
          busy={busyAction === "assistant"}
          messages={assistantMessages}
          onAsk={askAssistant}
        />
        <TransactionList
          onDelete={deleteTransaction}
          transactions={transactions.length ? transactions : summary.recentTransactions}
        />
      </section>
    </Layout>

  );
};

export default DashboardPage;
