import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useAuth } from "../../context/Auth/AuthContext";
import { useExercises } from "../../context/ExercisesProvider";
import { type ItemsState } from "../../types/types";

// Imports from new component files
import { TabButton } from "./components/TabButton";
import { SectionColumn } from "./components/SectionColumn";
import { DetailView } from "./components/DetailView";
import "./Exercises.css"; // Global styles for this feature

type TabType = "sessions" | "practices" | "tactics";

export const Exercises = observer(() => {
  const { user } = useAuth();
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
        <strong>Error:</strong> {exercisesViewModel.error}
        <button
          onClick={() => exercisesViewModel.loadData()}
          style={{ marginLeft: "1rem" }}
        >
          Retry
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
          <h1 className="page-title">Training Dashboard</h1>
          <p className="page-subtitle">
            Manage your personal and shared training resources.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <TabButton
          active={activeTab === "sessions"}
          onClick={() => setActiveTab("sessions")}
          label="Sessions"
        />
        <TabButton
          active={activeTab === "practices"}
          onClick={() => setActiveTab("practices")}
          label="Practices"
        />
        <TabButton
          active={activeTab === "tactics"}
          onClick={() => setActiveTab("tactics")}
          label="Game Tactics"
        />
      </div>

      {/* Columns */}
      <div className="columns-grid">
        <SectionColumn
          title="Personal"
          items={currentData.personal}
          color="var(--color-green)" // Using variable for consistency
          onItemClick={(item) => exercisesViewModel.selectItem(item)}
        />
        <SectionColumn
          title="Shared with Me"
          items={currentData.userShared}
          color="var(--color-amber)"
          onItemClick={(item) => exercisesViewModel.selectItem(item)}
        />
        <SectionColumn
          title="Group Library"
          items={currentData.groupShared}
          color="var(--color-indigo)"
          onItemClick={(item) => exercisesViewModel.selectItem(item)}
        />
      </div>
    </div>
  );
});
