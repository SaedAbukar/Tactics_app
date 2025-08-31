import React, { useState, useRef } from "react";
import type { Player, Ball, Goal, Step, DragItem, EntityType } from "./types";
import { Pitch } from "./Pitch";
import { Controls } from "./Controls";

let nextId = 1;

export const TacticalEditor: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savedSteps, setSavedSteps] = useState<Step[]>([]);
  const [playing, setPlaying] = useState(false);

  const dragRef = useRef<DragItem | null>(null);
  const colors = ["blue", "red", "yellow", "purple", "orange", "cyan", "pink"];

  // ===== Generic Add Entity =====
  const addEntity = (type: EntityType, count: number = 1) => {
    if (type === "player") {
      const newPlayers: Player[] = [];
      for (let i = 1; i <= count; i++) {
        newPlayers.push({
          id: nextId++,
          x: 50 + players.length * 50 + i * 20,
          y: 100 + players.length * 30 + i * 10,
          color: colors[(players.length + i - 1) % colors.length],
        });
      }
      setPlayers((prev) => [...prev, ...newPlayers]);
    } else if (type === "ball") {
      const newBalls: Ball[] = [];
      for (let i = 1; i <= count; i++) {
        newBalls.push({
          id: nextId++,
          x: 100 + balls.length * 50 + i * 20,
          y: 200,
        });
      }
      setBalls((prev) => [...prev, ...newBalls]);
    } else if (type === "goal") {
      const newGoals: Goal[] = [];
      for (let i = 1; i <= count; i++) {
        newGoals.push({
          id: nextId++,
          x: 50 + goals.length * 60 + i * 10,
          y: 350,
          width: 50,
          depth: 10,
        });
      }
      setGoals((prev) => [...prev, ...newGoals]);
    }
  };

  // ===== Save Step =====
  const handleSaveStep = () => {
    setSavedSteps((prev) => [
      ...prev,
      {
        players: players.map((p) => ({ ...p })),
        balls: balls.map((b) => ({ ...b })),
        goals: goals.map((g) => ({ ...g })),
      },
    ]);
    alert(`Step saved! Total steps: ${savedSteps.length + 1}`);
  };

  // ===== Play Animation =====
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

        // Interpolate goals
        setGoals(
          current.goals.map((g, i) => {
            const target = next.goals[i];
            return {
              ...g,
              x: g.x + (target.x - g.x) * t,
              y: g.y + (target.y - g.y) * t,
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
        onAddPlayers={(count) => addEntity("player", count)}
        onAddBalls={(count) => addEntity("ball", count)}
        onAddGoals={(count) => addEntity("goal", count)}
        onSaveStep={handleSaveStep}
        onPlay={handlePlay}
        playing={playing}
        stepsCount={savedSteps.length}
      />

      <Pitch
        players={players}
        balls={balls}
        goals={goals}
        dragRef={dragRef}
        setPlayers={setPlayers}
        setBalls={setBalls}
        setGoals={setGoals}
      />
    </div>
  );
};
