import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import "./TacticalEditor.css";

// Components
import { Pitch } from "../../components/pitch/Pitch";
import { Controls } from "../../components/controls/Controls";
import { ApiSessionSelector } from "../../components/session/ApiSessionSelector";

// Hooks
import { useExercises } from "../../context/ExercisesProvider";

export const ApiTacticalEditor: React.FC = observer(() => {
  // 1. Get the Tactical Logic (ViewModel)
  const { tacticalBoardViewModel: vm } = useExercises();

  // 2. Local State for the Selector View
  const [viewType, setViewType] = useState<
    "sessions" | "practices" | "game tactics"
  >("sessions");

  // Handler: When a session is clicked in the sidebar, load it into the board
  const handleSelectSession = (steps: any[]) => {
    vm.stopAnimation();
    vm.clearPitch();
    // We deep copy the steps to avoid modifying the library data directly during editing
    // until the user explicitly saves (if you implement save-back logic later)
    vm.updateSavedSteps(JSON.parse(JSON.stringify(steps)));

    if (steps.length > 0) {
      vm.loadStep(0); // Load first step to canvas
    }
  };

  return (
    <div className="tactical-container">
      {/* LEFT: Sidebar / Library */}
      <div className="tactical-left">
        <ApiSessionSelector
          viewType={viewType}
          setViewType={setViewType}
          onSelectSession={handleSelectSession}
        />
      </div>

      {/* MIDDLE: Pitch & Timeline */}
      <div className="tactical-mid">
        <Pitch vm={vm} width={700} height={900} />

        {/* Step Timeline */}
        <div className="step-list">
          {vm.savedSteps.map((_, idx) => (
            <button
              key={idx}
              className={`step-bubble ${
                vm.currentStepIndex === idx ? "active" : ""
              }`}
              onClick={() => vm.loadStep(idx)}
            >
              {idx + 1}
            </button>
          ))}
          {vm.savedSteps.length === 0 && (
            <span className="empty-steps-text">No steps saved yet</span>
          )}
        </div>
      </div>

      {/* RIGHT: Tools & Controls */}
      <div className="tactical-right">
        <Controls vm={vm} />
      </div>
    </div>
  );
});
