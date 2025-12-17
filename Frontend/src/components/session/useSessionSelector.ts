import { useState, useEffect } from "react";
import { useExercises } from "../../context/ExercisesProvider";
import type { Step } from "../../types/types";

type ViewType = "sessions" | "practices" | "game tactics";

export const useSessionSelector = (
  viewType: ViewType,
  onSelectSession: (steps: Step[]) => void
) => {
  const { exercisesViewModel: vm, tacticalBoardViewModel: boardVM } =
    useExercises();

  // Local UI State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [modalConfig, setModalConfig] = useState<any>({ isOpen: false });

  useEffect(() => {
    vm.loadData();
  }, [vm]);

  // --- ACTIONS ---

  const handleSave = async (formData: any) => {
    let payload = { ...formData };

    // 1. Merge Board Steps (if Session)
    if (viewType === "sessions") {
      if (boardVM.savedSteps.length > 0) {
        payload.steps = JSON.parse(JSON.stringify(boardVM.savedSteps));
      } else {
        payload.steps = payload.steps || [];
      }
    }

    // 2. Validation
    let error = null;
    if (viewType === "sessions") {
      error = vm.validateSessionInput(
        payload.name,
        payload.description,
        payload.steps
      );
    } else {
      const typeLabel = viewType === "practices" ? "Practice" : "Tactic";
      error = vm.validateCollectionInput(
        payload.name,
        payload.description,
        payload.sessions,
        typeLabel
      );
    }

    if (error) {
      setModalConfig({
        isOpen: true,
        title: "Validation Error",
        message: error,
        confirmText: "OK",
        onConfirm: () =>
          setModalConfig((prev: any) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    // 3. Save to API
    if (isCreating) {
      if (viewType === "sessions") await vm.createSession(payload);
      else if (viewType === "practices") await vm.createPractice(payload);
      else await vm.createTactic(payload);
    } else if (editingId) {
      if (viewType === "sessions") await vm.updateSession(editingId, payload);
      else if (viewType === "practices")
        await vm.updatePractice(editingId, payload);
      else await vm.updateTactic(editingId, payload);
    }

    setEditingId(null);
    setIsCreating(false);
  };

  const handleDeleteCheck = (id: number) => {
    // 1. Check Dependencies (only for sessions)
    if (viewType === "sessions") {
      const dependencies: string[] = [];

      const allPractices = [
        ...vm.practicesState.personal,
        ...vm.practicesState.userShared,
        ...vm.practicesState.groupShared,
      ];
      allPractices.forEach((p) => {
        if (p.sessions?.some((s) => s.id === id))
          dependencies.push(`Practice: ${p.name}`);
      });

      const allTactics = [
        ...vm.tacticsState.personal,
        ...vm.tacticsState.userShared,
        ...vm.tacticsState.groupShared,
      ];
      allTactics.forEach((t) => {
        if (t.sessions?.some((s) => s.id === id))
          dependencies.push(`Tactic: ${t.name}`);
      });

      if (dependencies.length > 0) {
        setModalConfig({
          isOpen: true,
          title: "Cannot Delete Session",
          message: `This session is used by: ${dependencies.join(
            ", "
          )}. Please remove it first.`,
          onConfirm: undefined,
        });
        return;
      }
    }

    // 2. Confirm Delete
    setModalConfig({
      isOpen: true,
      title: "Delete Item",
      message: "Are you sure? This cannot be undone.",
      isDanger: true,
      confirmText: "Delete",
      onConfirm: async () => {
        if (viewType === "sessions") await vm.deleteSession(id);
        else if (viewType === "practices") await vm.deletePractice(id);
        else await vm.deleteTactic(id);
        setModalConfig((prev: any) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSelect = (item: any) => {
    if ("steps" in item) onSelectSession(item.steps);
    else if (item.sessions?.length > 0) onSelectSession(item.sessions[0].steps);
  };

  return {
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
  };
};
