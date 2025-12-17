import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import { AuthProvider } from "./context/Auth/AuthContext.tsx";
import { ExercisesProvider } from "./context/ExercisesProvider.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <ThemeProvider>
          <ExercisesProvider>
            <App />
          </ExercisesProvider>
        </ThemeProvider>
      </AuthProvider>
    </Suspense>
  </StrictMode>
);
