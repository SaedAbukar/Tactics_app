import { useState } from "react";
import { NavLink } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/Auth/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import "./Header.css";

export default function Header() {
  const { t } = useTranslation("header");
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeStyle = "active-link";
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-content">
        {/* --- Logo Area --- */}
        <NavLink to="/" className="logo-link" onClick={closeMenu}>
          <img
            src={
              theme === "dark"
                ? "/images/tacticflow-dark.png"
                : "/images/tacticflow-light.png"
            }
            alt={t("appName")}
            className="app-logo"
          />
          <span className="logo-text">{t("appName")}</span>
        </NavLink>

        {/* --- Mobile Menu Toggle --- */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* --- Navigation --- */}
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

          <div className="nav-separator" />

          {/* Controls */}
          <div className="nav-controls">
            <LanguageSwitcher />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="icon-btn theme-toggle"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </nav>

        {isMenuOpen && <div className="mobile-backdrop" onClick={closeMenu} />}
      </div>
    </header>
  );
}
