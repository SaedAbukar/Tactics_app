import React, { useState } from "react";
import type { Step, Session } from "../../types/types";
import "./SessionSelector.css";

interface SessionSelectorProps {
  sessions: Session[];
  onSelectSession: (steps: Step[]) => void;
  onUpdateSession: (updatedSession: Session) => void;
  onDeleteSession: (id: number) => void;
  onAddSession: (session: Session) => void;
}

export const SessionSelector: React.FC<SessionSelectorProps> = ({
  sessions,
  onSelectSession,
  onUpdateSession,
  onDeleteSession,
  onAddSession,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null); // Track session being updated

  const handleSelect = (session: Session) => {
    setSelectedId(session.id);
    onSelectSession(session.steps);
  };

  const handleDescriptionChange = (id: number, value: string) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;
    onUpdateSession({ ...session, description: value });
  };

  const handleNameChange = (id: number, value: string) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;
    onUpdateSession({ ...session, name: value });
  };

  const handleAdd = () => {
    if (!newName.trim()) return alert("Name is required");
    const newSession: Session = {
      id: Date.now(),
      name: newName,
      description: newDescription,
      steps: [],
    };
    onAddSession(newSession);
    setNewName("");
    setNewDescription("");
  };

  const handleUpdate = (id: number) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;
    setNewName(session.name);
    setNewDescription(session.description);
    setUpdatingId(session.id); // Mark this session as being updated
  };

  const handleSaveUpdate = () => {
    if (updatingId === null) return;
    const session = sessions.find((s) => s.id === updatingId);
    if (!session) return;
    const updatedSession: Session = {
      ...session,
      name: newName,
      description: newDescription,
    };
    onUpdateSession(updatedSession);
    setNewName("");
    setNewDescription("");
    setUpdatingId(null);
    alert("Session updated!");
  };

  return (
    <div className="session-selector-container">
      <h3>Sessions</h3>

      <div className="new-session">
        <input
          type="text"
          placeholder="Session name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="session-input"
        />
        <textarea
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="session-textarea"
        />
        {updatingId === null ? (
          <button onClick={handleAdd} className="light-button full-width">
            Add Session
          </button>
        ) : (
          <button
            onClick={handleSaveUpdate}
            className="light-button full-width"
          >
            Save Update
          </button>
        )}
      </div>

      <ul className="session-list">
        {sessions.map((s) => (
          <li
            key={s.id}
            className={`session-item ${selectedId === s.id ? "selected" : ""} ${
              updatingId === s.id ? "updating" : ""
            }`} // Add class for updating session
          >
            <input
              type="text"
              value={s.name}
              onChange={(e) => handleNameChange(s.id, e.target.value)}
              className="session-input session-name"
            />
            {selectedId === s.id && (
              <textarea
                value={s.description}
                onChange={(e) => handleDescriptionChange(s.id, e.target.value)}
                placeholder="Enter description..."
                className="session-textarea session-description"
              />
            )}
            <div className="buttons">
              <button onClick={() => handleSelect(s)} className="light-button">
                Select
              </button>
              <button
                onClick={() => handleUpdate(s.id)}
                className="light-button"
              >
                Update
              </button>
              <button
                onClick={() => onDeleteSession(s.id)}
                className="light-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
