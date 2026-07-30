import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
  Droplet,
  ArrowRight,
  ShieldCheck,
  Building2,
  Activity,
  Ambulance,
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
      toast.success("Welcome back to BloodLink ❤️");
      navigate("/dashboard");
    }
  };

  const handleGoogle = async () => {
    const success = await loginWithGoogle();
    if (success) {
      toast.success("Signed in via Google to BloodLink ❤️");
      navigate("/dashboard");
    }
  };

  const handleFacebook = async () => {
    const success = await loginWithFacebook();
    if (success) {
      toast.success("Signed in via Facebook to BloodLink ❤️");
      navigate("/dashboard");
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative z-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side - BloodLink Hero Section (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 space-y-8 hidden lg:block pr-6"
        >
          {/* Medical Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-semibold backdrop-blur-md glow-medical-red">
            <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
            <span>AI-Powered Blood Shortage Management Platform</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
            Donate Blood. <br />
            Save Lives. <br />
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Every Second Matters.
            </span>
          </h1>

          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
            Join thousands of donors helping save lives across the country with real-time blood shortage reporting and AI emergency dispatch.
          </p>

          {/* Animated Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5 glass-card-hover"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                  <Droplet className="w-5 h-5 fill-red-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">25,000+</h3>
                  <p className="text-xs text-gray-400">Registered Donors</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5 glass-card-hover"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">800+</h3>
                  <p className="text-xs text-gray-400">Connected Hospitals</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5 glass-card-hover"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">50,000+</h3>
                  <p className="text-xs text-gray-400">Lives Saved</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5 glass-card-hover"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">24/7</h3>
                  <p className="text-xs text-gray-400">Emergency Dispatch</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - BloodLink Glass Login Card (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 w-full"
        >
          <TiltCard>
            <div className="glass-card rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden border border-white/15">
              
              {/* Header Logo */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl shimmer-btn-red mx-auto flex items-center justify-center text-white shadow-xl glow-medical-red">
                  <Droplet className="w-6 h-6 fill-white" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">BloodLink Sign In</h2>
                <p className="text-xs text-gray-400">Access your donor dashboard & emergency alerts</p>
              </div>

              {/* Social Logins */}
              <SocialLoginButtons
                onGoogleLogin={handleGoogle}
                onFacebookLogin={handleFacebook}
                loading={isLoggingIn}
              />

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-white/10" />
                <span className="absolute px-3 bg-[#09090b]/80 text-xs text-gray-400 uppercase tracking-wider backdrop-blur-md rounded-full border border-white/10">
                  Or with email
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Username or Email */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Email or Username</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="donor@bloodlink.org"
                      {...register("usernameOrEmail", { required: "Username or email is required" })}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm placeholder-gray-500"
                    />
                  </div>
                  {errors.usernameOrEmail && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400">
                      {errors.usernameOrEmail.message}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
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
                  {errors.password && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400">
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-white/5 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer">
                    Remember me on this device
                  </label>
                </div>

                {/* Login Button */}
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
                      <span>Sign In to BloodLink</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

              </form>

              {/* Signup Link */}
              <div className="text-center pt-2 text-xs text-gray-400">
                Not a registered donor?{" "}
                <Link to="/signup" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4">
                  Register as a Donor
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
              <h3 className="text-xl font-bold text-white">Reset BloodLink Password</h3>
              <p className="text-xs text-gray-400">
                Enter your registered donor email address to receive password recovery instructions.
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="donor@bloodlink.org"
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
