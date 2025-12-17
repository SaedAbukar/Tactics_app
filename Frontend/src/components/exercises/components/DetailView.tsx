import { observer } from "mobx-react-lite";
import type { Session, Practice, GameTactic } from "../../../types/types";
import "../Exercises.css";

// Imports from the new 'detail' folder
import { DetailHeader } from "./detail/DetailHeader";
import { SessionPreview } from "./detail/SessionPreview";
import { IncludedSessions } from "./detail/IncludedSessions";

interface DetailViewProps {
  item: Session | Practice | GameTactic;
  type: string;
  onBack: () => void;
}

export const DetailView = observer(
  ({ item, type, onBack }: DetailViewProps) => {
    // Helper: Detect if drilled down into a Session
    const isSession = "steps" in item;

    // Helper: Badge Label
    const displayLabel = isSession
      ? "Session"
      : type === "tactics"
      ? "Game Tactic"
      : "Practice";

    return (
      <div className="detail-container">
        <button onClick={onBack} className="back-button">
          <span style={{ fontSize: "1.2rem" }}>←</span> Back
        </button>

        <div className="detail-card">
          {/* Header Component */}
          <DetailHeader item={item} label={displayLabel} />

          <div className="detail-body">
            <h3 className="section-label">Description</h3>
            <p className="description-text">
              {item.description || "No description provided."}
            </p>

            {/* Render Animation if Session */}
            {isSession && <SessionPreview session={item as Session} />}

            {/* Render List + Add Button if Practice/Tactic */}
            {"sessions" in item && <IncludedSessions item={item as Practice} />}
          </div>
        </div>
      </div>
    );
  }
);
