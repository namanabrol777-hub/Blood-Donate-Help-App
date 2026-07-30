import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Crown,
  Stethoscope,
  Building2,
  Heart,
  Droplet,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Dna,
  X,
} from "lucide-react";
import { useAuthStore, getDashboardRoute } from "../stores/useAuthStore";
import TiltCard from "../components/TiltCard";
import SocialLoginButtons from "../components/SocialLoginButtons";
import toast from "react-hot-toast";

const rolesData = [
  {
    id: "ADMIN",
    title: "ADMIN",
    icon: Shield,
    badgeIcon: Crown,
    color: "from-indigo-600 to-purple-600",
    borderColor: "border-indigo-500/50",
    glowClass: "glow-biotech-purple border-indigo-400",
    textColor: "text-indigo-400",
    desc: "Platform Governance & AI Predictions",
  },
  {
    id: "DOCTOR",
    title: "DOCTOR",
    icon: Stethoscope,
    badgeIcon: Sparkles,
    color: "from-blue-600 to-cyan-500",
    borderColor: "border-blue-500/50",
    glowClass: "glow-biotech-blue border-blue-400",
    textColor: "text-blue-400",
    desc: "Manage Patients & Emergency Blood Requests",
  },
  {
    id: "BLOOD_BANK",
    title: "BLOOD BANK",
    icon: Building2,
    badgeIcon: Droplet,
    color: "from-red-600 to-rose-600",
    borderColor: "border-red-500/50",
    glowClass: "glow-biotech-red border-red-400",
    textColor: "text-red-400",
    desc: "Manage Blood Unit Inventory & Dispatch",
  },
  {
    id: "DONOR",
    title: "DONOR",
    icon: Heart,
    badgeIcon: Droplet,
    color: "from-rose-500 to-pink-600",
    borderColor: "border-rose-500/50",
    glowClass: "glow-biotech-cyan border-rose-400",
    textColor: "text-rose-400",
    desc: "Donate Blood & Track Lifesaving Impact",
  },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const { login, loginWithGoogle, loginWithFacebook, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const onSubmit = async (data) => {
    if (!selectedRole) {
      toast.error("Please select your Portal Card first!");
      return;
    }

    const res = await login({
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
      role: selectedRole,
    });

    if (res.success && res.user) {
      const targetRoute = getDashboardRoute(res.user.role);
      toast.success(`Authenticated as ${res.user.role}! ❤️`);
      navigate(targetRoute);
    }
  };

  const handleGoogle = async () => {
    if (!selectedRole) {
      toast.error("Please select your Portal Card first!");
      return;
    }
    if (selectedRole === "ADMIN") {
      toast.error("Admin accounts cannot log in via social authentication.");
      return;
    }
    const res = await loginWithGoogle(selectedRole);
    if (res.success && res.user) {
      const targetRoute = getDashboardRoute(res.user.role);
      navigate(targetRoute);
    }
  };

  const handleFacebook = async () => {
    if (!selectedRole) {
      toast.error("Please select your Portal Card first!");
      return;
    }
    if (selectedRole === "ADMIN") {
      toast.error("Admin accounts cannot log in via social authentication.");
      return;
    }
    const res = await loginWithFacebook(selectedRole);
    if (res.success && res.user) {
      const targetRoute = getDashboardRoute(res.user.role);
      navigate(targetRoute);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your registered email");
      return;
    }
    toast.success("Password reset instructions sent to your email!");
    setShowForgotModal(false);
    setResetEmail("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative z-10 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-semibold backdrop-blur-md glow-biotech-red">
          <Dna className="w-4 h-4 text-red-500 animate-spin-slow" />
          <span>Biotechnology AI Emergency Operating System v4.0</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          BloodLink Command OS
        </h1>
        <p className="text-sm text-gray-300">
          Select your portal to initialize security matrix & sign in to your dashboard
        </p>
      </motion.div>

      {/* 4 Animated Glass Role Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {rolesData.map((role) => {
          const MainIcon = role.icon;
          const BadgeIcon = role.badgeIcon;
          const isSelected = selectedRole === role.id;

          return (
            <TiltCard key={role.id}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelect(role.id)}
                className={`glass-card rounded-3xl p-6 border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between h-60 ${
                  isSelected
                    ? `${role.glowClass} bg-white/10 shadow-2xl scale-[1.02]`
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-xl relative`}>
                    <MainIcon className="w-6 h-6" />
                    <BadgeIcon className="w-3.5 h-3.5 absolute -bottom-1 -right-1 fill-white text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                      <span>{role.title}</span>
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">{role.desc}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase ${role.textColor}`}>
                    {isSelected ? "Active Glow ●" : "Click to Select"}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? "translate-x-1 text-white" : "text-gray-500"}`} />
                </div>
              </motion.div>
            </TiltCard>
          );
        })}
      </div>

      {/* Expanding Form Card */}
      <AnimatePresence mode="wait">
        {selectedRole && (
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            <TiltCard>
              <div className="glass-card rounded-3xl p-8 space-y-6 shadow-2xl border border-white/20 relative backdrop-blur-2xl">
                
                <div className="text-center space-y-1">
                  <span className="px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-200 border border-white/10">
                    PORTAL ACTIVE: <span className="text-red-400 uppercase">{selectedRole}</span>
                  </span>
                  <h2 className="text-2xl font-bold text-white pt-2">Sign In to {selectedRole} Portal</h2>
                  <p className="text-xs text-gray-400">Authenticating against role context '{selectedRole}'</p>
                </div>

                {selectedRole !== "ADMIN" && (
                  <>
                    <SocialLoginButtons
                      onGoogleLogin={handleGoogle}
                      onFacebookLogin={handleFacebook}
                      loading={isLoggingIn}
                    />

                    <div className="relative flex items-center justify-center my-2">
                      <div className="w-full border-t border-white/10" />
                      <span className="absolute px-3 bg-[#05070d]/80 text-[10px] text-gray-400 uppercase tracking-wider backdrop-blur-md rounded-full border border-white/10">
                        Or credentials
                      </span>
                    </div>
                  </>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Email or Username</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="email@example.com"
                        {...register("usernameOrEmail", { required: "Username or email is required" })}
                        className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm placeholder-gray-500"
                      />
                    </div>
                    {errors.usernameOrEmail && (
                      <p className="text-xs text-red-400">{errors.usernameOrEmail.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password", { required: "Password is required" })}
                        className="w-full glass-input pl-10 pr-10 py-3 rounded-xl text-sm placeholder-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-700 bg-white/5 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer">
                        Remember session
                      </label>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoggingIn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full shimmer-btn-red py-3.5 rounded-xl text-white font-semibold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Initialize {selectedRole} Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                </form>

                {selectedRole !== "ADMIN" && (
                  <div className="text-center pt-2 text-xs text-gray-400">
                    Need an account?{" "}
                    <Link to="/signup" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4">
                      Create {selectedRole} Account
                    </Link>
                  </div>
                )}

              </div>
            </TiltCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full p-6 rounded-3xl space-y-4 border border-white/20 shadow-2xl relative"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              <p className="text-xs text-gray-400">
                Enter your registered email address to receive password recovery instructions.
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                />
                <button
                  type="submit"
                  className="w-full shimmer-btn-red py-3 rounded-xl text-white font-semibold text-sm shadow-lg"
                >
                  Send Reset Link
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
