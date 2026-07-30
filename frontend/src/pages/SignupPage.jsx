import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import confetti from "canvas-confetti";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
  Droplet,
  ArrowRight,
  Stethoscope,
  Building2,
  CheckCircle,
} from "lucide-react";
import { useAuthStore, getDashboardRoute } from "../stores/useAuthStore";
import TiltCard from "../components/TiltCard";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import SocialLoginButtons from "../components/SocialLoginButtons";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("DONOR");
  const { signup, loginWithGoogle, loginWithFacebook, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bloodGroup: "O+",
    },
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    // Explicit Guard: Prevent Admin creation via public signup
    if (selectedRole === "ADMIN") {
      toast.error("Admin accounts cannot be created via public registration.");
      return;
    }

    const res = await signup({
      username: data.username,
      email: data.email,
      password: data.password,
      role: selectedRole,
      bloodGroup: data.bloodGroup,
      hospitalName: data.hospitalName,
      licenseNumber: data.licenseNumber,
      bankName: data.bankName,
    });

    if (res.success && res.user) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      const targetRoute = getDashboardRoute(res.user.role);
      toast.success(`Registered successfully as ${res.user.role}! ❤️`);
      navigate(targetRoute);
    }
  };

  const handleGoogle = async () => {
    const res = await loginWithGoogle(selectedRole);
    if (res.success && res.user) {
      const targetRoute = getDashboardRoute(res.user.role);
      navigate(targetRoute);
    }
  };

  const handleFacebook = async () => {
    const res = await loginWithFacebook(selectedRole);
    if (res.success && res.user) {
      const targetRoute = getDashboardRoute(res.user.role);
      navigate(targetRoute);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative z-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 space-y-6 hidden lg:block pr-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-semibold backdrop-blur-md glow-medical-red">
            <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Public Self-Registration (Donor | Doctor | Blood Bank)</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
            Create Account <br />
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              As a {selectedRole === "DONOR" ? "Blood Donor" : selectedRole === "DOCTOR" ? "Licensed Doctor" : "Blood Bank Center"}
            </span>
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed">
            Register your specialized account to connect directly with emergency blood shortage dispatchers and regional networks.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Self-registration available for Donors, Doctors & Blood Banks",
              "Super Admin accounts are strictly protected & database-seeded",
              "Bcrypt 12-round salted encryption & 1-hour JWT security",
              "Instant verification & role-based access control (RBAC)",
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Signup Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-6 w-full"
        >
          <TiltCard>
            <div className="glass-card rounded-3xl p-8 space-y-4 shadow-2xl relative overflow-hidden border border-white/15">
              
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
                <p className="text-xs text-gray-400">Select allowed role to register</p>
              </div>

              {/* Allowed Role Tabs: DONOR, DOCTOR, BLOOD_BANK (NO ADMIN) */}
              <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
                {[
                  { id: "DONOR", label: "❤️ Donor", icon: Droplet },
                  { id: "DOCTOR", label: "🩺 Doctor", icon: Stethoscope },
                  { id: "BLOOD_BANK", label: "🏥 Blood Bank", icon: Building2 },
                ].map((tab) => {
                  const isActive = selectedRole === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedRole(tab.id)}
                      className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "shimmer-btn-red text-white shadow-md"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <SocialLoginButtons
                onGoogleLogin={handleGoogle}
                onFacebookLogin={handleFacebook}
                loading={isSigningUp}
              />

              <div className="relative flex items-center justify-center my-1">
                <div className="w-full border-t border-white/10" />
                <span className="absolute px-3 bg-[#09090b]/80 text-[10px] text-gray-400 uppercase tracking-wider backdrop-blur-md rounded-full border border-white/10">
                  Or register credentials
                </span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Username</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="username"
                        {...register("username", { required: "Username is required" })}
                        className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-gray-500"
                      />
                    </div>
                    {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
                  </div>

                  {selectedRole === "DONOR" && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-300">Blood Group</label>
                      <select
                        {...register("bloodGroup")}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-[#09090b]"
                      >
                        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                          <option key={bg} value={bg}>{bg} Blood Group</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedRole === "DOCTOR" && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-300">Medical License No.</label>
                      <input
                        type="text"
                        placeholder="MD-88392"
                        {...register("licenseNumber")}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  )}

                  {selectedRole === "BLOOD_BANK" && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-300">Blood Bank Name</label>
                      <input
                        type="text"
                        placeholder="Metropolitan Blood Bank"
                        {...register("bankName")}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  )}
                </div>

                {selectedRole === "DOCTOR" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Hospital Name</label>
                    <input
                      type="text"
                      placeholder="St. Jude General Hospital"
                      {...register("hospitalName")}
                      className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="user@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-gray-500"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                      })}
                      className="w-full glass-input pl-10 pr-10 py-2.5 rounded-xl text-sm placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrengthMeter password={passwordValue} />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSigningUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full shimmer-btn-red py-3 rounded-xl text-white font-semibold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSigningUp ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Register as {selectedRole}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

              </form>

              <div className="text-center pt-1 text-xs text-gray-400">
                Already registered?{" "}
                <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4">
                  Sign In
                </Link>
              </div>

            </div>
          </TiltCard>
        </motion.div>

      </div>
    </div>
  );
};

export default SignupPage;
