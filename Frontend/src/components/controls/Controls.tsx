import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { useTranslation } from "react-i18next";
import { TacticalBoardViewModel } from "../../features/exercises/viewmodels/TacticalBoardViewModel";
import "./Controls.css";

// Separate file or defined here, ensure it accepts 'label' as string
import { CounterControl } from "./CounterControl";

interface ControlsProps {
  vm: TacticalBoardViewModel;
}

export const Controls: React.FC<ControlsProps> = observer(({ vm }) => {
  const { t } = useTranslation(["tacticalEditor", "common"]);

  // Local UI state
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamColor, setTeamColor] = useState("black");

  // Settings for adding new items
  const [selectedTeamId, setSelectedTeamId] = useState<number | string>("");
  const [selectedColor, setSelectedColor] = useState("black");

  const colors = [
    "black",
    "white",
    "blue",
    "red",
    "yellow",
    "purple",
    "orange",
    "cyan",
    "pink",
  ];

  // --- Helper to remove the last item of a type ---
  const removeLast = (type: "player" | "ball" | "goal" | "cone") => {
    runInAction(() => {
      if (type === "player") vm.players.pop();
      if (type === "ball") vm.balls.pop();
      if (type === "goal") vm.goals.pop();
      if (type === "cone") vm.cones.pop();
    });
  };

  return (
    <div className="controls-panel">
      {/* --- Section: Objects Control --- */}
      <div className="control-section">
        {/* 1. Player Configuration (Team Selection) */}
        <div className="settings-row">
          <select
            className="modern-select full-width"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            <option value="">
              {t("controls.noTeam", { defaultValue: "No Team" })}
            </option>
            {vm.teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          {/* Toggle Create Team Form */}
          <button
            className="icon-btn-mini"
            title={t("controls.createTeam", {
              defaultValue: "Create New Team",
            })}
            onClick={() => setShowCreateTeam(!showCreateTeam)}
          >
            {showCreateTeam ? "−" : "+"}
          </button>
        </div>

        {/* 2. Create Team Form (Collapsible) */}
        {showCreateTeam && (
          <div className="create-team-panel">
            <input
              type="text"
              className="modern-input"
              placeholder={t("controls.teamNamePlaceholder", {
                defaultValue: "New Team Name",
              })}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <div className="color-picker-wrapper">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`color-dot ${teamColor === c ? "active" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setTeamColor(c)}
                />
              ))}
            </div>
            <button
              className="modern-btn primary small full-width"
              onClick={() => {
                if (teamName.trim()) {
                  vm.addTeam(teamName, teamColor);
                  setTeamName("");
                  setShowCreateTeam(false);
                }
              }}
            >
              {t("controls.saveTeam", { defaultValue: "Save Team" })}
            </button>
          </div>
        )}

        {/* 3. Color Picker for Free Agents */}
        {!selectedTeamId && (
          <div className="settings-row centered">
            <span className="sub-label">
              {t("controls.color", { defaultValue: "Color:" })}
            </span>
            <div className="mini-color-picker">
              {["black", "white", "red", "blue", "yellow"].map((c) => (
                <div
                  key={c}
                  className={`mini-dot ${selectedColor === c ? "active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. Counters */}
        <div className="counters-list">
          <CounterControl
            label={t("controls.players", { defaultValue: "Players" })}
            count={vm.players.length}
            onRemove={() => removeLast("player")}
            onAdd={() => {
              const team = vm.teams.find(
                (t) => t.id === Number(selectedTeamId)
              );
              vm.addEntity("player", 1, team ? undefined : selectedColor, team);
            }}
          />

          <CounterControl
            label={t("controls.balls", { defaultValue: "Balls" })}
            count={vm.balls.length}
            onRemove={() => removeLast("ball")}
            onAdd={() => vm.addEntity("ball", 1)}
          />

          <CounterControl
            label={t("controls.goals", { defaultValue: "Goals" })}
            count={vm.goals.length}
            onRemove={() => removeLast("goal")}
            onAdd={() => vm.addEntity("goal", 1)}
          />

          <CounterControl
            label={t("controls.cones", { defaultValue: "Cones" })}
            count={vm.cones.length}
            onRemove={() => removeLast("cone")}
            onAdd={() => vm.addEntity("cone", 1)}
          />
        </div>
      </div>

      {/* --- Section: Animation Control --- */}
      <div className="control-section">
        <label className="section-label">
          {t("controls.animationLabel", {
            count: vm.savedSteps.length,
            defaultValue: `Animation (${vm.savedSteps.length} Steps)`,
          })}
        </label>

        <div className="grid-buttons">
          <button
            className="modern-btn primary"
            onClick={vm.saveStep}
            disabled={vm.isPlaying}
          >
            {t("saveStep", { defaultValue: "Save Step" })}
          </button>

          {!vm.isPlaying ? (
            <button
              className="modern-btn success"
              onClick={vm.play}
              disabled={vm.savedSteps.length === 0}
            >
              {t("play", { defaultValue: "Play" })}
            </button>
          ) : vm.isPaused ? (
            <button className="modern-btn warning" onClick={vm.continue}>
              {t("resume", { defaultValue: "Resume" })}
            </button>
          ) : (
            <button className="modern-btn warning" onClick={vm.pause}>
              {t("pause", { defaultValue: "Pause" })}
            </button>
          )}

          <button
            className="modern-btn danger"
            onClick={vm.stopAnimation}
            disabled={!vm.isPlaying && !vm.isPaused}
          >
            {t("stop", { defaultValue: "Stop" })}
          </button>
        </div>

        <div className="slider-container">
          <label>
            {t("controls.speed", { defaultValue: "Speed" })}:{" "}
            {vm.speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={vm.speed}
            onChange={(e) => vm.setSpeed(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="control-footer">
        <button
          className="modern-btn danger full-width"
          onClick={vm.clearPitch}
        >
          {t("clearPitch", { defaultValue: "Clear Pitch" })}
        </button>
      </div>
    </div>
  );
});
