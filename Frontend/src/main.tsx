import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import { AuthProvider } from "./context/AuthContext"; // import AuthProvider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </StrictMode>
);
