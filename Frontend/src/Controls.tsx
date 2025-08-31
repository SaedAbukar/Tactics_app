import React, { useState } from "react";

interface ControlsProps {
  onAddPlayers: (count: number) => void;
  onAddBalls: (count: number) => void;
  onAddGoals: (count: number) => void;
  onSaveStep: () => void;
  onPlay: () => void;
  playing: boolean;
  stepsCount: number;
}

export const Controls: React.FC<ControlsProps> = ({
  onAddPlayers,
  onAddBalls,
  onAddGoals,
  onSaveStep,
  onPlay,
  playing,
  stepsCount,
}) => {
  const [playerCount, setPlayerCount] = useState(3);
  const [ballCount, setBallCount] = useState(1);
  const [goalCount, setGoalCount] = useState(1);

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
        <button
          onClick={() => onAddPlayers(playerCount)}
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
        <button
          onClick={() => onAddBalls(ballCount)}
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
        <button
          onClick={() => onAddGoals(goalCount)}
          disabled={playing}
          style={{ marginLeft: 5 }}
        >
          Add Goals
        </button>
      </div>

      {/* Save / Play */}
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={onSaveStep}
          disabled={playing}
          style={{ marginRight: 10 }}
        >
          Save Step
        </button>
        <button onClick={onPlay} disabled={playing || stepsCount === 0}>
          Play Animation
        </button>
      </div>
    </div>
  );
};
