import React, { useState, useRef } from "react";
import type { Player, Ball, Step, DragItem } from "./types";
import { Pitch } from "./Pitch";
import { Controls } from "./Controls";

export const TacticalEditor: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [savedSteps, setSavedSteps] = useState<Step[]>([]);
  const [playing, setPlaying] = useState(false);

  const dragRef = useRef<DragItem>(null);
  const colors = ["blue", "red", "yellow", "purple", "orange", "cyan", "pink"];

  // ====== Add Players/Balls ======
  const handleAddPlayers = (count: number) => {
    const newPlayers: Player[] = [];
    for (let i = 1; i <= count; i++) {
      newPlayers.push({
        id: i,
        x: 50 + i * 50,
        y: 100 + i * 30,
        color: colors[(i - 1) % colors.length],
      });
    }
    setPlayers(newPlayers);
  };

  const handleAddBalls = (count: number) => {
    const newBalls: Ball[] = [];
    for (let i = 1; i <= count; i++) {
      newBalls.push({ id: i, x: 100 + i * 50, y: 200 });
    }
    setBalls(newBalls);
  };

  // ====== Save Step ======
  const handleSaveStep = () => {
    setSavedSteps((prev) => [
      ...prev,
      {
        players: players.map((p) => ({ ...p })),
        balls: balls.map((b) => ({ ...b })),
      },
    ]);
    alert(`Step saved! Total steps: ${savedSteps.length + 1}`);
  };

  // ====== Play Animation ======
  const handlePlay = () => {
    if (savedSteps.length === 0) return;
    setPlaying(true);
    const stepDuration = 1500;

    const animateStep = (startTime: number, stepIdx: number) => {
      const frame = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / stepDuration, 1);

        const current = savedSteps[stepIdx];
        const next = savedSteps[stepIdx + 1] ?? current;

        // Interpolate players
        setPlayers(
          current.players.map((p, i) => {
            const target = next.players[i];
            return {
              ...p,
              x: p.x + (target.x - p.x) * t,
              y: p.y + (target.y - p.y) * t,
            };
          })
        );

        // Interpolate balls
        setBalls(
          current.balls.map((b, i) => {
            const target = next.balls[i];
            return {
              ...b,
              x: b.x + (target.x - b.x) * t,
              y: b.y + (target.y - b.y) * t,
            };
          })
        );

        if (t < 1) requestAnimationFrame(frame);
        else if (stepIdx + 1 < savedSteps.length)
          animateStep(performance.now(), stepIdx + 1);
        else setPlaying(false);
      };
      requestAnimationFrame(frame);
    };

    animateStep(performance.now(), 0);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2 style={{ color: "white" }}>Tactical Editor</h2>

      <Controls
        onAddPlayers={handleAddPlayers}
        onAddBalls={handleAddBalls}
        onSaveStep={handleSaveStep}
        onPlay={handlePlay}
        playing={playing}
        stepsCount={savedSteps.length}
      />

      <Pitch
        players={players}
        balls={balls}
        dragRef={dragRef}
        setPlayers={setPlayers}
        setBalls={setBalls}
      />
    </div>
  );
};
