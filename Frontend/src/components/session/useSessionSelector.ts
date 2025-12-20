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

  // --- ACTIONS ---

  const handleSave = async (formData: any) => {
    let payload = { ...formData };

    if (viewType === "sessions") {
      if (boardVM.savedSteps.length > 0) {
        payload.steps = JSON.parse(JSON.stringify(boardVM.savedSteps));
      } else {
        payload.steps = payload.steps || [];
      }
    }

    let error = null;
    if (viewType === "sessions") {
      error = vm.validateSessionInput(
        payload.name,
        payload.description,
        payload.steps
      );
    } else {
      const typeLabel =
        viewType === "practices"
          ? t("sessionSelector.practiceLabel", "Practice")
          : t("sessionSelector.tacticLabel", "Tactic");
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
        title: t("sessionSelector.validationError", "Validation Error"),
        message: error,
        confirmText: t("sessionSelector.ok", "OK"),
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
    console.log("SessionSelector: ", payload);
    setEditingId(null);
    setIsCreating(false);
    boardVM.clearPitch();
  };

  const handleDeleteCheck = (id: number) => {
    if (viewType === "sessions") {
      const dependencies: string[] = [];

      const allPractices = [
        ...vm.practicesState.personal,
        ...vm.practicesState.userShared,
        ...vm.practicesState.groupShared,
      ];
      // Renamed 'p' to 'practice' for clarity, though 'p' was fine
      allPractices.forEach((practice) => {
        if (practice.sessions?.some((s) => s.id === id))
          dependencies.push(
            `${t("sessionSelector.practiceLabel", "Practice")}: ${
              practice.name
            }`
          );
      });

      const allTactics = [
        ...vm.tacticsState.personal,
        ...vm.tacticsState.userShared,
        ...vm.tacticsState.groupShared,
      ];

      // FIX: Changed (t) to (tactic) to avoid shadowing the translation function 't'
      allTactics.forEach((tactic) => {
        if (tactic.sessions?.some((s) => s.id === id))
          dependencies.push(
            `${t("sessionSelector.tacticLabel", "Tactic")}: ${tactic.name}`
          );
      });

      if (dependencies.length > 0) {
        setModalConfig({
          isOpen: true,
          title: t(
            "sessionSelector.cannotDeleteTitle",
            "Cannot Delete Session"
          ),
          message: t("sessionSelector.cannotDeleteMessage", {
            dependencies: dependencies.join(", "),
            defaultValue: `This session is used by: ${dependencies.join(
              ", "
            )}. Please remove it first.`,
          }),
          onConfirm: undefined,
        });
        return;
      }
    }

    setModalConfig({
      isOpen: true,
      title: t("sessionSelector.deleteTitle", "Delete Item"),
      message: t(
        "sessionSelector.deleteMessage",
        "Are you sure? This cannot be undone."
      ),
      isDanger: true,
      confirmText: t("sessionSelector.deleteConfirm", "Delete"),
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
      // Only clear pitch when OPENING the modal (true)
      boardVM.clearPitch();
      setEditingId(null);
    }
    // Set the state to whatever was passed (true OR false)
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
