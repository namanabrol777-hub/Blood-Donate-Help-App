import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useAuthStore, getDashboardRoute } from "./stores/useAuthStore";
import AnimatedBackground from "./components/AnimatedBackground";
import CustomCursor from "./components/CustomCursor";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import BloodBankDashboard from "./pages/BloodBankDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white space-y-4">
        <AnimatedBackground />
        <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/50 flex items-center justify-center shadow-2xl animate-pulse">
          <Loader className="w-6 h-6 text-red-400 animate-spin" />
        </div>
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase animate-pulse">
          Initializing BloodLink RBAC Session...
        </p>
      </div>
    );
  }

  const defaultRoleRoute = authUser ? getDashboardRoute(authUser.role) : "/login";

  return (
    <div className="min-h-screen bg-[#09090b] text-white relative font-sans selection:bg-red-600 selection:text-white">
      {/* 60FPS ECG Heartbeat & Blood Cell Canvas + Custom Cursor */}
      <AnimatedBackground />
      <CustomCursor />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          <Route
            path="/"
            element={authUser ? <Navigate to={defaultRoleRoute} replace /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/dashboard"
            element={authUser ? <Navigate to={defaultRoleRoute} replace /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={
              !authUser ? (
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              ) : (
                <Navigate to={defaultRoleRoute} replace />
              )
            }
          />

          <Route
            path="/signup"
            element={
              !authUser ? (
                <PageTransition>
                  <SignupPage />
                </PageTransition>
              ) : (
                <Navigate to={defaultRoleRoute} replace />
              )
            }
          />

          <Route
            path="/register"
            element={
              !authUser ? (
                <PageTransition>
                  <SignupPage />
                </PageTransition>
              ) : (
                <Navigate to={defaultRoleRoute} replace />
              )
            }
          />

          {/* Role 1 — Super Admin Panel */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Role 2 — Doctor Panel */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <PageTransition>
                  <DoctorDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Role 3 — Blood Bank Panel */}
          <Route
            path="/bloodbank/dashboard"
            element={
              <ProtectedRoute allowedRoles={["BLOOD_BANK"]}>
                <PageTransition>
                  <BloodBankDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Role 4 — Donor Panel */}
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["DONOR"]}>
                <PageTransition>
                  <DonorDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR", "BLOOD_BANK", "DONOR"]}>
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />

        </Routes>
      </AnimatePresence>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15, 15, 20, 0.9)",
            color: "#fff",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default App;