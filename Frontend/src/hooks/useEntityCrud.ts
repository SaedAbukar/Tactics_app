import { useUserEntities } from "./useUserEntities";
import type { Session, Practice, GameTactic } from "../types/types";

export const useEntityCrud = <T extends Session | Practice | GameTactic>(
  entityType: "sessions" | "practices" | "gameTactics"
) => {
  const {
    entities,
    addEntity,
    updateEntity,
    deleteEntity,
    refresh,
    loading,
    error,
  } = useUserEntities<T>(entityType as any); // cast to satisfy TS

  const create = async (entity: Partial<T>) => {
    await addEntity(entity);
    await refresh();
  };

  const update = async (entity: T) => {
    await updateEntity(entity);
    await refresh();
  };

  const remove = async (id: number) => {
    await deleteEntity(id);
    await refresh();
  };

  const list = (): T[] => entities;

  return { create, update, remove, list, loading, error, refresh };
};
