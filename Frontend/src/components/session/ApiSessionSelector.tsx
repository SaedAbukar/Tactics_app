import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next"; // 1. Import hook
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
  onSelectSession: (steps: Step[], item?: any) => void;
}

export const ApiSessionSelector: React.FC<Props> = observer(
  ({ viewType, setViewType, onSelectSession }) => {
    const { t } = useTranslation("tacticalEditor"); // 2. Initialize hook

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

    // Helper to translate tabs
    const getTabLabel = (type: ViewType) => {
      if (type === "sessions")
        return t("sessionSelector.tabSessions", "Sessions");
      if (type === "practices")
        return t("sessionSelector.tabPractices", "Practices");
      return t("sessionSelector.tabTactics", "Tactics");
    };

    // Helper to translate "New X"
    const getNewHeader = (type: ViewType) => {
      const base = t("sessionSelector.new", "New");
      if (type === "sessions")
        return `${base} ${t("sessionSelector.tabSessions", "Session").slice(
          0,
          -1
        )}`;
      // Simple slice for singular is risky in i18n, better to have explicit keys or just use generic title
      // Let's use the explicit "New" + translated type label logic if possible, or just "New Item"
      return `${base} ${getTabLabel(type)}`;
    };

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
            (tab) => (
              <button
                key={tab}
                className={`tab-btn ${viewType === tab ? "active" : ""}`}
                onClick={() => {
                  setViewType(tab);
                  setIsCreating(false);
                  setEditingId(null);
                }}
              >
                {getTabLabel(tab)}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div className="selector-content">
          {vm.isLoading ? (
            <div className="loading-state">
              <div className="spinner-small"></div>
              <span>{t("sessionSelector.loading", "Loading library...")}</span>
            </div>
          ) : (
            <>
              {isCreating ? (
                <div className="create-wrapper">
                  <div className="create-header">{getNewHeader(viewType)}</div>
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
                  + {t("sessionSelector.create", "Create New")}
                </button>
              )}

              <div className="lists-container">
                <SessionList
                  title={t("sessionSelector.personal", "My Personal")}
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
                  title={t("sessionSelector.shared", "Shared With Me")}
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
                  title={t("sessionSelector.group", "Group Library")}
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
