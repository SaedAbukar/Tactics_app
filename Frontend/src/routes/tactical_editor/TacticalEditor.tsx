import React, { useState, useRef, useEffect } from "react";
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
import { SessionSelector } from "../../components/session/SessionSelector";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

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
  const { user } = useAuth();

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
    "sessions" | "practices" | "game tactics"
  >("sessions");
  const [sessionsState, setSessionsState] = useState<Session[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [tactics, setTactics] = useState<GameTactic[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  const dragRef = useRef<any>(null);
  const animRef = useRef<number | null>(null);
  const stepIndexRef = useRef(0);
  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);

  const pitchWidth = 700;
  const pitchHeight = 900;

  // Load user data or mock data
  useEffect(() => {
    if (user) {
      setSessionsState(user.sessions ? [...user.sessions] : []);
      setPractices(user.practices ? [...user.practices] : []);
      setTactics(user.tactics ? [...user.tactics] : []);
      console.log("user", user);
      console.log("user.sessions", user?.sessions);
      console.log("user.practices", user?.practices);
      console.log("user.tactics", user?.tactics);
    }
  }, [user, useMockData]);

  // Generic Add Entity
  const addEntity = (
    type: EntityType,
    count: number = 1,
    color?: string,
    team?: Team
  ) => {
    if (type === "player") {
      const newPlayers: Player[] = [];
      for (let i = 0; i < count; i++) {
        newPlayers.push({
          id: generateId(),
          number: playerNumber++,
          x: 50 + players.length * 50 + i * 20,
          y: 100 + players.length * 30 + i * 10,
          color: team?.color || color || "white",
          team,
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

  // Pitch / Step Handlers
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
    } else {
      setSavedSteps((prev) => [...prev, newStep]);
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

    const interpolate = <T extends { x: number; y: number }>(
      from: T[],
      to: T[]
    ): T[] =>
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

  // CRUD for sessions/practices/tactics
  const handleAddEntity = (entity: Session | Practice | GameTactic) => {
    if (!user) return;

    if (viewType === "sessions") {
      const newSession: Session = {
        ...entity,
        steps: savedSteps.length > 0 ? [...savedSteps] : [],
      };
      setSessionsState((prev) => [...prev, newSession]);
      user.sessions = [...user.sessions, newSession];
    } else if (viewType === "practices") {
      setPractices((prev) => [...prev, entity as Practice]);
      user.practices = [...user.practices, entity as Practice];
    } else {
      setTactics((prev) => [...prev, entity as GameTactic]);
      user.tactics = [...user.tactics, entity as GameTactic];
    }
  };

  const handleUpdateEntity = (updated: Session | Practice | GameTactic) => {
    if (!user) return;

    if (viewType === "sessions") {
      setSessionsState((prev) =>
        prev.map((s) => (s.id === updated.id ? (updated as Session) : s))
      );
      user.sessions = user.sessions.map((s: Session) =>
        s.id === updated.id ? (updated as Session) : s
      );
    } else if (viewType === "practices") {
      setPractices((prev) =>
        prev.map((p) => (p.id === updated.id ? (updated as Practice) : p))
      );
      user.practices = user.practices.map((p: Practice) =>
        p.id === updated.id ? (updated as Practice) : p
      );
    } else {
      setTactics((prev) =>
        prev.map((t) => (t.id === updated.id ? (updated as GameTactic) : t))
      );
      user.tactics = user.tactics.map((t: GameTactic) =>
        t.id === updated.id ? (updated as GameTactic) : t
      );
    }
  };

  const handleDeleteEntity = (id: number) => {
    if (!user) return;

    if (viewType === "sessions") {
      setSessionsState((prev) => prev.filter((s) => s.id !== id));
      user.sessions = user.sessions.filter((s: Session) => s.id !== id);
    } else if (viewType === "practices") {
      setPractices((prev) => prev.filter((p: Practice) => p.id !== id));
      user.practices = user.practices.filter((p: Practice) => p.id !== id);
    } else {
      setTactics((prev) => prev.filter((t) => t.id !== id));
      user.tactics = user.tactics.filter((t: GameTactic) => t.id !== id);
    }
  };

  const handleAddSessionToEntity = (
    type: "practice" | "tactic",
    entityId: number,
    session: Session
  ) => {
    if (!user) return;

    if (type === "practice") {
      setPractices((prev) =>
        prev.map((p) =>
          p.id === entityId ? { ...p, sessions: [...p.sessions, session] } : p
        )
      );
      user.practices = user.practices.map((p: Practice) =>
        p.id === entityId ? { ...p, sessions: [...p.sessions, session] } : p
      );
    } else {
      setTactics((prev) =>
        prev.map((t) =>
          t.id === entityId ? { ...t, sessions: [...t.sessions, session] } : t
        )
      );
      user.tactics = user.tactics.map((t: GameTactic) =>
        t.id === entityId ? { ...t, sessions: [...t.sessions, session] } : t
      );
    }
  };

  return (
    <div className="tactical-container">
      <div className="tactical-left">
        <button onClick={() => setUseMockData((prev) => !prev)}>
          {useMockData ? t("useUserData") : t("useMockData")}
        </button>

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
          onAddPlayers={(count, color, teamId) => {
            const team = teams.find((t) => t.id === teamId);
            addEntity("player", count, color, team);
          }}
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
