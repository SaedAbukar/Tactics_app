import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useExercises } from "../../../../context/ExercisesProvider";
import type { Practice, GameTactic } from "../../../../types/types";

interface IncludedSessionsProps {
  item: Practice | GameTactic;
}

export const IncludedSessions: React.FC<IncludedSessionsProps> = observer(
  ({ item }) => {
    const { exercisesViewModel } = useExercises();
    const [isAdding, setIsAdding] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string>("");

    const currentSessions = item.sessions || [];

    // Filter: Exclude sessions already in this practice
    const availableSessions = exercisesViewModel.sessionsState.personal.filter(
      (s) => !currentSessions.some((existing) => existing.id === s.id)
    );

    const handleAdd = () => {
      if (!selectedSessionId) return;

      // Call your view model add logic here
      console.log(`Adding session ${selectedSessionId} to item ${item.id}`);

      // Reset state
      setSelectedSessionId("");
      setIsAdding(false);
    };

    return (
      <div className="included-sessions-wrapper">
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 className="section-label" style={{ marginBottom: 0 }}>
            Included Sessions ({currentSessions.length})
          </h3>

          {/* Toggle Add Button */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              style={{
                background: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>+</span> Add Session
            </button>
          ) : (
            <button
              onClick={() => setIsAdding(false)}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Add Session Panel */}
        {isAdding && (
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              animation: "fadeIn 0.2s ease-in-out",
            }}
          >
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#334155" }}>
              Select a session to add
            </h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                }}
              >
                <option value="">-- Choose from Library --</option>
                {availableSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                disabled={!selectedSessionId}
                style={{
                  background: !selectedSessionId
                    ? "#94a3b8"
                    : "var(--primary-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0 1.5rem",
                  cursor: !selectedSessionId ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                Confirm
              </button>
            </div>
            {availableSessions.length === 0 && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                No sessions available to add.
              </p>
            )}
          </div>
        )}

        {/* Session List */}
        <div className="grid-list">
          {currentSessions.map((s) => (
            <div
              key={s.id}
              className="item-card clickable-session"
              onClick={() => exercisesViewModel.selectItem(s)}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <strong
                style={{ display: "block", color: "var(--text-primary)" }}
              >
                {s.name}
              </strong>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {s.description?.slice(0, 50)}...
              </span>
            </div>
          ))}
          {currentSessions.length === 0 && !isAdding && (
            <div
              className="empty-state"
              style={{ border: "none", textAlign: "left", padding: 0 }}
            >
              No sessions linked yet. Click "Add Session" to start building.
            </div>
          )}
        </div>
      </div>
    );
  }
);
