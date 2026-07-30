import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import TiltCard from "../components/TiltCard";
import SocialLoginButtons from "../components/SocialLoginButtons";
import toast from "react-hot-toast";

const LoginPage = () => {
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

  const onSubmit = async (data) => {
    const success = await login({
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
    });
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleGoogle = async () => {
    const success = await loginWithGoogle();
    if (success) navigate("/dashboard");
  };

  const handleFacebook = async () => {
    const success = await loginWithFacebook();
    if (success) navigate("/dashboard");
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Password reset instructions sent to your email!");
    setShowForgotModal(false);
    setResetEmail("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative z-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side - Animated Hero Section (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 space-y-8 hidden lg:block pr-6"
        >
          {/* Brand Logo & Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold backdrop-blur-md glow-primary">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span>Next-Gen Enterprise Auth System</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
            Secure Access to Your <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
            Experience ultra-fast 1-hour JWT security, real-time metrics, and sleek dark glassmorphism designed for elite engineering teams.
          </p>

          {/* Animated Feature Grid Cards */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-sm">JWT Security</h3>
              <p className="text-xs text-gray-400">Strict 1-hour access token rotation with refresh protection.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-sm">60FPS Visuals</h3>
              <p className="text-xs text-gray-400">Ultra-smooth particle canvas background and 3D card tilt.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-sm">OAuth 2.0</h3>
              <p className="text-xs text-gray-400">Instant Google & Facebook single sign-on integration.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Glass Card (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 w-full"
        >
          <TiltCard>
            <div className="glass-card rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
              
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                <p className="text-sm text-gray-400">Sign in to continue to your account</p>
              </div>

              {/* Social Login Buttons */}
              <SocialLoginButtons
                onGoogleLogin={handleGoogle}
                onFacebookLogin={handleFacebook}
                loading={isLoggingIn}
              />

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-white/10" />
                <span className="absolute px-3 bg-[#09090b]/80 text-xs text-gray-400 uppercase tracking-wider backdrop-blur-md rounded-full border border-white/10">
                  Or email
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Username or Email Input */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Username or Email</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="admin or name@example.com"
                      {...register("usernameOrEmail", { required: "Username or email is required" })}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm placeholder-gray-500"
                    />
                  </div>
                  {errors.usernameOrEmail && (
                    <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-red-400">
                      {errors.usernameOrEmail.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
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
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-red-400">
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-white/5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer">
                    Remember me on this device
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoggingIn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full shimmer-btn py-3.5 rounded-xl text-white font-semibold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

              </form>

              {/* Footer Link */}
              <div className="text-center pt-2 text-xs text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
                  Create Account
                </Link>
              </div>

            </div>
          </TiltCard>
        </motion.div>

      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
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
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="yourname@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                />
                <button
                  type="submit"
                  className="w-full shimmer-btn py-3 rounded-xl text-white font-semibold text-sm shadow-lg"
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
