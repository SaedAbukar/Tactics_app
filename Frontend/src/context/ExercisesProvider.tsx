import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next"; // 1. Import hook
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { ExercisesContainer } from "../features/exercises/di/Container";
import { useAuth } from "../context/Auth/AuthContext";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

// 1. The Context
const ExercisesContext = createContext<ExercisesContainer | null>(null);

// 2. The Hook
export const useExercises = (): ExercisesContainer => {
  const container = useContext(ExercisesContext);
  if (!container) {
    throw new Error("useExercises must be used within ExercisesProvider");
  }
  return container;
};

// 3. The Provider
export const ExercisesProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation("common"); // 2. Initialize translation hook
  const { user } = useAuth();
  const { request } = useFetchWithAuth();

  const [container, setContainer] = useState<ExercisesContainer | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // --- AUTH GLUE CODE ---
  const requestRef = useRef(request);
  requestRef.current = request;

  useEffect(() => {
    // If logged out, clear container and do nothing (let children render Login page)
    if (!user) {
      setContainer(null);
      return;
    }

    let isMounted = true;

    const initContainer = async () => {
      try {
        const stableRequestProxy = <T,>(url: string, options?: RequestInit) => {
          return requestRef.current<T>(url, options);
        };

        const instance = new ExercisesContainer(stableRequestProxy);

        if (isMounted) {
          setContainer(instance);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error("Failed to initialize Exercises container:", err);
        }
      }
    };

    initContainer();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // --- UI RENDER ---

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        {/* 3. Use translation for error title */}
        <h3>{t("errors.initFailed", "Initialization Failed")}</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  // FIX: Only show loading if User exists (Logged In) but Container is not ready.
  // If User is null (Logged Out), isLoading is false, so we render children (Login Page).
  const isLoading = user && !container;

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        // 4. Use translation for loading message
        message={t("loading.initWorkspace", "Initializing Workspace...")}
      />
    );
  }

  return (
    <ExercisesContext.Provider value={container}>
      {children}
    </ExercisesContext.Provider>
  );
};

export default ExercisesProvider;
