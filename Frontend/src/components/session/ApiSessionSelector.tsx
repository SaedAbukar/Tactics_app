import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "../ui/Modal";
import { SessionForm } from "./SessionForm";
import { SessionList } from "./SessionList";
import { useSessionSelector } from "./useSessionSelector";
import type { Step } from "../../types/types";
import "./SessionSelector.css";

type ViewType = "sessions" | "practices" | "game tactics";
type Category = "personal" | "userShared" | "groupShared";

interface Props {
  viewType: ViewType;
  setViewType: (v: ViewType) => void;
  // FIX: Update this line to accept the optional item parameter
  onSelectSession: (steps: Step[], item?: any) => void;
}

export const ApiSessionSelector: React.FC<Props> = observer(
  ({ viewType, setViewType, onSelectSession }) => {
    // ... rest of the component remains the same
    const {
      vm,
      editingId,
      setEditingId,
      isCreating,
      setIsCreating,
      modalConfig,
      setModalConfig,
      handleSave,
      handleDeleteCheck,
      handleSelect,
    } = useSessionSelector(viewType, onSelectSession);

    // ... (rest of the file is unchanged) ...
    // ... Copy the rest of the existing return statement ...
    // For brevity, just ensure the interface Props above is updated.

    // Local View State
    const [expandedCategory, setExpandedCategory] = useState<Category | null>(
      "personal"
    );

    const getCurrentState = () => {
      if (viewType === "sessions") return vm.sessionsState;
      if (viewType === "practices") return vm.practicesState;
      return vm.tacticsState;
    };

    const getAvailableSessions = () => [
      ...vm.sessionsState.personal,
      ...vm.sessionsState.userShared,
      ...vm.sessionsState.groupShared,
    ];

    return (
      <div className="session-selector">
        <Modal
          isOpen={modalConfig.isOpen}
          title={modalConfig.title}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onConfirm={modalConfig.onConfirm}
          isDanger={modalConfig.isDanger}
          confirmText={modalConfig.confirmText}
        >
          {modalConfig.message}
        </Modal>

        {/* Tabs */}
        <div className="selector-tabs">
          {(["sessions", "practices", "game tactics"] as ViewType[]).map(
            (t) => (
              <button
                key={t}
                className={`tab-btn ${viewType === t ? "active" : ""}`}
                onClick={() => {
                  setViewType(t);
                  setIsCreating(false);
                  setEditingId(null);
                }}
              >
                {t === "game tactics"
                  ? "Tactics"
                  : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div className="selector-content">
          {vm.isLoading ? (
            <div className="loading-state">
              <div className="spinner-small"></div>
              <span>Loading library...</span>
            </div>
          ) : (
            <>
              {isCreating ? (
                <div className="create-wrapper">
                  <div className="create-header">
                    New {viewType.slice(0, -1)}
                  </div>
                  <SessionForm
                    initialData={{ name: "", description: "" }}
                    viewType={viewType}
                    availableSessions={getAvailableSessions()}
                    onSave={handleSave}
                    onCancel={() => setIsCreating(false)}
                  />
                </div>
              ) : (
                <button
                  className="modern-btn primary full-width"
                  onClick={() => setIsCreating(true)}
                >
                  + Create New
                </button>
              )}

              <div className="lists-container">
                <SessionList
                  title="My Personal"
                  category="personal"
                  items={getCurrentState().personal}
                  expandedCategory={expandedCategory}
                  setExpandedCategory={setExpandedCategory}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  onSelect={handleSelect}
                  onSave={handleSave}
                  onDelete={handleDeleteCheck}
                  viewType={viewType}
                  availableSessions={getAvailableSessions()}
                />
                <SessionList
                  title="Shared With Me"
                  category="userShared"
                  items={getCurrentState().userShared}
                  expandedCategory={expandedCategory}
                  setExpandedCategory={setExpandedCategory}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  onSelect={handleSelect}
                  onSave={handleSave}
                  onDelete={handleDeleteCheck}
                  viewType={viewType}
                  availableSessions={getAvailableSessions()}
                />
                <SessionList
                  title="Group Library"
                  category="groupShared"
                  items={getCurrentState().groupShared}
                  expandedCategory={expandedCategory}
                  setExpandedCategory={setExpandedCategory}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  onSelect={handleSelect}
                  onSave={handleSave}
                  onDelete={handleDeleteCheck}
                  viewType={viewType}
                  availableSessions={getAvailableSessions()}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);
