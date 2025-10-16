import { useState, useEffect } from "react";
import type {
  Session,
  Step,
  Practice,
  GameTactic,
  ItemsState,
} from "../../types/types";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { useAuth } from "../../context/Auth/AuthContext";

type ViewType = "sessions" | "practices" | "game tactics";
type Category = "personal" | "userShared" | "groupShared";

export const Exercises = ({}) => {
  const { user } = useAuth();
  const { request } = useFetchWithAuth();

  const [sessionsState, setSessionsState] = useState<ItemsState<Session>>({
    personal: [],
    userShared: [],
    groupShared: [],
  });
  const [practicesState, setPracticesState] = useState<ItemsState<Practice>>({
    personal: [],
    userShared: [],
    groupShared: [],
  });
  const [tacticsState, setTacticsState] = useState<ItemsState<GameTactic>>({
    personal: [],
    userShared: [],
    groupShared: [],
  });

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const [sessionsData, practicesData, tacticsData] = await Promise.all([
        request("/sessions"),
        request("/practices"),
        request("/game-tactics"),
      ]);

      setSessionsState({
        personal: sessionsData.personalItems || [],
        userShared: sessionsData.userSharedItems || [],
        groupShared: sessionsData.groupSharedItems || [],
      });

      setPracticesState({
        personal: practicesData.personalItems || [],
        userShared: practicesData.userSharedItems || [],
        groupShared: practicesData.groupSharedItems || [],
      });

      setTacticsState({
        personal: tacticsData.personalItems || [],
        userShared: tacticsData.userSharedItems || [],
        groupShared: tacticsData.groupSharedItems || [],
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Sessions</h2>
      <div>
        <h3>Personal</h3>
        <ul>
          {sessionsState.personal.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>

        <h3>User Shared</h3>
        <ul>
          {sessionsState.userShared.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>

        <h3>Group Shared</h3>
        <ul>
          {sessionsState.groupShared.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>

      <h2>Practices</h2>
      <div>
        <h3>Personal</h3>
        <ul>
          {practicesState.personal.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>

        <h3>User Shared</h3>
        <ul>
          {practicesState.userShared.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>

        <h3>Group Shared</h3>
        <ul>
          {practicesState.groupShared.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>

      <h2>Game Tactics</h2>
      <div>
        <h3>Personal</h3>
        <ul>
          {tacticsState.personal.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>

        <h3>User Shared</h3>
        <ul>
          {tacticsState.userShared.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>

        <h3>Group Shared</h3>
        <ul>
          {tacticsState.groupShared.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
