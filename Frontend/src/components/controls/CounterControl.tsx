export const CounterControl = ({
  label,
  count,
  onAdd,
  onRemove,
}: {
  label: string;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}) => (
  <div className="counter-row">
    <div className="counter-info">
      <span className="counter-label">{label}</span>
    </div>
    <div className="counter-actions">
      <button className="counter-btn" onClick={onRemove} disabled={count === 0}>
        −
      </button>
      <span className="counter-value">{count}</span>
      <button className="counter-btn" onClick={onAdd}>
        +
      </button>
    </div>
  </div>
);
