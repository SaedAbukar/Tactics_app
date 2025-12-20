import React, { useEffect } from "react";
import { observer } from "mobx-react-lite"; // 1. Wrap component in observer
import { useAuth } from "../../context/Auth/AuthContext";
import { useExercises } from "../../context/ExercisesProvider"; // 2. Import Exercises Context
import "./Profile.css";

const Profile: React.FC = observer(() => {
  const { user, logout } = useAuth();

  // 3. Get the ViewModel
  const { exercisesViewModel } = useExercises();

  // 4. Load data when profile mounts (to ensure stats are fresh)
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 5. Calculate stats dynamically from the ViewModel
  // We typically count "Personal" items as the user's created content
  const sessionCount = exercisesViewModel.sessionsState.personal.length;
  const practiceCount = exercisesViewModel.practicesState.personal.length;
  const tacticCount = exercisesViewModel.tacticsState.personal.length;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* --- Header Section --- */}
        <div className="profile-header">
          <div className="avatar-circle">{getInitials(user.email)}</div>
          <h2 className="profile-name">{user.name || "User"}</h2>
          <p className="profile-email">{user.email}</p>
          <span className={`role-badge ${user.role.toLowerCase()}`}>
            {user.role}
          </span>
        </div>

        {/* --- Details Grid --- */}
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">Member Since</span>
            <span className="value">{formatDate(user.createdAt)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Last Login</span>
            <span className="value">{formatDate(user.lastLogin)}</span>
          </div>
        </div>

        {/* --- Stats Section (Powered by ViewModel) --- */}
        <div className="profile-stats">
          <div className="stat-box">
            {exercisesViewModel.isLoading ? (
              <span className="stat-loading">...</span>
            ) : (
              <span className="stat-count">{sessionCount}</span>
            )}
            <span className="stat-label">Sessions</span>
          </div>
          <div className="stat-box">
            {exercisesViewModel.isLoading ? (
              <span className="stat-loading">...</span>
            ) : (
              <span className="stat-count">{practiceCount}</span>
            )}
            <span className="stat-label">Practices</span>
          </div>
          <div className="stat-box">
            {exercisesViewModel.isLoading ? (
              <span className="stat-loading">...</span>
            ) : (
              <span className="stat-count">{tacticCount}</span>
            )}
            <span className="stat-label">Tactics</span>
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="profile-actions">
          {/* <button className="btn secondary">Edit Profile</button> */}
          <button onClick={logout} className="btn danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
});

export default Profile;
