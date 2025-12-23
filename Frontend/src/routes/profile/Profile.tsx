import React, { useEffect, useState } from "react"; // Added useState
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/Auth/AuthContext";
import { useExercises } from "../../context/ExercisesProvider";
import { EditProfileModal } from "./components/EditProfileModal"; // Import your new modal
import "./Profile.css";

const Profile: React.FC = observer(() => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation(["profile", "common"]);
  const { exercisesViewModel } = useExercises();

  // 1. Local state to manage modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        <div className="profile-header">
          <div className="avatar-circle">{getInitials(user.email)}</div>
          <span className={`role-badge ${user.role.toLowerCase()}`}>
            {user.email}
          </span>
        </div>

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

        <div className="profile-actions">
          {/* 2. Toggle modal state on click */}
          <button
            className="btn secondary"
            onClick={() => setIsEditModalOpen(true)}
          >
            {t("actions.edit", { defaultValue: "Edit Profile" })}
          </button>

          <button onClick={logout} className="btn danger">
            {t("actions.logout", { defaultValue: "Logout" })}
          </button>
        </div>
      </div>

      {/* 3. Conditionally render the Modal */}
      {isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
});

export default Profile;
