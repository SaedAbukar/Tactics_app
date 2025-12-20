import { useState } from "react";
import { NavLink } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/Auth/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import "./Header.css";

export default function Header() {
  const { t } = useTranslation("header");
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeStyle = "active-link";

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-content">
        {/* --- Logo Area --- */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `logo-link ${isActive ? activeStyle : ""}`
          }
          onClick={closeMenu}
        >
          {t("appName")}
        </NavLink>

        {/* --- Mobile Menu Toggle Button (Visible only on mobile) --- */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
        </button>

        {/* --- Navigation Links --- */}
        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeStyle : "")}
            onClick={closeMenu}
          >
            {t("homeLink")}
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/exercises"
                className={({ isActive }) => (isActive ? activeStyle : "")}
                onClick={closeMenu}
              >
                {t("exercises")}
              </NavLink>
              <NavLink
                to="/tacticalEditor"
                className={({ isActive }) => (isActive ? activeStyle : "")}
                onClick={closeMenu}
              >
                {t("tacticalBoardLink")}
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? activeStyle : "")}
                onClick={closeMenu}
              >
                {t("profile")}
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="logout-btn"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? activeStyle : "")}
              onClick={closeMenu}
            >
              {t("login")}
            </NavLink>
          )}

          {/* Separator */}
          <div className="nav-separator" />

          {/* Controls Container */}
          <div className="nav-controls">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="icon-btn theme-toggle"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </nav>

        {/* Backdrop for mobile */}
        {isMenuOpen && <div className="mobile-backdrop" onClick={closeMenu} />}
      </div>
    </header>
  );
}
