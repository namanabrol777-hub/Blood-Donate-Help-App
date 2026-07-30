import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Home, ArrowLeft } from "lucide-react";
import TiltCard from "../components/TiltCard";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10">
      <TiltCard className="max-w-md w-full">
        <div className="glass-card rounded-3xl p-8 text-center space-y-6 border border-white/15 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl shimmer-btn mx-auto flex items-center justify-center text-white shadow-xl glow-primary">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>

          <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Page Not Found</h2>
            <p className="text-xs text-gray-400">
              The page you are searching for does not exist or has been relocated within the system.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/dashboard"
              className="w-full py-3 px-6 shimmer-btn rounded-xl text-white font-semibold text-sm shadow-xl inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </TiltCard>
    </div>
  );
};

export default NotFoundPage;
