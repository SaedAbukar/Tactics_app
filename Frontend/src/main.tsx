import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import { AuthProvider } from "./context/Auth/AuthContext.tsx";
import { ExercisesProvider } from "./context/ExercisesProvider.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
// Import the new component
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Suspense fallback={<LoadingSpinner fullScreen={true} message="" />}>
          <ExercisesProvider>
            <App />
          </ExercisesProvider>
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
