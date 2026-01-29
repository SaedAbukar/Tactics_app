import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type {
  SessionSummary,
  PracticeSummary,
  GameTacticSummary,
} from "../../types/types";

interface SessionFormProps {
  // We use Partial Summary for editing logic
  initialData: Partial<SessionSummary | PracticeSummary | GameTacticSummary>;
  viewType: "sessions" | "practices" | "game tactics";
  availableSessions: SessionSummary[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const SessionForm: React.FC<SessionFormProps> = ({
  initialData,
  viewType,
  availableSessions,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation("tacticalEditor");
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData.id]);

  const attachSession = (sessionId: number) => {
    // Cast to PracticeSummary to access 'sessions'
    const current = (form as PracticeSummary).sessions || [];
    // Prevent duplicates
    if (current.find((s) => s.id === sessionId)) return;

    const toAdd = availableSessions.find((s) => s.id === sessionId);
    if (toAdd) {
      setForm({ ...form, sessions: [...current, toAdd] } as any);
    }
  };

  const detachSession = (sessionId: number) => {
    const current = (form as PracticeSummary).sessions || [];
    setForm({
      ...form,
      sessions: current.filter((s) => s.id !== sessionId),
    } as any);
  };

  // Helper: Get sessions currently attached
  // Note: SessionSummary doesn't have 'sessions', only Practice/Tactic do.
  const currentSessions = (form as PracticeSummary).sessions || [];

  // Logic: Filter available sessions to exclude those already attached
  const selectableSessions = availableSessions.filter(
    (s) => !currentSessions.some((attached) => attached.id === s.id),
  );

  return (
    <div className="editor-form">
      <input
        className="modern-input"
        placeholder={t("sessionSelector.namePlaceholder", "Name")}
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        autoFocus
      />
      <textarea
        className="modern-input"
        placeholder={t("sessionSelector.descriptionPlaceholder", "Description")}
        rows={2}
        value={form.description || ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      {viewType !== "sessions" && (
        <div className="attachment-section">
          <label className="sub-label">
            {t("sessionSelector.attachedSessions", "Attached Sessions:")}
          </label>
          <ul className="attached-list">
            {currentSessions.map((s) => (
              <li key={s.id} className="attached-item">
                <span>{s.name}</span>
                <button
                  className="icon-btn-mini danger"
                  onClick={() => detachSession(s.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {/* Only show select if there are sessions left to add */}
          {selectableSessions.length > 0 ? (
            <select
              className="modern-select"
              onChange={(e) => {
                if (e.target.value) attachSession(Number(e.target.value));
                e.target.value = "";
              }}
            >
              <option value="">
                {t("sessionSelector.addAttached", "+ Add Session")}
              </option>
              {selectableSessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            <div
              className="empty-text"
              style={{ fontSize: "0.7rem", padding: "4px" }}
            >
              {availableSessions.length === 0
                ? t(
                    "sessionSelector.noSessionsAvailable",
                    "No sessions in library",
                  )
                : t(
                    "sessionSelector.allSessionsAttached",
                    "All available sessions attached",
                  )}
            </div>
          )}
        </div>
      )}

      <div className="form-actions">
        <button
          className="modern-btn primary small"
          disabled={!form.name}
          onClick={() => onSave(form)}
        >
          {t("sessionSelector.save", "Save")}
        </button>
        <button className="modern-btn outline small" onClick={onCancel}>
          {t("sessionSelector.cancel", "Cancel")}
        </button>
      </div>
    </div>
  );
};
