import React, { useState, useRef } from "react";
import type {
  Player,
  Ball,
  Goal,
  Step,
  DragItem,
  EntityType,
  Team,
} from "./types";
import { Pitch } from "./Pitch";
import { Controls } from "./Controls";

let nextId = 1; // global counter for unique numeric IDs

export const TacticalEditor: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [savedSteps, setSavedSteps] = useState<Step[]>([]);
  const [playing, setPlaying] = useState(false);

  const dragRef = useRef<DragItem | null>(null);
  const colors = ["blue", "red", "yellow", "purple", "orange", "cyan", "pink"];

  // ===== Generic Add Entity =====
  const addEntity = (type: EntityType, count: number = 1, teamId?: number) => {
    if (type === "player") {
      const newPlayers: Player[] = [];
      for (let i = 0; i < count; i++) {
        newPlayers.push({
          id: nextId++,
          x: 50 + players.length * 50 + i * 20,
          y: 100 + players.length * 30 + i * 10,
          color: teamId
            ? teams.find((t) => t.id === teamId)?.color || "white"
            : colors[(players.length + i) % colors.length],
          teamId: teamId,
        });
      }
      setPlayers((prev) => [...prev, ...newPlayers]);
    } else if (type === "ball") {
      const newBalls: Ball[] = [];
      for (let i = 0; i < count; i++) {
        newBalls.push({
          id: nextId++,
          x: 100 + balls.length * 50 + i * 20,
          y: 200,
        });
      }
      setBalls((prev) => [...prev, ...newBalls]);
    } else if (type === "goal") {
      const newGoals: Goal[] = [];
      for (let i = 0; i < count; i++) {
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

  // ===== Add Team =====
  const addTeam = (name: string, color: string) => {
    setTeams((prev) => [...prev, { id: nextId++, name, color }]);
  };

  // ===== Save Step =====
  const handleSaveStep = () => {
    setSavedSteps((prev) => [
      ...prev,
      {
        players: players.map((p) => ({ ...p })),
        balls: balls.map((b) => ({ ...b })),
        goals: goals.map((g) => ({ ...g })),
        teams: teams.map((t) => ({ ...t })),
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

      {/* Team Creation */}
      <div style={{ marginBottom: 10, color: "white" }}>
        <input type="text" id="teamName" placeholder="Team Name" />
        <select id="teamColor">
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            const name = (
              document.getElementById("teamName") as HTMLInputElement
            ).value;
            const color = (
              document.getElementById("teamColor") as HTMLSelectElement
            ).value;
            if (name && color) addTeam(name, color);
          }}
        >
          Add Team
        </button>
      </div>

      <Controls
        teams={teams} // pass teams to Controls for selection
        onAddPlayers={(count, teamId) => addEntity("player", count, teamId)}
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
        teams={teams}
        dragRef={dragRef}
        setPlayers={setPlayers}
        setBalls={setBalls}
        setGoals={setGoals}
      />
    </div>
  );
};
