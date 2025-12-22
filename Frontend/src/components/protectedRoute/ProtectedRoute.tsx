import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext";
// Adjust this import path if your LoadingSpinner is elsewhere
import { LoadingSpinner } from "../ui/LoadingSpinner";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  // FIX: Wait for session check to finish before redirecting
  if (loading) {
    return <LoadingSpinner fullScreen={true} message="Verifying session..." />;
  }

  // If loading is done and we still have no user, THEN redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
