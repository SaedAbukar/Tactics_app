import React, { useState, useRef, useEffect } from "react";
import "./TacticalEditor.css";
import type {
  Player,
  Ball,
  Goal,
  Cone,
  Step,
  DragItem,
  EntityType,
  Team,
  Session,
} from "../../types/types";
import { Pitch } from "../../components/pitch/Pitch";
import { Controls } from "../../components/controls/Controls";
import { FormationSelector } from "../../components/formation_selector/FormationSelector";
import { formations } from "../../components/formation_selector/formation";
import { SessionSelector } from "../../components/session/SessionSelector";
import { sessions } from "../../components/session/SessionMock";

// ID generator for numeric IDs
let lastTime = 0;
let counter = 0;
function generateId(): number {
  const now = Date.now();
  if (now === lastTime) counter++;
  else {
    lastTime = now;
    counter = 0;
  }
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
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [sessionsState, setSessionsState] = useState(sessions);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  const dragRef = useRef<DragItem | null>(null);
  const animRef = useRef<number | null>(null);
  const stepIndexRef = useRef(0);
  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);
  const pitchWidth = 700;
  const pitchHeight = 900;

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

  const addTeam = (name: string, color: string) =>
    setTeams((prev) => [...prev, { id: generateId(), name, color }]);

  const handleClearPitch = () => {
    setPlayers([]);
    setBalls([]);
    setGoals([]);
    setCones([]);
    setSavedSteps([]);
    setPlaying(false);
    setPaused(false);
    stepIndexRef.current = 0;
    startTimeRef.current = 0;
    elapsedBeforePauseRef.current = 0;
  };

  const handleSaveStep = () => {
    const newStep: Step = {
      players: players.map((p) => ({ ...p })),
      balls: balls.map((b) => ({ ...b })),
      goals: goals.map((g) => ({ ...g })),
      cones: cones.map((c) => ({ ...c })),
      teams: teams.map((t) => ({ ...t })),
    };

    if (currentStepIndex !== null) {
      // Modify existing step
      setSavedSteps((prev) =>
        prev.map((step, idx) => (idx === currentStepIndex ? newStep : step))
      );
      alert(`Step ${currentStepIndex + 1} updated`);
    } else {
      // Append new step
      setSavedSteps((prev) => [...prev, newStep]);
      alert(`Step added! Total steps: ${savedSteps.length + 1}`);
    }

    // Reset selection
    setCurrentStepIndex(null);
  };

  // ===== Animation =====
  const stepDuration = () => 1500 / speed;

  const animateStep = (timestamp: number) => {
    const currentIdx = stepIndexRef.current;
    const current = savedSteps[currentIdx];
    const next = savedSteps[currentIdx + 1] ?? current;

    if (!startTimeRef.current) startTimeRef.current = timestamp;

    const elapsed =
      timestamp - startTimeRef.current + elapsedBeforePauseRef.current;
    const t = Math.min(elapsed / stepDuration(), 1);

    const interpolate = (from: any[], to: any[]) =>
      from.map((item, i) => {
        const target = to[i];
        return {
          ...item,
          x: item.x + (target.x - item.x) * t,
          y: item.y + (target.y - item.y) * t,
        };
      });

    setPlayers(interpolate(current.players, next.players));
    setBalls(interpolate(current.balls, next.balls));
    setGoals(interpolate(current.goals, next.goals));
    setCones(interpolate(current.cones, next.cones));

    if (t < 1) animRef.current = requestAnimationFrame(animateStep);
    else if (currentIdx + 1 < savedSteps.length) {
      stepIndexRef.current++;
      startTimeRef.current = 0;
      elapsedBeforePauseRef.current = 0;
      animRef.current = requestAnimationFrame(animateStep);
    } else {
      setPlaying(false);
      stepIndexRef.current = 0;
      elapsedBeforePauseRef.current = 0;
    }
  };

  // ===== Controls Handlers =====
  const handlePlay = () => {
    if (!savedSteps.length) return;
    setPlaying(true);
    setPaused(false);
    stepIndexRef.current = 0;
    startTimeRef.current = 0;
    elapsedBeforePauseRef.current = 0;
    animRef.current = requestAnimationFrame(animateStep);
  };

  const handlePause = () => {
    if (!playing || paused) return;
    setPaused(true);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    elapsedBeforePauseRef.current += performance.now() - startTimeRef.current;
  };

  const handleContinue = () => {
    if (!playing || !paused) return;
    setPaused(false);
    startTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(animateStep);
  };

  const handleStop = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setPlaying(false);
    setPaused(false);
    stepIndexRef.current = 0;
    startTimeRef.current = 0;
    elapsedBeforePauseRef.current = 0;

    if (savedSteps.length > 0) {
      const first = savedSteps[0];
      setPlayers(first.players.map((p) => ({ ...p })));
      setBalls(first.balls.map((b) => ({ ...b })));
      setGoals(first.goals.map((g) => ({ ...g })));
      setCones(first.cones.map((c) => ({ ...c })));
    }
  };

  const handleAddSession = (session: Session) => {
    setSessionsState((prev) => [...prev, session]);
  };

  const handleUpdateSession = (updatedSession: Session) => {
    setSessionsState((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
  };

  const handleDeleteSession = (id: number) => {
    setSessionsState((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="tactical-container">
      <div className="tactical-left">
        {/* Left: Session Selector */}
        <SessionSelector
          sessions={sessions}
          onSelectSession={(steps) => {
            if (steps.length === 0) return;
            const firstStep = steps[0];
            setPlayers(firstStep.players.map((p: Player) => ({ ...p })));
            setBalls(firstStep.balls.map((b: Ball) => ({ ...b })));
            setGoals(firstStep.goals.map((g: Goal) => ({ ...g })));
            setCones(firstStep.cones.map((c: Cone) => ({ ...c })));
            setSavedSteps(steps);
          }}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
          onAddSession={handleAddSession}
        />
      </div>
      {/* Left: Pitch */}
      <div className="tactical-mid">
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
        <div className="step-list">
          {savedSteps.map((step, idx) => (
            <button
              key={idx}
              className={currentStepIndex === idx ? "selected-step" : ""}
              onClick={() => {
                setCurrentStepIndex(idx);
                setPlayers(step.players.map((p) => ({ ...p })));
                setBalls(step.balls.map((b) => ({ ...b })));
                setGoals(step.goals.map((g) => ({ ...g })));
                setCones(step.cones.map((c) => ({ ...c })));
              }}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Controls + Formation */}
      <div className="tactical-right">
        <Controls
          colors={colors}
          teams={teams}
          onAddPlayers={(count, color, teamId) =>
            addEntity("player", count, color, teamId)
          }
          onAddBalls={(count, color) => addEntity("ball", count, color)}
          onAddGoals={(count, color) => addEntity("goal", count, color)}
          onAddCones={(count, color) => addEntity("cone", count, color)}
          onAddTeam={addTeam}
          onSaveStep={handleSaveStep}
          onPlay={handlePlay}
          onPause={handlePause}
          onContinue={handleContinue}
          onStop={handleStop}
          onClearPitch={handleClearPitch}
          onSpeedChange={setSpeed}
          playing={playing}
          paused={paused}
          stepsCount={savedSteps.length}
          speed={speed}
        />

        <FormationSelector
          formations={formations}
          teams={teams}
          pitchWidth={pitchWidth}
          pitchHeight={pitchHeight}
          currentPlayersCount={players.length}
          onAddFormation={(newPlayers) =>
            setPlayers((prev) => [...prev, ...newPlayers])
          }
        />
      </div>
    </div>
  );
};
