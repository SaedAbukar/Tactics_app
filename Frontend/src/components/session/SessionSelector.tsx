import React, { useState } from "react";
import type { Step, Session, Practice, GameTactic } from "../../types/types";
import "./SessionSelector.css";

type ViewType = "sessions" | "practices" | "gameTactics";

interface SessionSelectorProps {
  viewType: ViewType;
  setViewType: (v: ViewType) => void;
  sessions: Session[];
  practices: Practice[];
  gameTactics: GameTactic[];
  onSelectSession: (steps: Step[]) => void;
  onAddEntity: (entity: Session | Practice | GameTactic) => void;
  onUpdateEntity: (entity: Session | Practice | GameTactic) => void;
  onDeleteEntity: (id: number) => void;
  onAddSessionToEntity: (
    type: "practice" | "tactic",
    entityId: number,
    sessionId: number
  ) => void;
}

export const SessionSelector: React.FC<SessionSelectorProps> = ({
  viewType,
  setViewType,
  sessions,
  practices,
  gameTactics,
  onSelectSession,
  onAddEntity,
  onUpdateEntity,
  onDeleteEntity,
  onAddSessionToEntity,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleSelectSession = (session: Session) => {
    setSelectedId(session.id);
    onSelectSession(session.steps);
  };

  const handleAdd = () => {
    if (!newName.trim()) return alert("Name is required");
    const id = Date.now();
    if (viewType === "sessions") {
      onAddEntity({
        id,
        name: newName,
        description: newDescription,
        steps: [],
      } as Session);
    } else if (viewType === "practices") {
      onAddEntity({
        id,
        name: newName,
        description: newDescription,
        sessionIds: [],
      } as Practice);
    } else {
      onAddEntity({
        id,
        name: newName,
        description: newDescription,
        sessionIds: [],
      } as GameTactic);
    }
    setNewName("");
    setNewDescription("");
  };

  const handleUpdate = (id: number) => {
    setUpdatingId(id);
    let entity =
      viewType === "sessions"
        ? sessions.find((s) => s.id === id)
        : viewType === "practices"
        ? practices.find((p) => p.id === id)
        : gameTactics.find((t) => t.id === id);
    if (!entity) return;
    setNewName(entity.name);
    setNewDescription(entity.description);
  };

  const handleSaveUpdate = () => {
    if (updatingId === null) return;
    const updatedEntity =
      viewType === "sessions"
        ? ({
            ...sessions.find((s) => s.id === updatingId),
            name: newName,
            description: newDescription,
          } as Session)
        : viewType === "practices"
        ? ({
            ...practices.find((p) => p.id === updatingId),
            name: newName,
            description: newDescription,
          } as Practice)
        : ({
            ...gameTactics.find((t) => t.id === updatingId),
            name: newName,
            description: newDescription,
          } as GameTactic);
    onUpdateEntity(updatedEntity);
    setNewName("");
    setNewDescription("");
    setUpdatingId(null);
  };

  const handleDelete = (id: number) => onDeleteEntity(id);

  return (
    <div className="session-selector-container">
      <h3>Manage {viewType}</h3>
      <select
        value={viewType}
        onChange={(e) => setViewType(e.target.value as ViewType)}
      >
        <option value="sessions">Sessions</option>
        <option value="practices">Practices</option>
        <option value="gameTactics">Game Tactics</option>
      </select>

      <div className="new-session">
        <input
          type="text"
          placeholder={`${viewType.slice(0, -1)} name`}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        {updatingId === null ? (
          <button className="light-button full-width" onClick={handleAdd}>
            Add
          </button>
        ) : (
          <button
            className="light-button full-width"
            onClick={handleSaveUpdate}
          >
            Save Update
          </button>
        )}
      </div>

      <ul className="session-list">
        {(viewType === "sessions"
          ? sessions
          : viewType === "practices"
          ? practices
          : gameTactics
        ).map((entity) => (
          <li
            key={entity.id}
            className={selectedId === entity.id ? "selected" : ""}
          >
            <strong>{entity.name}</strong>
            <textarea
              value={entity.description}
              onChange={(e) =>
                onUpdateEntity({ ...entity, description: e.target.value })
              }
            />

            {/* === Select Sessions === */}
            {viewType === "sessions" && (
              <button onClick={() => handleSelectSession(entity as Session)}>
                Select
              </button>
            )}

            {(viewType === "practices" || viewType === "gameTactics") && (
              <>
                {/* Current sessions buttons */}
                <div className="current-sessions">
                  {(entity as Practice | GameTactic).sessionIds.map((sid) => {
                    const session = sessions.find((s) => s.id === sid);
                    if (!session) return null;
                    return (
                      <button
                        key={sid}
                        onClick={() => handleSelectSession(session)}
                        className="light-button"
                      >
                        {session.name}
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown to add new session */}
                <select
                  onChange={(e) =>
                    onAddSessionToEntity(
                      viewType === "practices" ? "practice" : "tactic",
                      entity.id,
                      Number(e.target.value)
                    )
                  }
                >
                  <option value="">Add session...</option>
                  {sessions
                    .filter((s) => !(entity as any).sessionIds.includes(s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </>
            )}

            <div className="buttons">
              <button onClick={() => handleUpdate(entity.id)}>Update</button>
              <button onClick={() => handleDelete(entity.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
