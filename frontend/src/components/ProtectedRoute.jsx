import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore, getDashboardRoute } from "../stores/useAuthStore";
import { ShieldAlert } from "lucide-react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = (authUser.activeRole || authUser.role || "DONOR").toUpperCase();
  const formattedAllowed = allowedRoles.map((r) => r.toUpperCase());

  if (!formattedAllowed.includes(currentRole)) {
    const defaultRoute = getDashboardRoute(currentRole);
    return (
      <div className="min-h-screen bg-[#05070d] flex flex-col items-center justify-center text-white p-6 relative z-10 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500 glow-biotech-red shadow-2xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">403 Forbidden Access</h2>
        <p className="text-xs text-gray-400 max-w-md text-center leading-relaxed">
          Your active session role (<span className="text-red-400 font-bold">{currentRole}</span>) is not authorized to access this dashboard.
        </p>
        <Navigate to={defaultRoute} replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
