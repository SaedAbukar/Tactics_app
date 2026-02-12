import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Share2 } from "lucide-react";

import { useExercises } from "../../../context/ExercisesProvider";
// Ensure ShareRole (constant) is imported alongside types
import {
  ShareRole,
  type SessionDetail,
  type PracticeDetail,
  type GameTacticDetail,
} from "../../../types/types";

import { DetailHeader } from "./detail/DetailHeader";
import { SessionPreview } from "./detail/SessionPreview";
import { IncludedSessions } from "./detail/IncludedSessions";
import { ShareModal } from "./SearchModal";
import "../Exercises.css";

interface DetailViewProps {
  item: SessionDetail | PracticeDetail | GameTacticDetail;
  type: string;
  onBack: () => void;
}

export const DetailView = observer(
  ({ item, type, onBack }: DetailViewProps) => {
    const { exercisesViewModel: eVm } = useExercises();
    const { t } = useTranslation(["exercises", "common"]);
    const [showShare, setShowShare] = useState(false);

    const isOwner = item.role === ShareRole.OWNER;

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

          {isOwner && (
            <button className="btn-action secondary" onClick={handleOpenShare}>
              <Share2 size={16} />
              {t("common:share")}
            </button>
          )}
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

            {isSession && <SessionPreview session={item as SessionDetail} />}

            {"sessions" in item && (
              <IncludedSessions
                item={item as PracticeDetail | GameTacticDetail}
                type={type as "practices" | "tactics"}
              />
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
  },
);
