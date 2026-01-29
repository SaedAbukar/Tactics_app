import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useExercises } from "../../../../context/ExercisesProvider";
import { Pitch } from "../../../pitch/Pitch";
import type { SessionDetail } from "../../../../types/types";

interface SessionPreviewProps {
  session: SessionDetail;
}

export const SessionPreview: React.FC<SessionPreviewProps> = observer(
  ({ session }) => {
    const { t } = useTranslation("exercises");
    const { tacticalBoardViewModel } = useExercises();
    const loopRef = useRef<number | null>(null);

    // session.steps is guaranteed in SessionDetail
    const steps = session.steps || [];

    useEffect(() => {
      // 1. Reset and Load
      tacticalBoardViewModel.stopAnimation();

      if (steps.length > 0) {
        // Deep copy steps to avoid mutating the original session object during playback
        tacticalBoardViewModel.updateSavedSteps(
          JSON.parse(JSON.stringify(steps)),
        );
        tacticalBoardViewModel.loadStep(0);
        tacticalBoardViewModel.play();

        // 2. Loop Logic
        loopRef.current = window.setInterval(() => {
          const currentIndex = tacticalBoardViewModel.currentStepIndex ?? 0;
          const isAtEnd = currentIndex >= steps.length - 1;

          if (isAtEnd) {
            tacticalBoardViewModel.loadStep(0);
            tacticalBoardViewModel.play();
          }
        }, 200);
      }

      // Cleanup
      return () => {
        if (loopRef.current) clearInterval(loopRef.current);
        tacticalBoardViewModel.stopAnimation();
      };
    }, [session.id, tacticalBoardViewModel, steps]); // Depend on ID to trigger reload if session changes

    return (
      <div className="session-preview">
        <h3 className="section-label">
          {t("detail.preview", {
            count: steps.length,
            defaultValue: "Preview",
          })}
        </h3>
        <div className="pitch-container">
          <Pitch vm={tacticalBoardViewModel} width={700} height={900} />
        </div>
      </div>
    );
  },
);
