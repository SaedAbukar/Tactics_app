import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useExercises } from "../../../../context/ExercisesProvider";
import type { PracticeDetail, GameTacticDetail } from "../../../../types/types";

interface IncludedSessionsProps {
  item: PracticeDetail | GameTacticDetail;
  type: "practices" | "tactics";
}

export const IncludedSessions: React.FC<IncludedSessionsProps> = observer(
  ({ item, type }) => {
    const { t } = useTranslation(["exercises", "common"]);
    const { exercisesViewModel } = useExercises();

    const [isAdding, setIsAdding] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string>("");

    // 1. Current sessions inside the Practice/Tactic
    // We cast to unknown first because the Detail type might strictly define this as SessionDetail[],
    // but for the list logic we just need the ID and basic info.
    const currentSessions = item.sessions || [];

    // 2. Available sessions to add (from Personal Library)
    const personalSessions = exercisesViewModel.sessionsState.personal;

    // Filter out sessions that are already attached
    const availableSessions = personalSessions.filter(
      (s) => !currentSessions.some((existing) => existing.id === s.id),
    );

    const handleAdd = async () => {
      if (!selectedSessionId) return;

      const sessionToAdd = personalSessions.find(
        (s) => s.id === Number(selectedSessionId),
      );

      if (!sessionToAdd) return;

      // Create the new list.
      // Note: We are mixing SessionDetail (current) and SessionSummary (adding).
      // This is fine for the update payload as long as they have IDs.
      const updatedSessions = [...currentSessions, sessionToAdd];

      // Construct Payload
      const payload = {
        name: item.name,
        description: item.description,
        isPremade: item.isPremade,
        // Backend expects a list of objects with at least an ID to link them
        sessions: updatedSessions.map((s) => ({ id: s.id })) as any,
      };

      try {
        if (type === "practices") {
          await exercisesViewModel.updatePractice(item.id, payload);
        } else {
          await exercisesViewModel.updateTactic(item.id, payload);
        }
        setSelectedSessionId("");
        setIsAdding(false);
      } catch (error) {
        console.error("Failed to add session:", error);
      }
    };

    const handleRemove = async (sessionIdToRemove: number) => {
      const updatedSessions = currentSessions.filter(
        (s) => s.id !== sessionIdToRemove,
      );

      const payload = {
        name: item.name,
        description: item.description,
        isPremade: item.isPremade,
        sessions: updatedSessions.map((s) => ({ id: s.id })) as any,
      };

      try {
        if (type === "practices") {
          await exercisesViewModel.updatePractice(item.id, payload);
        } else {
          await exercisesViewModel.updateTactic(item.id, payload);
        }
      } catch (error) {
        console.error("Failed to remove session:", error);
      }
    };

    return (
      <div className="included-sessions-wrapper">
        {/* Header Row */}
        <div className="included-header">
          <h3 className="section-label" style={{ marginBottom: 0 }}>
            {t("detail.included", {
              count: currentSessions.length,
              defaultValue: "Included Sessions",
            })}
          </h3>

          {/* Toggle Add Button */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="btn-action primary"
            >
              <span>+</span> {t("detail.addSession", "Add Session")}
            </button>
          ) : (
            <button
              onClick={() => setIsAdding(false)}
              className="btn-action secondary"
            >
              {t("common:cancel", "Cancel")}
            </button>
          )}
        </div>

        {/* Add Session Panel */}
        {isAdding && (
          <div className="add-session-panel">
            <h4 className="panel-title">
              {t("detail.selectPrompt", "Select a session to add")}
            </h4>

            <div className="add-controls-row">
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="session-select"
              >
                <option value="">
                  {t("detail.choose", "-- Choose from Library --")}
                </option>
                {availableSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAdd}
                disabled={!selectedSessionId}
                className="btn-action primary"
              >
                {t("common:add", "Add")}
              </button>
            </div>

            {availableSessions.length === 0 && (
              <p className="error-text">
                {t("detail.noSessions", "No sessions available.")}
              </p>
            )}
          </div>
        )}

        {/* Session List */}
        <div className="grid-list">
          {currentSessions.map((s) => (
            <div
              key={s.id}
              className="item-card clickable-session"
              // When clicking a nested session, we want to open THAT session's details
              onClick={() => exercisesViewModel.fetchAndSelectSession(s.id)}
            >
              <strong className="card-title" style={{ display: "block" }}>
                {s.name}
              </strong>
              <span className="card-id">{s.description?.slice(0, 50)}...</span>

              {/* Remove Button (X) */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop card click
                  handleRemove(s.id);
                }}
                title={t("common.remove", "Remove session")}
                className="btn-remove-absolute"
              >
                &times;
              </button>
            </div>
          ))}

          {currentSessions.length === 0 && !isAdding && (
            <div className="empty-state">
              {t("detail.noSessions", "No sessions linked yet.")}
            </div>
          )}
        </div>
      </div>
    );
  },
);
