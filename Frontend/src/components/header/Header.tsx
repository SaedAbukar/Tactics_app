import { NavLink } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/Auth/AuthContext";
import { useTheme } from "../../context/ThemeContext"; // 1. Import Theme Context
import "./Header.css";

export default function Header() {
  const { t } = useTranslation("header");
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // 2. Get theme state

  const activeStyle = "active-link";

  return (
    <header className="header">
      {/* Logo Area */}
      <NavLink
        to="/"
        className={({ isActive }) => `logo-link ${isActive ? activeStyle : ""}`}
      >
        {t("appName")}
      </NavLink>

      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeStyle : "")}
        >
          {t("homeLink")}
        </NavLink>

        {user ? (
          <>
            <NavLink
              to="/exercises"
              className={({ isActive }) => (isActive ? activeStyle : "")}
            >
              Exercises
            </NavLink>
            <NavLink
              to="/tacticalEditor"
              className={({ isActive }) => (isActive ? activeStyle : "")}
            >
              {t("tacticalBoardLink")}
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? activeStyle : "")}
            >
              {t("profile")}
            </NavLink>

            <span className="user-email">{user.email}</span>

            <button onClick={logout} className="logout-btn">
              {t("logout")}
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? activeStyle : "")}
          >
            {t("login")}
          </NavLink>
        )}

        {/* Separator */}
        <div className="nav-separator" />

        {/* 3. Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="icon-btn theme-toggle"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <LanguageSwitcher />
      </nav>
    </header>
  );
}
