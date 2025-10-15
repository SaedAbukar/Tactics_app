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
  ItemsState,
} from "../../types/types";
import { Pitch } from "../../components/pitch/Pitch";
import { Controls } from "../../components/controls/Controls";
import { FormationSelector } from "../../components/formation_selector/FormationSelector";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/Auth/AuthContext";
import { ApiSessionSelector } from "../../components/session/ApiSessionSelector";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { formations } from "../../components/formation_selector/formation";

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

export const ApiTacticalEditor: React.FC = () => {
  const { t } = useTranslation("tacticalEditor");
  const { user } = useAuth();
  const { request } = useFetchWithAuth();

  // ------------------------------
  // Pitch and animation states
  // ------------------------------
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
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const dragRef = useRef<any>(null);
  const animRef = useRef<number | null>(null);
  const stepIndexRef = useRef(0);
  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);

  const pitchWidth = 700;
  const pitchHeight = 900;

  // ------------------------------
  // View type: sessions / practices / game tactics
  // ------------------------------
  const [viewType, setViewType] = useState<
    "sessions" | "practices" | "game tactics"
  >("sessions");

  // ------------------------------
  // Items states: personal / userShared / groupShared
  // ------------------------------
  const [sessionsState, setSessionsState] = useState<ItemsState<Session>>({
    personal: [],
    userShared: [],
    groupShared: [],
  });
  const [practicesState, setPracticesState] = useState<ItemsState<Practice>>({
    personal: [],
    userShared: [],
    groupShared: [],
  });
  const [tacticsState, setTacticsState] = useState<ItemsState<GameTactic>>({
    personal: [],
    userShared: [],
    groupShared: [],
  });

  // ------------------------------
  // Fetch user-related data
  // ------------------------------
  const fetchUserData = async () => {
    if (!user) return;

    try {
      const [sessionsData, practicesData, tacticsData] = await Promise.all([
        request("/sessions"),
        request("/practices"),
        request("/game-tactics"),
      ]);

      setSessionsState({
        personal: sessionsData.personalItems || [],
        userShared: sessionsData.userSharedItems || [],
        groupShared: sessionsData.groupSharedItems || [],
      });

      setPracticesState({
        personal: practicesData.personalItems || [],
        userShared: practicesData.userSharedItems || [],
        groupShared: practicesData.groupSharedItems || [],
      });

      setTacticsState({
        personal: tacticsData.personalItems || [],
        userShared: tacticsData.userSharedItems || [],
        groupShared: tacticsData.groupSharedItems || [],
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Optional logging
  useEffect(() => {
    console.log("Updated states:", sessionsState, practicesState, tacticsState);
  }, [sessionsState, practicesState, tacticsState]);

  // ------------------------------
  // Generic Add Entity to pitch
  // ------------------------------
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
          teamName: team?.name,
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

  // ------------------------------
  // Pitch / Step Handlers
  // ------------------------------
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
    // Build a fully safe StepRequest-like object
    const newStep: Step = {
      players: players.map((p) => ({ ...p })) || [],
      balls: balls.map((b) => ({ ...b })) || [],
      goals: goals.map((g) => ({ ...g })) || [],
      cones: cones.map((c) => ({ ...c })) || [],
      teams: teams.map((t) => ({ ...t })) || [],
      formations:
        formations.map((f) => ({ ...f, positions: f.positions || [] })) || [],
    };

    setSavedSteps((prev) => {
      const updatedSteps =
        currentStepIndex !== null
          ? prev.map((s, i) => (i === currentStepIndex ? newStep : s))
          : [...prev, newStep];

      // Update the currently selected session if any
      if (selectedSession) {
        const safeSession: Session = {
          ...selectedSession,
          steps: updatedSteps,
          name: selectedSession.name || "Untitled Session",
          description: selectedSession.description || "No description",
        };

        setSelectedSession(safeSession);

        // Also update in sessionsState (all categories)
        setSessionsState((prevSessions) => ({
          personal: prevSessions.personal.map((s) =>
            s.id === safeSession.id ? safeSession : s
          ),
          userShared: prevSessions.userShared.map((s) =>
            s.id === safeSession.id ? safeSession : s
          ),
          groupShared: prevSessions.groupShared.map((s) =>
            s.id === safeSession.id ? safeSession : s
          ),
        }));
      }

      return updatedSteps;
    });

    // Reset current step selection
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
    ) =>
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

  // ------------------------------
  // CRUD: Add / Update / Delete
  // ------------------------------

  type Entity = Session | Practice | GameTactic;

  type Category = "personal" | "userShared" | "groupShared";

  function getItemsState<T extends Entity>(): [
    ItemsState<T>,
    React.Dispatch<React.SetStateAction<ItemsState<T>>>
  ] {
    if (viewType === "sessions")
      return [
        sessionsState as ItemsState<T>,
        setSessionsState as React.Dispatch<React.SetStateAction<ItemsState<T>>>,
      ];
    if (viewType === "practices")
      return [
        practicesState as ItemsState<T>,
        setPracticesState as React.Dispatch<
          React.SetStateAction<ItemsState<T>>
        >,
      ];
    return [
      tacticsState as ItemsState<T>,
      setTacticsState as React.Dispatch<React.SetStateAction<ItemsState<T>>>,
    ];
  }

  // ------------------------------
  // Utility: ensure all required fields are populated
  // ------------------------------

  const buildSafeStep = (step: Step): Step => ({
    players: step.players ?? [],
    balls: step.balls ?? [],
    goals: step.goals ?? [],
    cones: step.cones ?? [],
    teams: step.teams ?? [],
    formations: step.formations ?? [],
  });

  const buildSafeSession = (session: Session): Session => ({
    id: session.id, // optional for new session
    name: session.name || "Untitled Session",
    description: session.description || "No description",
    steps: (session.steps ?? []).map(buildSafeStep),
  });

  const handleAddEntity = async (entity: Entity) => {
    try {
      let url = "";
      let payload: any;

      if (viewType === "sessions") {
        url = "/sessions";
        payload = buildSafeSession(entity as Session);
      } else if (viewType === "practices") {
        url = "/practices";
        payload = {
          name: entity.name || "Untitled Practice",
          description: entity.description || "No description",
          isPremade: (entity as Practice).isPremade ?? false,
          sessions: (entity as Practice).sessions.map(buildSafeSession),
        };
      } else {
        url = "/game-tactics";
        payload = {
          name: entity.name || "Untitled Tactic",
          description: entity.description || "No description",
          isPremade: (entity as GameTactic).isPremade ?? false,
          sessions: (entity as GameTactic).sessions.map(buildSafeSession),
        };
      }

      const saved = await request<Entity>(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const [, setState] = getItemsState<Entity>();
      setState((prev) => ({
        ...prev,
        personal: [...prev.personal, saved],
      }));
    } catch (err) {
      console.error("Failed to add entity:", err);
    }
  };

  const handleUpdateEntity = async (
    updated: Entity,
    category: Category = "personal"
  ) => {
    try {
      let url = "";
      let payload: any;

      if (viewType === "sessions") {
        url = `/sessions/${updated.id}`;
        payload = buildSafeSession(updated as Session);
      } else if (viewType === "practices") {
        url = `/practices/${updated.id}`;
        payload = {
          name: updated.name || "Untitled Practice",
          description: updated.description || "No description",
          isPremade: (updated as Practice).isPremade ?? false,
          sessions: (updated as Practice).sessions.map(buildSafeSession),
        };
      } else {
        url = `/game-tactics/${updated.id}`;
        payload = {
          name: updated.name || "Untitled Tactic",
          description: updated.description || "No description",
          isPremade: (updated as GameTactic).isPremade ?? false,
          sessions: (updated as GameTactic).sessions.map(buildSafeSession),
        };
      }

      const saved = await request<Entity>(url, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const [, setState] = getItemsState<Entity>();
      setState((prev) => ({
        ...prev,
        [category]: prev[category].map((item) =>
          item.id === saved.id ? saved : item
        ),
      }));
    } catch (err) {
      console.error("Failed to update entity:", err);
    }
  };

  const handleDeleteEntity = async (
    entityId: number,
    category: Category = "personal"
  ) => {
    try {
      let url = "";
      if (viewType === "sessions") url = `/sessions/${entityId}`;
      else if (viewType === "practices") url = `/practices/${entityId}`;
      else url = `/game-tactics/${entityId}`;

      await request(url, { method: "DELETE" });

      const [, setState] = getItemsState<Entity>();
      setState((prev) => ({
        ...prev,
        [category]: prev[category].filter((item) => item.id !== entityId),
      }));
    } catch (err) {
      console.error("Failed to delete entity:", err);
    }
  };

  const handleAddSessionToEntity = async (
    type: "practice" | "tactic",
    entityId: number,
    session: Session
  ) => {
    try {
      const url =
        type === "practice"
          ? `/practices/${entityId}/sessions`
          : `/game-tactics/${entityId}/sessions`;

      const updatedEntity = await request<Practice | GameTactic>(url, {
        method: "POST",
        body: JSON.stringify({ sessionId: session.id }),
      });

      if (type === "practice") {
        setPracticesState((prev) => ({
          ...prev,
          personal: prev.personal.map((p) =>
            p.id === entityId ? updatedEntity : p
          ),
        }));
      } else {
        setTacticsState((prev) => ({
          ...prev,
          personal: prev.personal.map((t) =>
            t.id === entityId ? updatedEntity : t
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to add session to entity:", err);
    }
  };

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="tactical-container">
      <div className="tactical-left">
        <ApiSessionSelector
          viewType={viewType}
          setViewType={setViewType}
          sessions={sessionsState}
          practices={practicesState}
          gameTactics={tacticsState}
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
