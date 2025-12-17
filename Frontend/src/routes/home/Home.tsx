import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext"; // Adjust path if needed
import "./Home.css";

export default function Home() {
  const { t, i18n } = useTranslation(["home"]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    i18n.loadNamespaces("home");
  }, [i18n]);

  return (
    <div className="home-container">
      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {t("title", { ns: "home", defaultValue: "Master Your Tactics" })}
          </h1>
          <p className="hero-description">
            {t("description", {
              ns: "home",
              defaultValue:
                "The ultimate platform for coaches to plan sessions, design practices, and share game tactics.",
            })}
          </p>

          <div className="cta-group">
            {user ? (
              <button
                className="hero-btn primary"
                onClick={() => navigate("/exercises")}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  className="hero-btn primary"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </button>
                <button
                  className="hero-btn secondary"
                  onClick={() => navigate("/login")} // Or a separate signup route
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- FEATURE / STATS CARDS --- */}
      <section className="features-section">
        <div className="features-grid">
          {/* Demo Card: Shows your Greeting Translation */}
          <div className="feature-card">
            <div className="icon-wrapper">👋</div>
            <h3>Welcome</h3>
            <p>
              {t("greeting", { name: user?.email?.split("@")[0] || "Guest" })}
            </p>
          </div>

          {/* Demo Card: Shows your Pluralization Translation */}
          <div className="feature-card">
            <div className="icon-wrapper">📋</div>
            <h3>Session Stats</h3>
            <p>{t("items", { count: 1 })}</p>
            <p className="sub-text">
              {t("items", { count: 5 })} ready to review
            </p>
          </div>

          {/* Static Card: Marketing filler */}
          <div className="feature-card">
            <div className="icon-wrapper">🚀</div>
            <h3>Performance</h3>
            <p>
              Optimize your team's workflow with real-time collaboration tools.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
