import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next"; // 1. Import
import { useAuth } from "../../context/Auth/AuthContext";
import { useExercises } from "../../context/ExercisesProvider";
import { type ItemsState } from "../../types/types";

// Imports from new component files
import { TabButton } from "./components/TabButton";
import { SectionColumn } from "./components/SectionColumn";
import { DetailView } from "./components/DetailView";
import "./Exercises.css";

type TabType = "sessions" | "practices" | "tactics";

export const Exercises = observer(() => {
  const { user } = useAuth();
  const { t } = useTranslation(["exercises", "common"]); // 2. Init
  const { exercisesViewModel } = useExercises();
  const [activeTab, setActiveTab] = useState<TabType>("sessions");

  useEffect(() => {
    if (user) {
      exercisesViewModel.loadData();
    }
  }, [user, exercisesViewModel]);

  if (exercisesViewModel.isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (exercisesViewModel.error) {
    return (
      <div className="error-container">
        <strong>{t("common:error", "Error")}:</strong>{" "}
        {exercisesViewModel.error}
        <button
          onClick={() => exercisesViewModel.loadData()}
          style={{ marginLeft: "1rem" }}
        >
          {t("common:retry", "Retry")}
        </button>
      </div>
    );
  }

  // --- LOGIC: Detail View ---
  if (exercisesViewModel.selectedItem) {
    return (
      <DetailView
        item={exercisesViewModel.selectedItem}
        type={activeTab}
        onBack={() => exercisesViewModel.clearSelection()}
      />
    );
  }

  // --- LOGIC: Dashboard View ---
  const getCurrentData = (): ItemsState<any> => {
    switch (activeTab) {
      case "practices":
        return exercisesViewModel.practicesState;
      case "tactics":
        return exercisesViewModel.tacticsState;
      case "sessions":
      default:
        return exercisesViewModel.sessionsState;
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="exercises-container">
      {/* Header */}
      <div className="header-section">
        <div>
          <h1 className="page-title">{t("title", "Training Dashboard")}</h1>
          <p className="page-subtitle">
            {t(
              "subtitle",
              "Manage your personal and shared training resources."
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <TabButton
          active={activeTab === "sessions"}
          onClick={() => setActiveTab("sessions")}
          label={t("tabs.sessions", "Sessions")}
        />
        <TabButton
          active={activeTab === "practices"}
          onClick={() => setActiveTab("practices")}
          label={t("tabs.practices", "Practices")}
        />
        <TabButton
          active={activeTab === "tactics"}
          onClick={() => setActiveTab("tactics")}
          label={t("tabs.tactics", "Game Tactics")}
        />
      </div>

      {/* Columns */}
      <div className="columns-grid">
        <SectionColumn
          title={t("columns.personal", "Personal")}
          items={currentData.personal}
          color="var(--color-green)"
          onItemClick={(item) => exercisesViewModel.selectItem(item)}
        />
        <SectionColumn
          title={t("columns.shared", "Shared with Me")}
          items={currentData.userShared}
          color="var(--color-amber)"
          onItemClick={(item) => exercisesViewModel.selectItem(item)}
        />
        <SectionColumn
          title={t("columns.group", "Group Library")}
          items={currentData.groupShared}
          color="var(--color-indigo)"
          onItemClick={(item) => exercisesViewModel.selectItem(item)}
        />
      </div>
    </div>
  );
});
