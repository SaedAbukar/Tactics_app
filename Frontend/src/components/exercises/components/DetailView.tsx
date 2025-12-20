import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation(["exercises", "common"]);

    // Helper: Detect if drilled down into a Session (Sessions have steps)
    const isSession = "steps" in item;

    // Helper: Badge Label translation
    const getBadgeLabel = () => {
      if (isSession) return t("tabs.sessions", "Session");
      if (type === "tactics") return t("tabs.tactics", "Game Tactic");
      return t("tabs.practices", "Practice");
    };

    return (
      <div className="detail-container">
        <button onClick={onBack} className="back-button">
          <span style={{ fontSize: "1.2rem" }}>←</span>{" "}
          {t("common:back", "Back")}
        </button>

        <div className="detail-card">
          {/* Header Component */}
          <DetailHeader item={item} label={getBadgeLabel()} />

          <div className="detail-body">
            <h3 className="section-label">
              {t("detail.description", "Description")}
            </h3>
            <p className="description-text">
              {item.description ||
                t("detail.noDescription", "No description provided.")}
            </p>

            {/* Render Animation if Session */}
            {isSession && <SessionPreview session={item as Session} />}

            {/* Render List + Add Button if Practice/Tactic */}
            {/* We only show IncludedSessions for non-Session items */}
            {"sessions" in item && (
              <IncludedSessions
                item={item as Practice}
                type={type === "tactics" ? "tactics" : "practices"}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);
