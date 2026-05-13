import { useState } from "react";

const AssistantPanel = ({ busy, messages, onAsk }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    const currentMessage = message;
    setMessage("");
    await onAsk(currentMessage);
  };

  return (
    <section className="panel assistant-panel" id="assistant">
      <div className="panel-header">
        <div>
          <span className="assistant-text">Assistant</span>
          <h2 className="assistant-subtext">AI finance copilot</h2>
        </div>
      </div>

      <div className="assistant-thread">
        {messages.map((item, index) => (
          <article className={`assistant-bubble ${item.role}`} key={`${item.role}-${index}`}>
            <strong>{item.role === "user" ? "You" : "WealthWave AI"}</strong>
            <p>{item.text}</p>
            {item.source ? <small>{item.source}</small> : null}
          </article>
        ))}
      </div>

      <form className="assistant-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Ask about savings, spending, budgets, or planning..."
          rows="3"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button className="primary-button" disabled={busy} type="submit">
          {busy ? "Thinking..." : "Ask Assistant"}
        </button>
      </form>
    </section>
  );
};

export default AssistantPanel;

