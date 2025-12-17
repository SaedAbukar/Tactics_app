import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useExercises } from "../../../../context/ExercisesProvider";
import { Pitch } from "../../../pitch/Pitch";
import type { Session } from "../../../../types/types";

interface SessionPreviewProps {
  session: Session;
}

export const SessionPreview: React.FC<SessionPreviewProps> = observer(
  ({ session }) => {
    const { tacticalBoardViewModel } = useExercises();
    const loopRef = useRef<number | null>(null);
    const steps = session.steps || [];

    useEffect(() => {
      if (steps.length > 0) {
        // 1. Initialize Animation State
        tacticalBoardViewModel.stopAnimation();
        tacticalBoardViewModel.savedSteps = JSON.parse(JSON.stringify(steps));
        tacticalBoardViewModel.loadStep(0);
        tacticalBoardViewModel.play();

        // 2. Continuous Loop Logic
        loopRef.current = window.setInterval(() => {
          const currentIndex = tacticalBoardViewModel.currentStepIndex ?? 0;
          const isAtEnd = currentIndex >= steps.length - 1;

          // Restart loop if finished
          if (isAtEnd) {
            tacticalBoardViewModel.loadStep(0);
            tacticalBoardViewModel.play();
          }
        }, 1000);
      }

      return () => {
        if (loopRef.current) clearInterval(loopRef.current);
        tacticalBoardViewModel.stopAnimation();
      };
    }, [session, tacticalBoardViewModel, steps]);

    return (
      <div className="session-preview">
        <h3 className="section-label">
          Tactical Preview ({steps.length} Steps)
        </h3>
        <div
          className="pitch-container"
          style={{
            height: "500px",
            width: "100%",
            background: "#eee",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #ccc",
            position: "relative",
          }}
        >
          <Pitch vm={tacticalBoardViewModel} width={700} height={900} />
        </div>
      </div>
    );
  }
);
