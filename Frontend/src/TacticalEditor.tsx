import React, { useState, useRef } from "react";
import type {
  Player,
  Ball,
  Goal,
  Cone,
  Step,
  DragItem,
  EntityType,
  Team,
} from "./types";
import { Pitch } from "./Pitch";
import { Controls } from "./Controls";
import { FormationSelector } from "./FormationSelector";
import { formations } from "./formation";

// ID generator for numeric IDs
let lastTime = 0;
let counter = 0;

function generateId(): number {
  const now = Date.now(); // milliseconds
  if (now === lastTime) {
    counter++;
  } else {
    lastTime = now;
    counter = 0;
  }
  // now * 1000 ensures room for counter up to 999 per millisecond
  return now * 1000 + counter;
}

let playerNumber = 1;

export const TacticalEditor: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [cones, setCones] = useState<Cone[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [savedSteps, setSavedSteps] = useState<Step[]>([]);
  const [playing, setPlaying] = useState(false);
  const [pitchWidth] = useState(700);
  const [pitchHeight] = useState(900);

  const dragRef = useRef<DragItem | null>(null);
  const colors = [
    "white",
    "black",
    "blue",
    "red",
    "yellow",
    "purple",
    "orange",
    "cyan",
    "pink",
  ];

  // ===== Generic Add Entity =====
  const addEntity = (
    type: EntityType,
    count: number = 1,
    color?: string,
    teamId?: number
  ) => {
    if (type === "player") {
      const newPlayers: Player[] = [];
      for (let i = 0; i < count; i++) {
        newPlayers.push({
          id: generateId(),
          number: playerNumber++,
          x: 50 + players.length * 50 + i * 20,
          y: 100 + players.length * 30 + i * 10,
          color: teamId
            ? teams.find((t) => t.id === teamId)?.color || "white"
            : color || "white",
          teamId: teamId,
        });
      }
      setPlayers((prev) => [...prev, ...newPlayers]);
    } else if (type === "ball") {
      const newBalls: Ball[] = [];
      for (let i = 0; i < count; i++) {
        newBalls.push({
          id: generateId(),
          x: 100 + balls.length * 50 + i * 20,
          y: 200,
          color: color || "white",
        });
      }
      setBalls((prev) => [...prev, ...newBalls]);
    } else if (type === "goal") {
      const newGoals: Goal[] = [];
      for (let i = 0; i < count; i++) {
        newGoals.push({
          id: generateId(),
          x: 50 + goals.length * 60 + i * 10,
          y: 350,
          width: 70,
          depth: 30,
          color: color || "white",
        });
      }
      setGoals((prev) => [...prev, ...newGoals]);
    } else if (type === "cone") {
      const newCones: Cone[] = [];
      for (let i = 0; i < count; i++) {
        newCones.push({
          id: generateId(),
          x: 50 + cones.length * 40 + i * 10,
          y: 100 + cones.length * 20 + i * 5,
          color: color || "orange",
        });
      }
      setCones((prev) => [...prev, ...newCones]);
    }
  };

  // ===== Add Team =====
  const addTeam = (name: string, color: string) => {
    setTeams((prev) => [...prev, { id: generateId(), name, color }]);
  };

  // ===== Save Step =====
  const handleSaveStep = () => {
    setSavedSteps((prev) => [
      ...prev,
      {
        players: players.map((p) => ({ ...p })),
        balls: balls.map((b) => ({ ...b })),
        goals: goals.map((g) => ({ ...g })),
        cones: cones.map((c) => ({ ...c })),
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
        setCones(
          current.cones.map((c, i) => {
            const target = next.cones[i];
            return {
              ...c,
              x: c.x + (target.x - c.x) * t,
              y: c.y + (target.y - c.y) * t,
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
        colors={colors}
        teams={teams}
        onAddPlayers={(count, color, teamId) =>
          addEntity("player", count, color, teamId)
        }
        onAddBalls={(count, color) => addEntity("ball", count, color)}
        onAddGoals={(count, color) => addEntity("goal", count, color)}
        onAddCones={(count, color) => addEntity("cone", count, color)}
        onSaveStep={handleSaveStep}
        onPlay={handlePlay}
        playing={playing}
        stepsCount={savedSteps.length}
      />
      <FormationSelector
        formations={formations}
        teams={teams}
        pitchWidth={700} // or dynamic
        pitchHeight={900} // or dynamic
        currentPlayersCount={players.length}
        onAddFormation={(newPlayers) =>
          setPlayers((prev) => [...prev, ...newPlayers])
        }
      />

      <Pitch
        width={pitchWidth}
        height={pitchHeight}
        players={players}
        balls={balls}
        goals={goals}
        cones={cones}
        teams={teams}
        dragRef={dragRef}
        setPlayers={setPlayers}
        setBalls={setBalls}
        setGoals={setGoals}
        setCones={setCones}
      />
    </div>
  );
};
