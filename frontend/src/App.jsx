import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./stores/useAuthStore";
import AnimatedBackground from "./components/AnimatedBackground";
import CustomCursor from "./components/CustomCursor";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
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
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center shadow-2xl animate-pulse">
          <Loader className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase animate-pulse">
          Initializing Auth Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white relative font-sans selection:bg-indigo-500 selection:text-white">
      {/* 60FPS Canvas Background & Custom Desktop Cursor */}
      <AnimatedBackground />
      <CustomCursor />

      {/* Animated Route Container */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          <Route
            path="/"
            element={
              authUser ? (
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              authUser ? (
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              !authUser ? (
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              ) : (
                <Navigate to="/dashboard" replace />
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
                <Navigate to="/dashboard" replace />
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
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              authUser ? (
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              ) : (
                <Navigate to="/login" replace />
              )
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