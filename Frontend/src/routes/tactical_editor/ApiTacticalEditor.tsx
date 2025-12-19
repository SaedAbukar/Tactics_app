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
  const { tacticalBoardViewModel: vm, exercisesViewModel: dbVM } =
    useExercises();

  // Local State
  const [viewType, setViewType] = useState<
    "sessions" | "practices" | "game tactics"
  >("sessions");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [currentName, setCurrentName] = useState<string>("Select Session");

  // Default to true. CSS forces it visible on desktop regardless.
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---

  const handleSelectSession = (steps: any[], item?: any) => {
    vm.stopAnimation();
    vm.clearPitch();

    vm.updateSavedSteps(JSON.parse(JSON.stringify(steps)));

    if (steps.length > 0) vm.loadStep(0);

    if (item && item.name) {
      setCurrentName(item.name);
    } else {
      setCurrentName("Untitled Session");
    }

    if (item && item.id) {
      vm.setActiveSessionId(item.id);
    } else {
      vm.setActiveSessionId(null);
    }

    setIsSelectorOpen(false);
  };

  const handleSaveChanges = async () => {
    if (!vm.activeSessionId) return;

    setIsSaving(true);

    try {
      const payload = {
        steps: JSON.parse(JSON.stringify(vm.savedSteps)),
      };
      await dbVM.updateSession(vm.activeSessionId, payload);
    } catch (error) {
      console.error("Failed to save changes", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="tactical-container">
      {/* MOBILE HEADER */}
      <div className="mobile-editor-header">
        <div className="current-selection-info">
          <span className="label">Editing:</span>
          <span className="value">{currentName}</span>
        </div>

        <div className="mobile-actions">
          {vm.activeSessionId && (
            <button
              className="save-changes-btn"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "..." : "Save"}
            </button>
          )}
          <button
            className="selector-toggle-btn"
            onClick={() => setIsSelectorOpen(true)}
          >
            Change ▼
          </button>
        </div>
      </div>

      {/* LEFT: Library Modal */}
      <div className={`tactical-left ${isSelectorOpen ? "open" : ""}`}>
        <div className="mobile-selector-controls">
          <h3>Library</h3>
          <button
            className="close-selector-btn"
            onClick={() => setIsSelectorOpen(false)}
          >
            ✕
          </button>
        </div>
        <ApiSessionSelector
          viewType={viewType}
          setViewType={setViewType}
          onSelectSession={(steps, item) => handleSelectSession(steps, item)}
        />
      </div>

      {/* MIDDLE: Pitch */}
      <div className="tactical-mid">
        <div className="pitch-wrapper">
          <Pitch vm={vm} width={700} height={900} />
        </div>
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
            <span className="empty-steps-text">No steps</span>
          )}
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div className={`tactical-right ${!isControlsOpen ? "collapsed" : ""}`}>
        {/* FULL CONTROLS: Always on desktop, toggles on mobile */}
        <div
          className={`full-controls-container ${
            isControlsOpen ? "open" : "closed"
          }`}
        >
          <div className="controls-header-actions">
            <span>Editor Tools</span>
            <button
              className="toggle-controls-btn"
              onClick={() => setIsControlsOpen(false)}
            >
              Hide ▲
            </button>
          </div>

          {/* DESKTOP SAVE BUTTON */}
          {vm.activeSessionId && (
            <button
              className="modern-btn primary full-width mb-4"
              onClick={handleSaveChanges}
              disabled={isSaving}
              style={{ marginBottom: "1rem" }}
            >
              {isSaving ? "Saving..." : "💾 Save Changes"}
            </button>
          )}

          <Controls vm={vm} />
        </div>

        {/* MINIMIZED CONTROLS: Never on desktop, toggles on mobile */}
        <div
          className={`minimized-controls-container ${
            !isControlsOpen ? "open" : "closed"
          }`}
        >
          <div className="mini-playback-group">
            {!vm.isPlaying ? (
              <button
                className="mini-btn play"
                onClick={vm.play}
                disabled={vm.savedSteps.length === 0}
              >
                ▶
              </button>
            ) : vm.isPaused ? (
              <button className="mini-btn warning" onClick={vm.continue}>
                ▶
              </button>
            ) : (
              <button className="mini-btn warning" onClick={vm.pause}>
                ⏸
              </button>
            )}
            <button
              className="mini-btn danger icon-only"
              onClick={vm.stopAnimation}
            >
              ⏹
            </button>
          </div>

          <div className="mini-slider-container">
            <span className="mini-label">{vm.speed.toFixed(1)}x</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={vm.speed}
              onChange={(e) => vm.setSpeed(Number(e.target.value))}
              className="mini-slider"
            />
          </div>

          <button
            className="toggle-controls-btn expand"
            onClick={() => setIsControlsOpen(true)}
          >
            Tools ▼
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isSelectorOpen && (
        <div
          className="selector-backdrop"
          onClick={() => setIsSelectorOpen(false)}
        />
      )}
    </div>
  );
});
