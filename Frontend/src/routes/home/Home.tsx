import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext";
import "./Home.css";

export default function Home() {
  const { t, i18n } = useTranslation(["home"]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    i18n.loadNamespaces("home");
  }, [i18n]);

  const handleCardClick = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  // --- Dynamic Copy Logic with Translations ---
  const heroTitle = user
    ? t("hero.welcome_back", {
        name: user.email?.split("@")[0] || "Coach",
        defaultValue: "Good to see you, {{name}}",
      })
    : t("hero.elevate_title", {
        defaultValue: "Bring Your Tactics to Life",
      });

  const heroDescription = user
    ? t("hero.ready_desc", {
        defaultValue:
          "Your pitch is waiting. Jump back into your dashboard or sketch out a new winning formation right now.",
      })
    : t("hero.logged_out_desc", {
        defaultValue:
          "Stop struggling with messy whiteboards. Plan professional sessions, animate your best plays, and share your vision with the team easily.",
      });

  return (
    <div className="home-container">
      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{heroTitle}</h1>
          <p className="hero-description">{heroDescription}</p>

          <div className="cta-group">
            {user ? (
              <button
                className="hero-btn primary"
                onClick={() => navigate("/exercises")}
              >
                {t("hero.cta_dashboard", { defaultValue: "Open Dashboard" })}
              </button>
            ) : (
              <>
                <button
                  className="hero-btn primary"
                  onClick={() => navigate("/login")}
                >
                  {t("hero.cta_start", { defaultValue: "Start for Free" })}
                </button>
                <button
                  className="hero-btn secondary"
                  onClick={() => navigate("/login")}
                >
                  {t("hero.cta_login", { defaultValue: "Sign In" })}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- FEATURE / NAVIGATION CARDS --- */}
      <section className="features-section">
        <div className="features-grid">
          {/* Card 1: Tactical Editor */}
          <div
            className="feature-card clickable"
            onClick={() => handleCardClick("/tacticalEditor")}
          >
            <div className="icon-wrapper">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3>
              {t("cards.tactical_title", { defaultValue: "Tactical Board" })}
            </h3>
            <p>
              {t("cards.tactical_desc", {
                defaultValue:
                  "Draw it like you see it. Create animated set-pieces and match scenarios on a realistic pitch.",
              })}
            </p>
          </div>

          {/* Card 2: Session Planner */}
          <div
            className="feature-card clickable"
            onClick={() => handleCardClick("/exercises")}
          >
            <div className="icon-wrapper">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M9 14h6" />
                <path d="M9 18h6" />
                <path d="M9 10h6" />
              </svg>
            </div>
            <h3>
              {t("cards.session_title", { defaultValue: "Session Planner" })}
            </h3>
            <p>
              {t("cards.session_desc", {
                defaultValue:
                  "Ditch the loose papers. Build your drill library and organize full training weeks in one secure place.",
              })}
            </p>
            {user && (
              <p className="sub-text">
                {t("cards.session_sub", {
                  defaultValue: "View saved sessions",
                })}
              </p>
            )}
          </div>

          {/* Card 3: Profile */}
          <div
            className="feature-card clickable"
            onClick={() => handleCardClick("/profile")}
          >
            <div className="icon-wrapper">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3>
              {t("cards.profile_title", { defaultValue: "Coach Profile" })}
            </h3>
            <p>
              {user
                ? t("cards.profile_desc_user", {
                    defaultValue: "Update your team settings and preferences.",
                  })
                : t("cards.profile_desc_guest", {
                    defaultValue:
                      "Create an account to save your work and unlock pro features.",
                  })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
