import React, { useState } from "react";
import type { Team } from "./types";

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

  const [playerColor, setPlayerColor] = useState<string>(colors[0]);
  const [ballColor, setBallColor] = useState<string>(colors[0]);
  const [goalColor, setGoalColor] = useState<string>(colors[0]);
  const [coneColor, setConeColor] = useState<string>("orange");
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
    undefined
  );

  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      {/* Players */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "white", marginRight: 5 }}>Players:</label>
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
          onClick={() => onAddPlayers(playerCount, playerColor, selectedTeamId)}
          disabled={playing}
          style={{ marginLeft: 5 }}
        >
          Add Players
        </button>
      </div>

      {/* Balls */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "white", marginRight: 5 }}>Balls:</label>
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
          onClick={() => onAddBalls(ballCount, ballColor)}
          disabled={playing}
          style={{ marginLeft: 5 }}
        >
          Add Balls
        </button>
      </div>

      {/* Goals */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "white", marginRight: 5 }}>Goals:</label>
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
          onClick={() => onAddGoals(goalCount, goalColor)}
          disabled={playing}
          style={{ marginLeft: 5 }}
        >
          Add Goals
        </button>
      </div>

      {/* Cones */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "white", marginRight: 5 }}>Cones:</label>
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
          onClick={() => onAddCones(coneCount, coneColor)}
          disabled={playing}
          style={{ marginLeft: 5 }}
        >
          Add Cones
        </button>
      </div>

      {/* Save / Play / Pause / Continue / Stop */}
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={onSaveStep}
          disabled={playing}
          style={{ marginRight: 10 }}
        >
          Save Step
        </button>

        {!playing ? (
          <button onClick={onPlay} disabled={stepsCount === 0}>
            Play Animation
          </button>
        ) : paused ? (
          <button onClick={onContinue}>Continue</button>
        ) : (
          <button onClick={onPause}>Pause</button>
        )}

        <button
          onClick={onStop}
          disabled={!playing && !paused}
          style={{ marginLeft: 10 }}
        >
          Stop
        </button>
      </div>

      {/* Speed Control */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "white", marginRight: 5 }}>
          Animation Speed:
        </label>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          style={{ width: 200 }}
        />
        <span style={{ color: "white", marginLeft: 10 }}>
          {speed.toFixed(1)}x
        </span>
        <button
          onClick={() => onSpeedChange(1)}
          style={{ marginLeft: 10 }}
          disabled={speed === 1}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
