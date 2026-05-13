import { useState, useRef } from "react";

const BudgetPanel = ({ budgets, onDelete, onSave, busy, deletingId }) => {
  const listRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current slider position

  const [formData, setFormData] = useState({
    category: "Housing",
    limit: "",
    month: new Date().toISOString().slice(0, 7),
  });

  // Navigation Logic
  const nextSlide = () => {
    if (currentIndex < budgets.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await onSave(formData);
    if (response?.ok) {
      setFormData((current) => ({ ...current, limit: "" }));
      setCurrentIndex(0); // Snap back to start to see the new budget
    }
  };

  const PREDEFINED_CATEGORIES = [
    "Housing", "Food & Dining", "Transportation",
    "Utilities", "Entertainment", "Healthcare",
    "Savings", "Shopping", "Miscellaneous"
  ];

  return (
    <section className="panel" id="budgets">
      <div className="panel-header">
        <div>
          <span className="budget-text">Budget Control</span>
          <h2 className="budget-subtext">Set monthly budget targets</h2>
        </div>

        {/* Navigation Arrows */}

      </div>

      <form className="budget-form" onSubmit={handleSubmit}>
        {/* ... (Keep your existing select and inputs here) ... */}
        <select
          className="budget-select"
          value={formData.category}
          onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))}
          required
        >
          <option value="" disabled>Select Category</option>
          {PREDEFINED_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          min="0"
          placeholder="Monthly limit"
          step="100"
          type="number"
          value={formData.limit}
          onChange={(event) => setFormData((current) => ({ ...current, limit: event.target.value }))}
        />
        <input
          type="month"
          value={formData.month}
          onChange={(event) => setFormData((current) => ({ ...current, month: event.target.value }))}
        />
        <button className="budget-button" disabled={busy} type="submit">
          {busy ? "Updating..." : "Save Budget"}
        </button>
      </form>

      <div className="slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {budgets.length === 0 ? (
            <div className="slider-item">
              <p className="empty-state">No budgets yet.</p>
            </div>
          ) : (
            budgets.map((budget) => (
              <div className="slider-item" key={budget._id}>
                <article className={`budget-card ${budget.exceeded ? "danger" : ""}`}>
                  <div className="budget-card-top">
                    <strong>{budget.category}</strong>
                    <div className="budget-card-actions">
                      <span>
                        Rs. {budget.spent.toLocaleString()} / Rs. {budget.limit.toLocaleString()}
                      </span>
                      <button
                        className="ghost-button danger-text"
                        disabled={deletingId === budget._id}
                        onClick={() => onDelete(budget._id)}
                        type="button"
                      >
                        {deletingId === budget._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(budget.usagePercent || 0, 100)}%` }}
                    />
                  </div>
                  <p>
                    {budget.exceeded
                      ? `Overspent by Rs. ${(budget.spent - budget.limit).toLocaleString()}`
                      : `Rs. ${budget.remaining.toLocaleString()} remaining this month`}
                  </p>
                </article>
                <div>
                  {budgets.length > 1 && (
                    <div className="slider-controls">
                      <button
                        className="arrow-btn"
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                      >
                        ←
                      </button>
                      <span className="slider-dot-count">
                        {currentIndex + 1} / {budgets.length}
                      </span>
                      <button
                        className="arrow-btn"
                        onClick={nextSlide}
                        disabled={currentIndex === budgets.length - 1}
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BudgetPanel;