import { useState } from "react";

const initialState = {
  name: "",
  type: "expense",
  category: "Housing",
  amount: "",
  interval: "monthly",
  startDate: new Date().toISOString().slice(0, 10),
  note: "",
};

const RecurringPanel = ({ busy, onCreate, onDelete, onToggle, recurringTransactions }) => {
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await onCreate(formData);

    if (response?.ok) {
      setFormData(initialState);
    }
  };
  const PREDEFINED_CATEGORIES = [
    "Housing",
    "Food & Dining",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Savings",
    "Shopping",
    "Miscellaneous",
  ];
  return (
    <section className="panel" id="recurring">
      <div className="panel-header">
        <div>
          <span className="recurring-text">Automation</span>
          <h2 className="recurring-subtext">Recurring transactions</h2>
        </div>
      </div>

      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            required
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
          />
        </label>
        <label>
          Type
          <select
            value={formData.type}
            onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label>
          Category
          <select
            value={formData.category}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
          >
            {PREDEFINED_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount
          <input
            min="0"
            required
            step="100"
            type="number"
            value={formData.amount}
            onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))}
          />
        </label>
        <label>
          Interval
          <select
            value={formData.interval}
            onChange={(event) => setFormData((current) => ({ ...current, interval: event.target.value }))}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label className="date-label">
          Start date

          <div className="date-input-wrapper">
            <input
              className="date-input"
              required
              type="date"
              value={formData.startDate}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
            />
          </div>
        </label>
        <label className="full-width">
          Note
          <textarea
            rows="2"
            value={formData.note}
            onChange={(event) => setFormData((current) => ({ ...current, note: event.target.value }))}
          />
        </label>
        <button className="recurring-primary-button" disabled={busy} type="submit">
          {busy ? "Saving..." : "Add Recurring Plan"}
        </button>
      </form>

      <div className="recurring-list">
        {recurringTransactions.length === 0 ? (
          <p className="empty-state">Add recurring salary, rent, subscriptions, or weekly expenses here.</p>
        ) : (
          recurringTransactions.map((item) => (
            <article className="recurring-card" key={item._id}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  {item.type} · {item.category} · every {item.interval}
                </p>
                <small>Next run: {new Date(item.nextRunDate).toLocaleDateString()}</small>
              </div>
              <div className="recurring-actions">
                <button className="ghost-button" onClick={() => onToggle(item)} type="button">
                  {item.active ? "Pause" : "Resume"}
                </button>
                <button className="ghost-button danger-text" onClick={() => onDelete(item._id)} type="button">
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default RecurringPanel;

