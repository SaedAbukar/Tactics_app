import React, { useState } from "react";
import type { Step, Session, Practice, GameTactic } from "../../types/types";
import { useTranslation } from "react-i18next";
import "./SessionSelector.css";

type ViewType = "sessions" | "practices" | "game tactics";

interface SessionSelectorProps {
  viewType: ViewType;
  setViewType: (v: ViewType) => void;
  sessions: Session[];
  practices: Practice[];
  gameTactics: GameTactic[];
  onSelectSession: (steps: Step[], session: Session) => void;
  onAddEntity: (entity: Session | Practice | GameTactic) => void;
  onUpdateEntity: (entity: Session | Practice | GameTactic) => void;
  onDeleteEntity: (id: number, sessionId?: number) => void;
  onAddSessionToEntity: (
    type: "practice" | "tactic",
    entityId: number,
    session: Session
  ) => void;
}

export const ApiSessionSelector: React.FC<SessionSelectorProps> = ({
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
  const { t } = useTranslation("tacticalEditor");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Determine which entities to display
  const entities =
    viewType === "sessions"
      ? sessions
      : viewType === "practices"
      ? practices
      : gameTactics;

  // ✅ Runtime check: ensure it's always an array
  const safeEntities = Array.isArray(entities) ? entities : [];

  const handleSelectSession = (session: Session) => {
    setSelectedId(session.id);
    setNewName(session.name);
    setNewDescription(session.description);
    setUpdatingId(session.id);

    setViewType("sessions");
    onSelectSession(session.steps, session);
  };

  const handleAdd = () => {
    if (!newName.trim())
      return alert(t("sessionSelector.namePlaceholder", { viewType }));

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
        sessions: [],
      } as Practice);
    } else {
      onAddEntity({
        id,
        name: newName,
        description: newDescription,
        sessions: [],
      } as GameTactic);
    }

    setNewName("");
    setNewDescription("");
  };

  const handleUpdate = (id: number) => {
    setUpdatingId(id);
    const entity =
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

  const handleDelete = (id: number, sessionId?: number) => {
    onDeleteEntity(id, sessionId);
  };

  return (
    <div className="session-selector-container">
      <h3>{t("sessionSelector.manageViewType", { viewType })}</h3>

      <select
        value={viewType}
        onChange={(e) => setViewType(e.target.value as ViewType)}
      >
        <option value="sessions">
          {t("sessionSelector.manageViewType", { viewType: "sessions" })}
        </option>
        <option value="practices">
          {t("sessionSelector.manageViewType", { viewType: "practices" })}
        </option>
        <option value="game tactics">
          {t("sessionSelector.manageViewType", { viewType: "game tactics" })}
        </option>
      </select>

      <div className="new-session">
        <input
          type="text"
          placeholder={t("sessionSelector.namePlaceholder", { viewType })}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <textarea
          placeholder={t("sessionSelector.descriptionPlaceholder")}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        {updatingId === null ? (
          <button className="light-button full-width" onClick={handleAdd}>
            {t("sessionSelector.add")}
          </button>
        ) : (
          <button
            className="light-button full-width"
            onClick={handleSaveUpdate}
          >
            {t("sessionSelector.saveUpdate")}
          </button>
        )}
      </div>

      <ul className="session-list">
        {safeEntities.map((entity) => {
          // ✅ Nested sessions array runtime check
          const entitySessions = Array.isArray(
            (entity as Practice | GameTactic).sessions
          )
            ? (entity as Practice | GameTactic).sessions
            : [];

          return (
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

              {viewType === "sessions" && (
                <button onClick={() => handleSelectSession(entity as Session)}>
                  {t("sessionSelector.select")}
                </button>
              )}

              {(viewType === "practices" || viewType === "game tactics") && (
                <>
                  <div className="current-sessions">
                    {entitySessions.map((s) => (
                      <div key={s.id} className="session-item">
                        <button
                          onClick={() => handleSelectSession(s)}
                          className="light-button"
                        >
                          {s.name}
                        </button>
                        <button
                          className="delete-session"
                          onClick={() => handleDelete(entity.id, s.id)}
                        >
                          {t("sessionSelector.delete")}
                        </button>
                      </div>
                    ))}
                  </div>

                  <select
                    onChange={(e) => {
                      const sessionToAdd = sessions.find(
                        (s) => s.id === Number(e.target.value)
                      );
                      if (!sessionToAdd) return;
                      onAddSessionToEntity(
                        viewType === "practices" ? "practice" : "tactic",
                        entity.id,
                        sessionToAdd
                      );
                    }}
                  >
                    <option value="">
                      {t("sessionSelector.addSessionPlaceholder")}
                    </option>
                    {sessions
                      .filter(
                        (s) => !entitySessions.some((es) => es.id === s.id)
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </>
              )}

              {!(viewType === "practices" || viewType === "game tactics") && (
                <div className="buttons">
                  <button onClick={() => handleUpdate(entity.id)}>
                    {t("sessionSelector.update")}
                  </button>
                  <button onClick={() => handleDelete(entity.id)}>
                    {t("sessionSelector.delete")}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
