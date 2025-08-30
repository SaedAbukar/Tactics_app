import React from "react";

interface ControlsProps {
  onAddPlayers: (count: number) => void;
  onAddBalls: (count: number) => void;
  onSaveStep: () => void;
  onPlay: () => void;
  playing: boolean;
  stepsCount: number;
}

export const Controls: React.FC<ControlsProps> = ({
  onAddPlayers,
  onAddBalls,
  onSaveStep,
  onPlay,
  playing,
  stepsCount,
}) => {
  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "white", marginRight: 5 }}>Players:</label>
        <input
          type="number"
          min={1}
          max={20}
          defaultValue={3}
          id="playerCount"
        />
        <button
          onClick={() =>
            onAddPlayers(
              Number(
                (document.getElementById("playerCount") as HTMLInputElement)
                  .value
              )
            )
          }
          disabled={playing}
        >
          Add Players
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "white", marginRight: 5 }}>Balls:</label>
        <input type="number" min={1} max={10} defaultValue={1} id="ballCount" />
        <button
          onClick={() =>
            onAddBalls(
              Number(
                (document.getElementById("ballCount") as HTMLInputElement).value
              )
            )
          }
          disabled={playing}
        >
          Add Balls
        </button>
      </div>

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
