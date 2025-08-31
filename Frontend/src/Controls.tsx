import React, { useState } from "react";
import type { Team } from "./types";
import "./Controls.css";

interface ControlsProps {
  colors: string[];
  teams: Team[];
  onAddPlayers: (count: number, color?: string, teamId?: number) => void;
  onAddBalls: (count: number, color?: string) => void;
  onAddGoals: (count: number, color?: string) => void;
  onAddCones: (count: number, color?: string) => void;
  onSaveStep: () => void;
  onPlay: () => void;
  onPause: () => void;
  onContinue: () => void;
  onStop: () => void;
  onSpeedChange: (speed: number) => void;
  playing: boolean;
  paused: boolean;
  stepsCount: number;
  speed: number;
}

export const Controls: React.FC<ControlsProps> = ({
  colors,
  teams,
  onAddPlayers,
  onAddBalls,
  onAddGoals,
  onAddCones,
  onSaveStep,
  onPlay,
  onPause,
  onContinue,
  onStop,
  onSpeedChange,
  playing,
  paused,
  stepsCount,
  speed,
}) => {
  const [playerCount, setPlayerCount] = useState(3);
  const [ballCount, setBallCount] = useState(1);
  const [goalCount, setGoalCount] = useState(1);
  const [coneCount, setConeCount] = useState(1);

  const [playerColor, setPlayerColor] = useState(colors[0]);
  const [ballColor, setBallColor] = useState(colors[0]);
  const [goalColor, setGoalColor] = useState(colors[0]);
  const [coneColor, setConeColor] = useState("orange");
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
    undefined
  );

  return (
    <div className="controls-container">
      {/* Players */}
      <div className="control-group">
        <label>Players:</label>
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
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={selectedTeamId}
          onChange={(e) =>
            setSelectedTeamId(Number(e.target.value) || undefined)
          }
        >
          <option value="">No Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          className="light-button"
          onClick={() => onAddPlayers(playerCount, playerColor, selectedTeamId)}
          disabled={playing}
        >
          Add Players
        </button>
      </div>

      {/* Balls */}
      <div className="control-group">
        <label>Balls:</label>
        <input
          type="number"
          min={1}
          max={10}
          value={ballCount}
          onChange={(e) => setBallCount(Number(e.target.value))}
        />
        <select
          value={ballColor}
          onChange={(e) => setBallColor(e.target.value)}
        >
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className="light-button"
          onClick={() => onAddBalls(ballCount, ballColor)}
          disabled={playing}
        >
          Add Balls
        </button>
      </div>

      {/* Goals */}
      <div className="control-group">
        <label>Goals:</label>
        <input
          type="number"
          min={1}
          max={10}
          value={goalCount}
          onChange={(e) => setGoalCount(Number(e.target.value))}
        />
        <select
          value={goalColor}
          onChange={(e) => setGoalColor(e.target.value)}
        >
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className="light-button"
          onClick={() => onAddGoals(goalCount, goalColor)}
          disabled={playing}
        >
          Add Goals
        </button>
      </div>

      {/* Cones */}
      <div className="control-group">
        <label>Cones:</label>
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
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className="light-button"
          onClick={() => onAddCones(coneCount, coneColor)}
          disabled={playing}
        >
          Add Cones
        </button>
      </div>

      {/* Save / Play / Pause / Continue / Stop */}
      <div className="control-group">
        <button
          className="light-button"
          onClick={onSaveStep}
          disabled={playing}
        >
          Save Step
        </button>
        {!playing ? (
          <button
            className="light-button"
            onClick={onPlay}
            disabled={stepsCount === 0}
          >
            Play
          </button>
        ) : paused ? (
          <button className="light-button" onClick={onContinue}>
            Continue
          </button>
        ) : (
          <button className="light-button" onClick={onPause}>
            Pause
          </button>
        )}
        <button
          className="light-button"
          onClick={onStop}
          disabled={!playing && !paused}
        >
          Stop
        </button>
      </div>

      {/* Speed */}
      <div className="control-group speed-control">
        <label>Speed:</label>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
        <span style={{ color: "white" }}>{speed.toFixed(1)}x</span>
        <button
          className="light-button"
          onClick={() => onSpeedChange(1)}
          disabled={speed === 1}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
