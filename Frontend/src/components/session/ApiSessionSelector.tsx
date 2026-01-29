import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Modal } from "../ui/Modal";
import { SessionForm } from "./SessionForm";
import { SessionList } from "./SessionList";
import { useSessionSelector } from "./useSessionSelector";
import type { Step, SessionSummary } from "../../types/types";
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
    const { t } = useTranslation("tacticalEditor");

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

    const [expandedCategory, setExpandedCategory] = useState<Category | null>(
      "personal",
    );

    const getCurrentState = () => {
      if (viewType === "sessions") return vm.sessionsState;
      if (viewType === "practices") return vm.practicesState;
      return vm.tacticsState;
    };

    // Returns all available session summaries for attaching to practices/tactics
    const getAvailableSessions = (): SessionSummary[] => [
      ...vm.sessionsState.personal,
      ...vm.sessionsState.userShared,
      ...vm.sessionsState.groupShared,
    ];

    const getTabLabel = (type: ViewType) => {
      if (type === "sessions") return t("sessionSelector.tabSessions");
      if (type === "practices") return t("sessionSelector.tabPractices");
      return t("sessionSelector.tabTactics");
    };

    const getNewHeader = (type: ViewType) => {
      return `${t("sessionSelector.new")} ${getTabLabel(type)}`;
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
            ),
          )}
        </div>

        <div className="selector-content">
          {vm.isLoading ? (
            <div className="loading-state">
              <div className="spinner-small"></div>
              <span>{t("sessionSelector.loading")}</span>
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
                  + {t("sessionSelector.create")}
                </button>
              )}

              <div className="lists-container">
                <SessionList
                  title={t("sessionSelector.personal")}
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
                  title={t("sessionSelector.shared")}
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
                  title={t("sessionSelector.group")}
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
  },
);
