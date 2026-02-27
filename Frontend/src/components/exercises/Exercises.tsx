import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/Auth/AuthContext";
import { useExercises } from "../../context/ExercisesProvider";
import { type ItemsState } from "../../types/types";

import { TabButton } from "./components/TabButton";
import { SectionColumn } from "./components/SectionColumn";
import { DetailView } from "./components/DetailView";
import "./Exercises.css";
import { LoadingSpinner } from "../ui/LoadingSpinner";

type TabType = "sessions" | "practices" | "tactics";

export const Exercises = observer(() => {
  const { user } = useAuth();
  const { t } = useTranslation(["exercises", "common"]);
  const { exercisesViewModel } = useExercises();
  const [activeTab, setActiveTab] = useState<TabType>("sessions");

  useEffect(() => {
    if (user) {
      exercisesViewModel.clearSelection();
      exercisesViewModel.loadData();
    }
  }, [user, exercisesViewModel]);

  // --------------------------------------------------------
  // ✅ FIX: Dynamic Handler for Clicks
  // --------------------------------------------------------
  const handleItemClick = async (item: any) => {
    if (activeTab === "sessions") {
      await exercisesViewModel.fetchAndSelectSession(item.id);
    } else if (activeTab === "practices") {
      await exercisesViewModel.fetchAndSelectPractice(item.id);
    } else if (activeTab === "tactics") {
      await exercisesViewModel.fetchAndSelectTactic(item.id);
    }
  };

  if (exercisesViewModel.isLoading) {
    return <LoadingSpinner fullScreen={exercisesViewModel.isLoading} />;
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
              "Manage your personal and shared training resources.",
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
          onItemClick={handleItemClick} // ✅ Use the dynamic handler
        />
        <SectionColumn
          title={t("columns.shared", "Shared with Me")}
          items={currentData.userShared}
          color="var(--color-amber)"
          onItemClick={handleItemClick} // ✅ Use the dynamic handler
        />
        <SectionColumn
          title={t("columns.group", "Group Library")}
          items={currentData.groupShared}
          color="var(--color-indigo)"
          onItemClick={handleItemClick} // ✅ Use the dynamic handler
        />
      </div>
    </div>
  );
});
