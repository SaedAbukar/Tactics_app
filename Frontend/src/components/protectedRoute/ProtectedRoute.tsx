import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render nested routes
};

export default ProtectedRoute;
