import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useExercises } from "../../context/ExercisesProvider";
import type { Step } from "../../types/types";

type ViewType = "sessions" | "practices" | "game tactics";

export const useSessionSelector = (
  viewType: ViewType,
  onSelectSession: (steps: Step[]) => void
) => {
  const { exercisesViewModel: vm, tacticalBoardViewModel: boardVM } =
    useExercises();
  const { t } = useTranslation("tacticalEditor");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [modalConfig, setModalConfig] = useState<any>({ isOpen: false });

  useEffect(() => {
    vm.loadData();
  }, [vm]);

  const handleSave = async (formData: any) => {
    let payload = { ...formData };
    if (viewType === "sessions") {
      payload.steps =
        boardVM.savedSteps.length > 0
          ? JSON.parse(JSON.stringify(boardVM.savedSteps))
          : payload.steps || [];
    }

    let error = null;
    if (viewType === "sessions") {
      error = vm.validateSessionInput(
        payload.name,
        payload.description,
        payload.steps
      );
    } else {
      const label =
        viewType === "practices"
          ? t("sessionSelector.practiceLabel")
          : t("sessionSelector.tacticLabel");
      error = vm.validateCollectionInput(
        payload.name,
        payload.description,
        payload.sessions,
        label
      );
    }

    if (error) {
      setModalConfig({
        isOpen: true,
        title: t("sessionSelector.validationError"),
        message: error,
        confirmText: t("sessionSelector.ok"),
        onConfirm: () =>
          setModalConfig((prev: any) => ({ ...prev, isOpen: false })),
      });
      return;
    }

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
    boardVM.clearPitch();
  };

  const handleDeleteCheck = (id: number) => {
    const state =
      viewType === "sessions"
        ? vm.sessionsState
        : viewType === "practices"
        ? vm.practicesState
        : vm.tacticsState;

    // Check if the item belongs to personal category
    const isPersonal = state.personal.some((i) => i.id === id);

    if (!isPersonal) {
      // Shared items cannot be deleted from this view
      return;
    }

    if (viewType === "sessions") {
      const dependencies: string[] = [];
      const allPractices = [
        ...vm.practicesState.personal,
        ...vm.practicesState.userShared,
        ...vm.practicesState.groupShared,
      ];
      allPractices.forEach((p) => {
        if (p.sessions?.some((s) => s.id === id))
          dependencies.push(`${t("sessionSelector.practiceLabel")}: ${p.name}`);
      });

      const allTactics = [
        ...vm.tacticsState.personal,
        ...vm.tacticsState.userShared,
        ...vm.tacticsState.groupShared,
      ];
      allTactics.forEach((tac) => {
        if (tac.sessions?.some((s) => s.id === id))
          dependencies.push(`${t("sessionSelector.tacticLabel")}: ${tac.name}`);
      });

      if (dependencies.length > 0) {
        setModalConfig({
          isOpen: true,
          title: t("sessionSelector.cannotDeleteTitle"),
          message: t("sessionSelector.cannotDeleteMessage", {
            dependencies: dependencies.join(", "),
          }),
          onConfirm: undefined,
        });
        return;
      }
    }

    setModalConfig({
      isOpen: true,
      title: t("sessionSelector.deleteTitle"),
      message: t("sessionSelector.deleteMessage"),
      isDanger: true,
      confirmText: t("sessionSelector.deleteConfirm"),
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

  const startCreating = (value: boolean) => {
    if (value) {
      boardVM.clearPitch();
      setEditingId(null);
    }
    setIsCreating(value);
  };

  return {
    vm,
    editingId,
    setEditingId,
    isCreating,
    setIsCreating: startCreating,
    modalConfig,
    setModalConfig,
    handleSave,
    handleDeleteCheck,
    handleSelect,
  };
};
