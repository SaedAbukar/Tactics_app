import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Session, Practice, GameTactic } from "../../types/types";

interface SessionFormProps {
  initialData: Partial<Session | Practice | GameTactic>;
  viewType: "sessions" | "practices" | "game tactics";
  availableSessions: Session[];
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
  }, [initialData]);

  const attachSession = (sessionId: number) => {
    const current = (form as Practice).sessions || [];
    if (current.find((s) => s.id === sessionId)) return;

    const toAdd = availableSessions.find((s) => s.id === sessionId);
    if (toAdd) {
      setForm({ ...form, sessions: [...current, toAdd] } as any);
    }
  };

  const detachSession = (sessionId: number) => {
    const current = (form as Practice).sessions || [];
    setForm({
      ...form,
      sessions: current.filter((s) => s.id !== sessionId),
    } as any);
  };

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
            {(form as Practice).sessions?.map((s) => (
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
            {availableSessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
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
