import type { Session, Practice, GameTactic } from "../../../types/types";
import "../Exercises.css";

interface DetailViewProps {
  item: Session | Practice | GameTactic;
  type: string;
  onBack: () => void;
}

export const DetailView = ({ item, type, onBack }: DetailViewProps) => {
  return (
    <div className="detail-container">
      <button onClick={onBack} className="back-button">
        <span style={{ fontSize: "1.2rem" }}>←</span> Back to Dashboard
      </button>

      <div className="detail-card">
        {/* Header */}
        <div className="detail-header">
          <div>
            <h1 className="detail-title">{item.name}</h1>
            <p className="card-id" style={{ marginTop: "0.5rem" }}>
              ID: {item.id}
            </p>
          </div>
          <span className="type-badge">{type.slice(0, -1)}</span>
        </div>

        {/* Body */}
        <div className="detail-body">
          <h3 className="section-label">Description</h3>
          <p className="description-text">
            {item.description || "No description provided."}
          </p>

          {/* Conditional Rendering */}
          {"steps" in item && (
            <div>
              <h3 className="section-label">
                Training Steps ({(item as Session).steps?.length || 0})
              </h3>
              <div className="placeholder-box">
                [Canvas/Diagram Component would go here]
              </div>
            </div>
          )}

          {"sessions" in item && (
            <div>
              <h3 className="section-label">
                Included Sessions ({(item as Practice).sessions?.length || 0})
              </h3>
              <div className="grid-list">
                {(item as Practice).sessions?.map((s) => (
                  <div
                    key={s.id}
                    className="item-card"
                    style={{ cursor: "default" }}
                  >
                    <strong
                      style={{ display: "block", color: "var(--text-primary)" }}
                    >
                      {s.name}
                    </strong>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {s.description?.slice(0, 50)}...
                    </span>
                  </div>
                ))}
                {(item as Practice).sessions?.length === 0 && (
                  <div
                    className="empty-state"
                    style={{ border: "none", textAlign: "left", padding: 0 }}
                  >
                    No sessions linked.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
