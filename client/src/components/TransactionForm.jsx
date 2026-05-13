import { useState } from "react";

const initialState = {
  type: "expense",
  category: 'Housing',
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};


const TransactionForm = ({ onSubmit, busy }) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (event) => {
    
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await onSubmit(formData);

    if (response?.ok) {
      setFormData((prev) => ({
      ...prev,
      amount: "",
      note: "",
    }));
    }
  };
  const PREDEFINED_CATEGORIES = [
    "Housing", "Food & Dining", "Transportation",
    "Utilities", "Entertainment", "Healthcare",
    "Savings", "Shopping", "Miscellaneous"
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="transaction-text">Transactions</span>
          <h2 className="transaction-subtext">Add a new entry</h2>
        </div>
      </div>

      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Type

          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>
          Category
          <select name="category" value={formData.category} onChange={handleChange} required>
            {/* Removed .toLowerCase() to match BudgetPanel casing */}
            <option value="" disabled>Select a category</option>
            {PREDEFINED_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Amount
          <input
            min="0"
            name="amount"
            step="100"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </label>

        <label className="date-input-wrapper">
          Date
          <div className="input-relative">
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <span className="calendar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </span>
          </div>
        </label>

        <label className="full-width">
          Note
          <textarea name="note" rows="3" value={formData.note} onChange={handleChange} />
        </label>

        <button className="transaction-primary-button" disabled={busy} type="submit">
          {busy ? "Saving..." : "Save Transaction"}
        </button>
      </form>
    </section>
  );
};

export default TransactionForm;

