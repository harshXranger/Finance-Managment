const SummaryCard = ({ label, value, helper, accent, delta, secured = false }) => (
  <article className={`summary-card ${accent}`}>
    <div className="summary-head">
      <span className="muted-label">{label}</span>
      {secured ? <span className="security-tag"> Secured</span> : null}
    </div>
    <h3>{value}</h3>
    {delta ? <span className="delta-text">{delta}</span> : null}
    <p>{helper}</p>
  </article>
);

export default SummaryCard;

