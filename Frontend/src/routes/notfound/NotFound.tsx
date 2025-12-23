import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../home/Home.css"; // Ensure this imports the CSS you provided

const NotFound: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="home-container">
      <div className="hero-section" style={{ marginTop: "10vh" }}>
        <div className="hero-content">
          {/* Reuse Hero Title Style for 404 */}
          <h1
            className="hero-title"
            style={{ fontSize: "4rem", marginBottom: "0.5rem" }}
          >
            404
          </h1>

          <h2 className="hero-title" style={{ fontSize: "1.5rem" }}>
            {t("errors.404", "Not Found")}
          </h2>

          <p className="hero-description">
            {t(
              "errors.pageNotFound",
              "Oops! The page you are looking for does not exist."
            )}
          </p>

          <div className="cta-group">
            <Link to="/" className="hero-btn primary">
              {t("goHome", "Go Back Home")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
