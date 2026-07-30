import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore, getDashboardRoute } from "../stores/useAuthStore";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = authUser.role ? authUser.role.toUpperCase() : "DONOR";
    const normalizedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      toast.error(`403 Forbidden: Your role (${userRole}) cannot access this panel.`);
      const correctDashboard = getDashboardRoute(userRole);
      return <Navigate to={correctDashboard} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
