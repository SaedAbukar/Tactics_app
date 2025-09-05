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
import { mockUsers } from "../../mock/users";
import { useAuth } from "../../context/AuthContext";
import { sessions as mockSessions } from "../../components/session/mocks/SessionMock";
import { practices as mockPractices } from "../../components/session/mocks/PracticeMocks";
import { gameTactics as mockTactics } from "../../components/session/mocks/TacticsMocks";

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
type Entity = Session | Practice | GameTactic;

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

  // ===== Load user data or mock data =====
  useEffect(() => {
    if (useMockData) {
      setSessionsState(mockSessions);
      setPractices(mockPractices);
      setTactics(mockTactics);
      return;
    }

    if (user) {
      setSessionsState(
        user.sessionIds
          ?.map((id: number) => mockSessions.find((s) => s.id === id))
          .filter(Boolean) as Session[]
      );
      setPractices(
        user.practiceIds
          ?.map((id: number) => mockPractices.find((p) => p.id === id))
          .filter(Boolean) as Practice[]
      );
      setTactics(
        user.tacticIds
          ?.map((id: number) => mockTactics.find((t) => t.id === id))
          .filter(Boolean) as GameTactic[]
      );
    }
  }, [user, useMockData]);

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

  // ===== Pitch / Step Handlers =====
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

  // ===== CRUD for sessions/practices/tactics (user-aware) =====
  // ===== Add Entity =====
  // ===== Add Entity =====
  const handleAddEntity = (entity: Session | Practice | GameTactic) => {
    if (!user) return;

    if (viewType === "sessions") {
      const newSession: Session = {
        ...(entity as Session),
        steps:
          savedSteps.length > 0
            ? [...savedSteps]
            : [
                {
                  players: players.map((p) => ({ ...p })),
                  balls: balls.map((b) => ({ ...b })),
                  goals: goals.map((g) => ({ ...g })),
                  cones: cones.map((c) => ({ ...c })),
                  teams: teams.map((t) => ({ ...t })),
                },
              ],
      };

      setSessionsState((prev) => [...prev, newSession]);

      const u = mockUsers.find((u) => u.id === user.id);
      if (u && !u.sessionIds.includes(newSession.id)) {
        u.sessionIds.push(newSession.id as number);
      }
      console.log("➕ [SESSION ADDED]", newSession);
      console.log("👤 User Sessions:", u?.sessionIds);
    } else if (viewType === "practices") {
      setPractices((prev) => [...prev, entity as Practice]);

      const u = mockUsers.find((u) => u.id === user.id);
      if (u && !u.practiceIds.includes(entity.id as number)) {
        u.practiceIds.push(entity.id as number);
      }
      console.log("➕ [PRACTICE ADDED]", entity);
      console.log("👤 User Practices:", u?.practiceIds);
    } else {
      setTactics((prev) => [...prev, entity as GameTactic]);

      const u = mockUsers.find((u) => u.id === user.id);
      if (u && !u.tacticIds.includes(entity.id as number)) {
        u.tacticIds.push(entity.id as number);
      }
      console.log("➕ [TACTIC ADDED]", entity);
      console.log("👤 User Tactics:", u?.tacticIds);
    }
  };

  // ===== Update Entity =====
  const handleUpdateEntity = (updated: Session | Practice | GameTactic) => {
    if (!user) return;

    const stepIndex =
      currentStepIndex ?? (savedSteps.length ? savedSteps.length - 1 : 0);

    if (viewType === "sessions") {
      const existing = sessionsState.find((s) => s.id === updated.id);
      if (!existing) return;

      const newSteps = [...existing.steps];

      // Get the latest saved step from savedSteps
      const latestStep = savedSteps[stepIndex];
      if (!latestStep) {
        alert("⚠️ No step selected to update. Please save a step first.");
        return;
      }

      // Replace the step with the latest saved version
      newSteps[stepIndex] = latestStep;

      const updatedSession: Session = {
        ...existing,
        name: updated.name,
        description: updated.description,
        steps: newSteps,
      };

      // Update session state immutably
      setSessionsState((prev) =>
        prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
      );

      // Update mock user sessions
      const u = mockUsers.find((u) => u.id === user.id);
      if (u && !u.sessionIds.includes(updatedSession.id)) {
        u.sessionIds.push(updatedSession.id as number);
      }

      console.log("✏️ [SESSION UPDATED]", updatedSession);
      console.log("👤 User Sessions:", u?.sessionIds);
    } else if (viewType === "practices") {
      setPractices((prev) =>
        prev.map((p) => (p.id === updated.id ? (updated as Practice) : p))
      );

      const u = mockUsers.find((u) => u.id === user.id);
      if (u && !u.practiceIds.includes(updated.id as number)) {
        u.practiceIds.push(updated.id as number);
      }

      console.log("✏️ [PRACTICE UPDATED]", updated);
      console.log("👤 User Practices:", u?.practiceIds);
    } else {
      setTactics((prev) =>
        prev.map((t) => (t.id === updated.id ? (updated as GameTactic) : t))
      );

      const u = mockUsers.find((u) => u.id === user.id);
      if (u && !u.tacticIds.includes(updated.id as number)) {
        u.tacticIds.push(updated.id as number);
      }

      console.log("✏️ [TACTIC UPDATED]", updated);
      console.log("👤 User Tactics:", u?.tacticIds);
    }
  };

  // ===== Delete Entity =====
  const handleDeleteEntity = (id: number) => {
    if (!user) return;

    if (viewType === "sessions") {
      setSessionsState((prev) => prev.filter((s) => s.id !== id));

      const u = mockUsers.find((u) => u.id === user.id);
      if (u) u.sessionIds = u.sessionIds.filter((sid) => sid !== id);

      console.log("🗑 [SESSION DELETED]", id);
      console.log("👤 User Sessions:", u?.sessionIds);
    } else if (viewType === "practices") {
      setPractices((prev) => prev.filter((p) => p.id !== id));

      const u = mockUsers.find((u) => u.id === user.id);
      if (u) u.practiceIds = u.practiceIds.filter((pid) => pid !== id);

      console.log("🗑 [PRACTICE DELETED]", id);
      console.log("👤 User Practices:", u?.practiceIds);
    } else {
      setTactics((prev) => prev.filter((t) => t.id !== id));

      const u = mockUsers.find((u) => u.id === user.id);
      if (u) u.tacticIds = u.tacticIds.filter((tid) => tid !== id);

      console.log("🗑 [TACTIC DELETED]", id);
      console.log("👤 User Tactics:", u?.tacticIds);
    }
  };

  // ===== Add Session to Practice or Tactic =====
  const handleAddSessionToEntity = (
    type: "practice" | "tactic", // 👈 match SessionSelector
    entityId: number,
    sessionId: number
  ) => {
    if (!user) return;

    if (type === "practice") {
      setPractices((prev) =>
        prev.map((p) =>
          p.id === entityId
            ? { ...p, sessionIds: [...(p.sessionIds || []), sessionId] }
            : p
        )
      );

      const u = mockUsers.find((u) => u.id === user.id);
      if (u && !u.practiceIds.includes(entityId)) {
        u.practiceIds.push(entityId);
      }

      console.log(`➕ [SESSION ${sessionId} ADDED TO PRACTICE ${entityId}]`);
      console.log("👤 User Practices:", u?.practiceIds);
    } else if (type === "tactic") {
      setTactics((prev) =>
        prev.map((t) =>
          t.id === entityId
            ? { ...t, sessionIds: [...(t.sessionIds || []), sessionId] }
            : t
        )
      );

      const u = mockUsers.find((u) => u.id === user.id);
      if (u && !u.tacticIds.includes(entityId)) {
        u.tacticIds.push(entityId);
      }

      console.log(`➕ [SESSION ${sessionId} ADDED TO TACTIC ${entityId}]`);
      console.log("👤 User Tactics:", u?.tacticIds);
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
