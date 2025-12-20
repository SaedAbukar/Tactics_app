import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useExercises } from "../../../../context/ExercisesProvider";
import { Pitch } from "../../../pitch/Pitch";
import type { Session } from "../../../../types/types";

interface SessionPreviewProps {
  session: Session;
}

export const SessionPreview: React.FC<SessionPreviewProps> = observer(
  ({ session }) => {
    const { t } = useTranslation("exercises");
    const { tacticalBoardViewModel } = useExercises();
    const loopRef = useRef<number | null>(null);
    const steps = session.steps || [];

    useEffect(() => {
      if (steps.length > 0) {
        tacticalBoardViewModel.stopAnimation();
        tacticalBoardViewModel.updateSavedSteps(
          JSON.parse(JSON.stringify(steps))
        );
        tacticalBoardViewModel.loadStep(0);
        tacticalBoardViewModel.play();

        loopRef.current = window.setInterval(() => {
          const currentIndex = tacticalBoardViewModel.currentStepIndex ?? 0;
          const isAtEnd = currentIndex >= steps.length - 1;

          if (isAtEnd) {
            tacticalBoardViewModel.loadStep(0);
            tacticalBoardViewModel.play();
          }
        }, 500);
      }

      return () => {
        if (loopRef.current) clearInterval(loopRef.current);
        tacticalBoardViewModel.stopAnimation();
      };
    }, [session, tacticalBoardViewModel, steps]);

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
  }
);
