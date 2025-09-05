import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// import { useFetchWithAuth } from "./useFetchWithAuth"; // commented out for mock
import type { Session, Practice, GameTactic } from "../types/types";
import {
  mockAddEntityToUser,
  mockRemoveEntityFromUser,
  mockGetUserEntities,
  mockSetUserEntities,
} from "../mock/mockAuth";

type Entity = Session | Practice | GameTactic;

type EntityType = "sessions" | "practices" | "gameTactics";

interface UseUserEntitiesReturn<T extends Entity> {
  entities: T[];
  loading: boolean;
  error: string | null;
  addEntity: (entity: Partial<T>) => Promise<void>;
  updateEntity: (entity: T) => Promise<void>;
  deleteEntity: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useUserEntities = <T extends Entity>(
  entityType: EntityType
): UseUserEntitiesReturn<T> => {
  const { user } = useAuth();
  // const { request } = useFetchWithAuth(); // commented out for mock
  const [entities, setEntities] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const entityKeyMap: Record<
    EntityType,
    "sessionIds" | "practiceIds" | "tacticIds"
  > = {
    sessions: "sessionIds",
    practices: "practiceIds",
    gameTactics: "tacticIds",
  };

  const fetchEntities = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // ---------- MOCK ----------
      const ids = await mockGetUserEntities(user.id, entityKeyMap[entityType]);
      // Here you could map ids to actual mock entity objects if needed
      setEntities(
        ids.map((id) => ({
          id,
          name: `Mock ${entityType.slice(0, -1)} ${id}`,
          description: "",
        })) as T[]
      );

      // ---------- REAL API (commented out) ----------
      // const data: T[] = await request(`/api/${entityType}`);
      // setEntities(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch entities");
    } finally {
      setLoading(false);
    }
  };

  const addEntity = async (entity: Partial<T>) => {
    if (!user) return;
    try {
      const newId = Date.now(); // mock ID
      // ---------- MOCK ----------
      await mockAddEntityToUser(user.id, entityKeyMap[entityType], newId);
      setEntities((prev) => [
        ...prev,
        {
          ...entity,
          id: newId,
          name: entity.name || `Mock ${entityType.slice(0, -1)} ${newId}`,
        } as T,
      ]);

      // ---------- REAL API (commented out) ----------
      // const newEntity: T = await request(`/api/${entityType}`, {
      //   method: "POST",
      //   body: JSON.stringify(entity),
      //   headers: { "Content-Type": "application/json" },
      // });
      // setEntities((prev) => [...prev, newEntity]);
    } catch (err: any) {
      setError(err.message || "Failed to add entity");
    }
  };

  const updateEntity = async (entity: T) => {
    if (!user) return;
    try {
      // ---------- MOCK ----------
      // For simplicity, we replace the entity locally
      setEntities((prev) => prev.map((e) => (e.id === entity.id ? entity : e)));

      // ---------- REAL API (commented out) ----------
      // const updated: T = await request(`/api/${entityType}/${entity.id}`, {
      //   method: "PUT",
      //   body: JSON.stringify(entity),
      //   headers: { "Content-Type": "application/json" },
      // });
      // setEntities((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } catch (err: any) {
      setError(err.message || "Failed to update entity");
    }
  };

  const deleteEntity = async (id: number) => {
    if (!user) return;
    try {
      // ---------- MOCK ----------
      await mockRemoveEntityFromUser(user.id, entityKeyMap[entityType], id);
      setEntities((prev) => prev.filter((e) => e.id !== id));

      // ---------- REAL API (commented out) ----------
      // await request(`/api/${entityType}/${id}`, { method: "DELETE" });
      // setEntities((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete entity");
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [user]);

  return {
    entities,
    loading,
    error,
    addEntity,
    updateEntity,
    deleteEntity,
    refresh: fetchEntities,
  };
};
