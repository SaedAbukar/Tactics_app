import "../Exercises.css";

interface SectionColumnProps {
  title: string;
  items: any[];
  color: string;
  onItemClick: (item: any) => void;
}

export const SectionColumn = ({
  title,
  items,
  color,
  onItemClick,
}: SectionColumnProps) => {
  return (
    <div className="section-column">
      <div className="section-header">
        <div className="status-dot" style={{ backgroundColor: color }} />
        <h3 className="section-title">{title}</h3>
        <span className="count-badge">{items.length}</span>
      </div>

      <div className="card-list">
        {items.length === 0 ? (
          <div className="empty-state">No items found</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() => onItemClick(item)}
            >
              <h4 className="card-title">{item.name}</h4>
              <p className="card-id">ID: {item.id.toString().slice(0, 8)}...</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
