import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import type { Session, Practice, GameTactic } from "../../../types/types";
import "../Exercises.css";

// 1. Import the icon
import { ArrowLeft, Share2 } from "lucide-react";

import { DetailHeader } from "./detail/DetailHeader";
import { SessionPreview } from "./detail/SessionPreview";
import { IncludedSessions } from "./detail/IncludedSessions";
import { useState } from "react";
import { ShareModal } from "./SearchModal";
import { useExercises } from "../../../context/ExercisesProvider";

interface DetailViewProps {
  item: Session | Practice | GameTactic;
  type: string;
  onBack: () => void;
}

export const DetailView = observer(
  ({ item, type, onBack }: DetailViewProps) => {
    const { exercisesViewModel: eVm } = useExercises();
    const { t } = useTranslation(["exercises", "common"]);
    const [showShare, setShowShare] = useState(false);

    const isSession = "steps" in item;
    const shareType: "session" | "practice" | "tactic" = isSession
      ? "session"
      : type === "tactics"
      ? "tactic"
      : "practice";

    const handleOpenShare = () => {
      eVm.loadCollaborators(shareType, item.id);
      setShowShare(true);
    };

    return (
      <div className="detail-container">
        <div className="header-section">
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={16} />
            {t("common:back")}
          </button>

          {/* 2. Added the icon inside the button */}
          <button className="btn-action secondary" onClick={handleOpenShare}>
            <Share2 size={16} />
            {t("common:share")}
          </button>
        </div>

        <div className="detail-card">
          <DetailHeader
            item={item}
            label={
              isSession
                ? t("exercises:sharing.session")
                : t("exercises:sharing.practice")
            }
          />
          <div className="detail-body">
            <p className="description-text">{item.description}</p>

            {isSession && <SessionPreview session={item as Session} />}

            {"sessions" in item && (
              <IncludedSessions item={item as Practice} type={type as any} />
            )}
          </div>
        </div>

        {showShare && (
          <ShareModal
            itemId={item.id}
            itemType={shareType}
            onClose={() => setShowShare(false)}
          />
        )}
      </div>
    );
  }
);
