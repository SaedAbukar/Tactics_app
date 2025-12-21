import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next"; // 1. Import hook
import { useAuth } from "../../context/Auth/AuthContext";
import { useExercises } from "../../context/ExercisesProvider";
import "./Profile.css";

const Profile: React.FC = observer(() => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation(["profile", "common"]); // 2. Init hook
  const { exercisesViewModel } = useExercises();

  // Load data when profile mounts
  useEffect(() => {
    if (user) {
      exercisesViewModel.loadData();
    }
  }, [user, exercisesViewModel]);

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  // 3. Updated date formatter to use current i18n language
  const formatDate = (dateString?: string) => {
    if (!dateString) return t("na", { defaultValue: "N/A" });
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sessionCount = exercisesViewModel.sessionsState.personal.length;
  const practiceCount = exercisesViewModel.practicesState.personal.length;
  const tacticCount = exercisesViewModel.tacticsState.personal.length;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* --- Header Section --- */}
        <div className="profile-header">
          <div className="avatar-circle">{getInitials(user.email)}</div>
          <span className={`role-badge ${user.role.toLowerCase()}`}>
            {user.email}
          </span>
        </div>

        {/* --- Details Grid --- */}
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">
              {t("memberSince", { defaultValue: "Member Since" })}
            </span>
            <span className="value">{formatDate(user.createdAt)}</span>
          </div>
          <div className="detail-item">
            <span className="label">
              {t("lastLogin", { defaultValue: "Last Login" })}
            </span>
            <span className="value">{formatDate(user.lastLogin)}</span>
          </div>
        </div>

        {/* --- Stats Section --- */}
        <div className="profile-stats">
          <div className="stat-box">
            {exercisesViewModel.isLoading ? (
              <span className="stat-loading">...</span>
            ) : (
              <span className="stat-count">{sessionCount}</span>
            )}
            <span className="stat-label">
              {t("stats.sessions", { defaultValue: "Sessions" })}
            </span>
          </div>
          <div className="stat-box">
            {exercisesViewModel.isLoading ? (
              <span className="stat-loading">...</span>
            ) : (
              <span className="stat-count">{practiceCount}</span>
            )}
            <span className="stat-label">
              {t("stats.practices", { defaultValue: "Practices" })}
            </span>
          </div>
          <div className="stat-box">
            {exercisesViewModel.isLoading ? (
              <span className="stat-loading">...</span>
            ) : (
              <span className="stat-count">{tacticCount}</span>
            )}
            <span className="stat-label">
              {t("stats.tactics", { defaultValue: "Tactics" })}
            </span>
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="profile-actions">
          {/* <button className="btn secondary">
            {t("actions.edit", { defaultValue: "Edit Profile" })}
          </button> */}
          <button onClick={logout} className="btn danger">
            {t("actions.logout", { defaultValue: "Logout" })}
          </button>
        </div>
      </div>
    </div>
  );
});

export default Profile;
