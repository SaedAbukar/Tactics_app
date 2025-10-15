import React, { useState } from "react";
import type { Team, Session } from "../../types/types";
import "./Controls.css";
import { useTranslation } from "react-i18next";

interface ControlsProps {
  teams: Team[];
  selectedSession?: Session | null;
  onUpdateSelectedSession?: (session: Session | null) => void;
  onAddPlayers: (count: number, color: string, teamId?: number) => void;
  onAddBalls: (count: number) => void;
  onAddGoals: (count: number) => void;
  onAddCones: (count: number, color: string) => void;
  onAddTeam: (name: string, color: string) => void;
  onSaveStep: () => void;
  onPlay: () => void;
  onPause: () => void;
  onContinue: () => void;
  onStop: () => void;
  onClearPitch: () => void;
  onSpeedChange: (speed: number) => void;
  playing: boolean;
  paused: boolean;
  stepsCount: number;
  speed: number;
}

export const Controls: React.FC<ControlsProps> = ({
  teams,
  selectedSession,
  onUpdateSelectedSession,
  onAddPlayers,
  onAddBalls,
  onAddGoals,
  onAddCones,
  onAddTeam,
  onSaveStep,
  onPlay,
  onPause,
  onContinue,
  onStop,
  onClearPitch,
  onSpeedChange,
  playing,
  paused,
  stepsCount,
  speed,
}) => {
  const { t } = useTranslation("tacticalEditor");
  const [teamName, setTeamName] = useState("");
  const [teamColor, setTeamColor] = useState(t("colors.black"));
  const [playerCount, setPlayerCount] = useState(3);
  const [ballCount, setBallCount] = useState(1);
  const [goalCount, setGoalCount] = useState(1);
  const [coneCount, setConeCount] = useState(1);
  const [playerColor, setPlayerColor] = useState(t("colors.black"));
  const [coneColor, setConeColor] = useState("orange");
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
    undefined
  );

  type ColorKeys =
    | "black"
    | "white"
    | "blue"
    | "red"
    | "yellow"
    | "purple"
    | "orange"
    | "cyan"
    | "pink";

  const colors1: ColorKeys[] = [
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

  // Wrap onSaveStep to also update selectedSession
  const handleSaveStep = () => {
    onSaveStep();
    if (selectedSession && onUpdateSelectedSession) {
      onUpdateSelectedSession({ ...selectedSession });
    }
  };

  return (
    <div className="controls-container">
      {/* Teams */}
      <div className="control-group">
        <label>{t("controls.createTeam")}</label>
        <input
          type="text"
          placeholder={t("controls.teamNamePlaceholder")}
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <select
          value={teamColor}
          onChange={(e) => setTeamColor(e.target.value)}
        >
          {colors1.map((c) => (
            <option key={c} value={c}>
              {t(`colors.${c}`)}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (teamName.trim()) {
              onAddTeam(teamName, teamColor);
              setTeamName("");
            }
          }}
        >
          {t("controls.addTeam")}
        </button>
      </div>

      {/* Players */}
      <div className="control-group">
        <label>{t("controls.players")}</label>
        <input
          type="number"
          min={1}
          max={20}
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
        />
        <select
          value={playerColor}
          onChange={(e) => setPlayerColor(e.target.value)}
        >
          {colors1.map((c) => (
            <option key={c} value={c}>
              {t(`colors.${c}`)}
            </option>
          ))}
        </select>
        <select
          value={selectedTeamId}
          onChange={(e) =>
            setSelectedTeamId(Number(e.target.value) || undefined)
          }
        >
          <option value="">{t("controls.createTeam")}</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => onAddPlayers(playerCount, playerColor, selectedTeamId)}
          disabled={playing}
        >
          {t("controls.addPlayers")}
        </button>
      </div>

      {/* Balls */}
      <div className="control-group">
        <label>{t("controls.balls")}</label>
        <input
          type="number"
          min={1}
          max={10}
          value={ballCount}
          onChange={(e) => setBallCount(Number(e.target.value))}
        />
        <button onClick={() => onAddBalls(ballCount)} disabled={playing}>
          {t("controls.addBalls")}
        </button>
      </div>

      {/* Goals */}
      <div className="control-group">
        <label>{t("controls.goals")}</label>
        <input
          type="number"
          min={1}
          max={10}
          value={goalCount}
          onChange={(e) => setGoalCount(Number(e.target.value))}
        />
        <button onClick={() => onAddGoals(goalCount)} disabled={playing}>
          {t("controls.addGoals")}
        </button>
      </div>

      {/* Cones */}
      <div className="control-group">
        <label>{t("controls.cones")}</label>
        <input
          type="number"
          min={1}
          max={10}
          value={coneCount}
          onChange={(e) => setConeCount(Number(e.target.value))}
        />
        <select
          value={coneColor}
          onChange={(e) => setConeColor(e.target.value)}
        >
          {colors1.map((c) => (
            <option key={c} value={c}>
              {t(`colors.${c}`)}
            </option>
          ))}
        </select>
        <button
          onClick={() => onAddCones(coneCount, coneColor)}
          disabled={playing}
        >
          {t("controls.addCones")}
        </button>
      </div>

      {/* Save / Play / Pause / Continue / Stop */}
      <div className="control-group">
        <label>{t("controls.animation")}</label>
        <button onClick={handleSaveStep} disabled={playing}>
          {t("saveStep")}
        </button>
        {!playing ? (
          <button onClick={onPlay} disabled={stepsCount === 0}>
            {t("play")}
          </button>
        ) : paused ? (
          <button onClick={onContinue}>{t("continue")}</button>
        ) : (
          <button onClick={onPause}>{t("pause")}</button>
        )}
        <button onClick={onStop} disabled={!playing && !paused}>
          {t("stop")}
        </button>
      </div>

      {/* Speed */}
      <div className="control-group speed-control">
        <label>{t("controls.speed")}</label>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
        <span style={{ color: "white" }}>{speed.toFixed(1)}x</span>
        <button onClick={() => onSpeedChange(1)} disabled={speed === 1}>
          {t("controls.resetSpeed")}
        </button>
      </div>

      {/* Clear pitch */}
      <button onClick={onClearPitch}>{t("controls.clearPitch")}</button>
    </div>
  );
};
