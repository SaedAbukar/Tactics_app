import React, { useState } from "react";
import type {
  Session,
  Practice,
  GameTactic,
  ItemsState,
  Step,
} from "../../types/types";

type ViewType = "sessions" | "practices" | "game tactics";
type Category = "personal" | "userShared" | "groupShared";

interface Props {
  viewType: ViewType;
  setViewType: (v: ViewType) => void;

  sessions: ItemsState<Session>;
  practices: ItemsState<Practice>;
  gameTactics: ItemsState<GameTactic>;

  // Updated: pass full Session instead of just steps
  onSelectSession: (session: Session) => void;
  onAddEntity: (entity: Session | Practice | GameTactic) => void;
  onUpdateEntity: (
    entity: Session | Practice | GameTactic,
    category?: Category
  ) => void;
  onDeleteEntity: (id: number, category?: Category) => void;
  onAddSessionToEntity: (
    type: "practice" | "tactic",
    entityId: number,
    session: Session
  ) => void;
}

export const ApiSessionSelector: React.FC<Props> = ({
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
  const [drafts, setDrafts] = useState<(Session | Practice | GameTactic)[]>([]);
  const [newDraftId, setNewDraftId] = useState<number | null>(null);

  const getState = () =>
    viewType === "sessions"
      ? sessions
      : viewType === "practices"
      ? practices
      : gameTactics;

  const handleEditClick = (item: Session | Practice | GameTactic) => {
    if (!drafts.some((d) => d.id === item.id)) setDrafts([...drafts, item]);
  };

  const handleDraftChange = (
    id: number,
    field: "name" | "description",
    value: string
  ) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleAttachSession = (draftId: number, session: Session) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id !== draftId) return d;
        if ("sessions" in d && Array.isArray(d.sessions)) {
          if (!d.sessions.some((s) => s.id === session.id)) {
            return { ...d, sessions: [...d.sessions, session] };
          }
        }
        return d;
      })
    );
  };

  const handleRemoveSession = (draftId: number, sessionId: number) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id !== draftId) return d;
        if ("sessions" in d && Array.isArray(d.sessions)) {
          return {
            ...d,
            sessions: d.sessions.filter((s) => s.id !== sessionId),
          };
        }
        return d;
      })
    );
  };

  const handleSaveDraft = (draft: Session | Practice | GameTactic) => {
    if (!draft.name.trim() || !draft.description.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    if (newDraftId === draft.id) {
      // New entity
      onAddEntity(draft);
      setNewDraftId(null);
    } else {
      // Existing entity
      onUpdateEntity(draft);
    }

    setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
  };

  const handleCancelDraft = (id: number) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    if (newDraftId === id) setNewDraftId(null);
  };

  const handleAddNew = () => {
    const id = Date.now();
    const newEntity: Session | Practice | GameTactic = {
      id,
      name: "",
      description: "",
      steps: viewType === "sessions" ? [] : undefined,
      sessions: viewType !== "sessions" ? [] : undefined,
    } as any;
    setDrafts([...drafts, newEntity]);
    setNewDraftId(id);
  };

  const renderItems = () => {
    const state = getState();

    return (
      <ul className="session-list">
        {(["personal", "userShared", "groupShared"] as Category[]).map(
          (category) => (
            <div key={category}>
              <h4>{category}</h4>
              {state[category].map((item) => {
                const draft = drafts.find((d) => d.id === item.id);
                return draft ? (
                  <li key={draft.id} className="session-list-item draft">
                    <input
                      type="text"
                      placeholder="Name"
                      value={draft.name}
                      onChange={(e) =>
                        handleDraftChange(draft.id, "name", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Description"
                      value={draft.description}
                      onChange={(e) =>
                        handleDraftChange(
                          draft.id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                    {viewType !== "sessions" && "sessions" in draft && (
                      <div className="attached-sessions">
                        <h5>Attached Sessions:</h5>
                        {draft.sessions?.map((s) => (
                          <div key={s.id}>
                            {s.name}{" "}
                            <button
                              onClick={() =>
                                handleRemoveSession(draft.id, s.id)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <select
                          onChange={(e) => {
                            const s = [
                              ...sessions.personal,
                              ...sessions.userShared,
                              ...sessions.groupShared,
                            ].find(
                              (sess) => sess.id === Number(e.target.value)
                            );
                            if (s) handleAttachSession(draft.id, s);
                            e.currentTarget.value = "";
                          }}
                        >
                          <option value="">Add session...</option>
                          {[
                            ...sessions.personal,
                            ...sessions.userShared,
                            ...sessions.groupShared,
                          ]
                            .filter(
                              (s) =>
                                !draft.sessions?.some((ds) => ds.id === s.id)
                            )
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                    <div className="buttons">
                      <button onClick={() => handleSaveDraft(draft)}>
                        Save
                      </button>
                      <button onClick={() => handleCancelDraft(draft.id)}>
                        Cancel
                      </button>
                    </div>
                  </li>
                ) : (
                  <li key={item.id} className="session-list-item">
                    <strong>{item.name}</strong>
                    <div className="buttons">
                      {"steps" in item && (
                        // Updated: pass full Session
                        <button onClick={() => onSelectSession(item)}>
                          Load
                        </button>
                      )}
                      <button onClick={() => handleEditClick(item)}>
                        Edit
                      </button>
                      <button onClick={() => onDeleteEntity(item.id, category)}>
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </div>
          )
        )}
        {newDraftId &&
          drafts
            .filter((d) => d.id === newDraftId)
            .map((draft) => (
              <li key={draft.id} className="session-list-item draft">
                <input
                  type="text"
                  placeholder="Name"
                  value={draft.name}
                  onChange={(e) =>
                    handleDraftChange(draft.id, "name", e.target.value)
                  }
                />
                <textarea
                  placeholder="Description"
                  value={draft.description}
                  onChange={(e) =>
                    handleDraftChange(draft.id, "description", e.target.value)
                  }
                />
                {viewType !== "sessions" && "sessions" in draft && (
                  <div className="attached-sessions">
                    <h5>Attached Sessions:</h5>
                    {draft.sessions?.map((s) => (
                      <div key={s.id}>
                        {s.name}{" "}
                        <button
                          onClick={() => handleRemoveSession(draft.id, s.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <select
                      onChange={(e) => {
                        const s = [
                          ...sessions.personal,
                          ...sessions.userShared,
                          ...sessions.groupShared,
                        ].find((sess) => sess.id === Number(e.target.value));
                        if (s) handleAttachSession(draft.id, s);
                        e.currentTarget.value = "";
                      }}
                    >
                      <option value="">Add session...</option>
                      {[
                        ...sessions.personal,
                        ...sessions.userShared,
                        ...sessions.groupShared,
                      ]
                        .filter(
                          (s) => !draft.sessions?.some((ds) => ds.id === s.id)
                        )
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                <div className="buttons">
                  <button onClick={() => handleSaveDraft(draft)}>Save</button>
                  <button onClick={() => handleCancelDraft(draft.id)}>
                    Cancel
                  </button>
                </div>
              </li>
            ))}
      </ul>
    );
  };

  return (
    <div className="session-selector-container">
      <div className="view-type-buttons">
        <button
          onClick={() => setViewType("sessions")}
          className={viewType === "sessions" ? "selected" : ""}
        >
          Sessions
        </button>
        <button
          onClick={() => setViewType("practices")}
          className={viewType === "practices" ? "selected" : ""}
        >
          Practices
        </button>
        <button
          onClick={() => setViewType("game tactics")}
          className={viewType === "game tactics" ? "selected" : ""}
        >
          Game Tactics
        </button>
      </div>

      {renderItems()}

      <div className="new-session">
        <button onClick={handleAddNew}>Add New</button>
      </div>
    </div>
  );
};
