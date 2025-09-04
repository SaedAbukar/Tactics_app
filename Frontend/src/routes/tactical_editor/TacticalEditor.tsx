import React, { useState, useRef } from "react";
import "./TacticalEditor.css";
import type {
  Player,
  Ball,
  Goal,
  Cone,
  Step,
  Session,
  Practice,
  GameTactic,
  EntityType,
  Team,
} from "../../types/types";
import { Pitch } from "../../components/pitch/Pitch";
import { Controls } from "../../components/controls/Controls";
import { FormationSelector } from "../../components/formation_selector/FormationSelector";
import { formations } from "../../components/formation_selector/formation";
import { SessionSelector } from "../../components/session/SessionSelector";
import { sessions as initialSessions } from "../../components/session/mocks/SessionMock";
import { practices as initialPractices } from "../../components/session/mocks/PracticeMocks";
import { gameTactics as initialTactics } from "../../components/session/mocks/TacticsMocks";
import { useTranslation } from "react-i18next";

let lastTime = 0;
let counter = 0;
function generateId(): number {
  const now = Date.now();
  if (now === lastTime) counter++;
  else counter = 0;
  lastTime = now;
  return now * 1000 + counter;
}

let playerNumber = 1;

export const TacticalEditor: React.FC = () => {
  const { t } = useTranslation("tacticalEditor");

  const [players, setPlayers] = useState<Player[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [cones, setCones] = useState<Cone[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [savedSteps, setSavedSteps] = useState<Step[]>([]);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  const [viewType, setViewType] = useState<
    "sessions" | "practices" | "gameTactics"
  >("sessions");
  const [sessionsState, setSessionsState] =
    useState<Session[]>(initialSessions);
  const [practices, setPractices] = useState<Practice[]>(initialPractices);
  const [tactics, setTactics] = useState<GameTactic[]>(initialTactics);

  const dragRef = useRef<any>(null);
  const animRef = useRef<number | null>(null);
  const stepIndexRef = useRef(0);
  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);

  const pitchWidth = 700;
  const pitchHeight = 900;

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
          teamId,
        });
      }
      setPlayers((prev) => [...prev, ...newPlayers]);
    } else if (type === "ball") {
      setBalls((prev) => [
        ...prev,
        ...Array.from({ length: count }, (_, i) => ({
          id: generateId(),
          x: 100 + prev.length * 50 + i * 20,
          y: 200,
          color: color || "white",
        })),
      ]);
    } else if (type === "goal") {
      setGoals((prev) => [
        ...prev,
        ...Array.from({ length: count }, (_, i) => ({
          id: generateId(),
          x: 50 + prev.length * 60 + i * 10,
          y: 350,
          width: 70,
          depth: 30,
          color: color || "white",
        })),
      ]);
    } else if (type === "cone") {
      setCones((prev) => [
        ...prev,
        ...Array.from({ length: count }, (_, i) => ({
          id: generateId(),
          x: 50 + prev.length * 40 + i * 10,
          y: 100 + prev.length * 20 + i * 5,
          color: color || "orange",
        })),
      ]);
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
      setSavedSteps((prev) =>
        prev.map((s, i) => (i === currentStepIndex ? newStep : s))
      );
      alert(t("stepUpdated", { index: currentStepIndex + 1 }));
    } else {
      setSavedSteps((prev) => [...prev, newStep]);
      alert(t("stepAdded", { count: savedSteps.length + 1 }));
    }
    setCurrentStepIndex(null);
  };

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
      from.map((item, i) => ({
        ...item,
        x: item.x + (to[i].x - item.x) * t,
        y: item.y + (to[i].y - item.y) * t,
      }));
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

  // ===== CRUD for sessions/practices/tactics =====
  const handleAddEntity = (entity: Session | Practice | GameTactic) => {
    if (viewType === "sessions")
      setSessionsState((prev) => [...prev, entity as Session]);
    else if (viewType === "practices")
      setPractices((prev) => [...prev, entity as Practice]);
    else setTactics((prev) => [...prev, entity as GameTactic]);
  };

  const handleUpdateEntity = (updated: Session | Practice | GameTactic) => {
    if (viewType === "sessions")
      setSessionsState((prev) =>
        prev.map((s) => (s.id === updated.id ? (updated as Session) : s))
      );
    else if (viewType === "practices")
      setPractices((prev) =>
        prev.map((p) => (p.id === updated.id ? (updated as Practice) : p))
      );
    else
      setTactics((prev) =>
        prev.map((t) => (t.id === updated.id ? (updated as GameTactic) : t))
      );
  };

  const handleDeleteEntity = (id: number) => {
    if (viewType === "sessions")
      setSessionsState((prev) => prev.filter((s) => s.id !== id));
    else if (viewType === "practices")
      setPractices((prev) => prev.filter((p) => p.id !== id));
    else setTactics((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddSessionToEntity = (
    type: "practice" | "tactic",
    entityId: number,
    sessionId: number
  ) => {
    if (type === "practice") {
      setPractices((prev) =>
        prev.map((p) => {
          if (p.id === entityId) {
            if (p.sessionIds.includes(sessionId))
              alert(t("sessionAlreadyAdded"));
            else p.sessionIds.push(sessionId);
          }
          return p;
        })
      );
    } else {
      setTactics((prev) =>
        prev.map((te) => {
          if (te.id === entityId) {
            if (te.sessionIds.includes(sessionId))
              alert(t("sessionAlreadyAdded"));
            else te.sessionIds.push(sessionId);
          }
          return te;
        })
      );
    }
  };

  return (
    <div className="tactical-container">
      <div className="tactical-left">
        <SessionSelector
          viewType={viewType}
          setViewType={setViewType}
          sessions={sessionsState}
          practices={practices}
          gameTactics={tactics}
          onSelectSession={(steps: Step[]) => {
            if (!steps.length) return;
            const firstStep = steps[0];
            setPlayers(firstStep.players.map((p) => ({ ...p })));
            setBalls(firstStep.balls.map((b) => ({ ...b })));
            setGoals(firstStep.goals.map((g) => ({ ...g })));
            setCones(firstStep.cones.map((c) => ({ ...c })));
            setSavedSteps(steps);
          }}
          onAddEntity={handleAddEntity}
          onUpdateEntity={handleUpdateEntity}
          onDeleteEntity={handleDeleteEntity}
          onAddSessionToEntity={handleAddSessionToEntity}
        />
      </div>
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
              {t("step", { index: idx + 1 })}
            </button>
          ))}
        </div>
      </div>
      <div className="tactical-right">
        <Controls
          teams={teams}
          onAddPlayers={(count, color, teamId) =>
            addEntity("player", count, color, teamId)
          }
          onAddBalls={(count) => addEntity("ball", count)}
          onAddGoals={(count) => addEntity("goal", count)}
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
