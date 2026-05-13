import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
);

const ChartsPanel = ({ reports }) => {
  const doughnutData = {
    labels: reports.categoryBreakdown.map((item) => item.category),
    datasets: [
      {
        data: reports.categoryBreakdown.map((item) => item.amount),
        backgroundColor: ["#f97316", "#06b6d4", "#0f766e", "#facc15", "#ef4444", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: reports.monthlyTrends.map((item) => item.label),
    datasets: [
      {
        label: "Balance",
        data: reports.monthlyTrends.map((item) => item.balance),
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.18)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: reports.incomeVsExpense.map((item) => item.label),
    datasets: [
      {
        label: "Income",
        data: reports.incomeVsExpense.map((item) => item.income),
        backgroundColor: "#0891b2",
      },
      {
        label: "Expense",
        data: reports.incomeVsExpense.map((item) => item.expense),
        backgroundColor: "#ea580c",
      },
    ],
  };

  return (
    <section className="charts-grid" id="reports">
      <article className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Reports</span>
            <h2>Category breakdown</h2>
          </div>
        </div>
        {reports.categoryBreakdown.length ? (
          <Doughnut data={doughnutData} />
        ) : (
          <p className="empty-state">Expense categories will appear here once you start tracking them.</p>
        )}
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Trends</span>
            <h2>Monthly balance</h2>
          </div>
        </div>
        {reports.monthlyTrends.length ? (
          <Line data={lineData} />
        ) : (
          <p className="empty-state">Add a few months of activity to unlock trend analysis.</p>
        )}
      </article>

      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Comparison</span>
            <h2>Income vs expense</h2>
          </div>
        </div>
        {reports.incomeVsExpense.length ? (
          <Bar data={barData} />
        ) : (
          <p className="empty-state">This chart updates automatically as transactions are added.</p>
        )}
      </article>
    </section>
  );
};

export default ChartsPanel;

