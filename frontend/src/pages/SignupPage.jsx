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
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import TiltCard from "../components/TiltCard";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import SocialLoginButtons from "../components/SocialLoginButtons";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    const success = await signup({
      username: data.username,
      email: data.email,
      password: data.password,
      bloodGroup: data.bloodGroup,
    });

    if (success) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      toast.success("Welcome to the BloodLink Lifesaving Network! ❤️");
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative z-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side - Lifesaving Pitch (6 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 space-y-6 hidden lg:block pr-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-semibold backdrop-blur-md glow-medical-red">
            <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Join 25,000+ Registered Life Savers</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
            Register as a <br />
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Blood Donor
            </span>
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed">
            Your single donation can save up to 3 lives. Connect directly with hospitals and emergency response centers in real-time.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Instant emergency blood shortage alerts",
              "Real-time hospital donor matching AI",
              "Encrypted profile & emergency contact protection",
              "Donor badges & lifesaving history tracking",
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

        {/* Right Side - BloodLink Signup Glass Card (6 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-6 w-full"
        >
          <TiltCard>
            <div className="glass-card rounded-3xl p-8 space-y-5 shadow-2xl relative overflow-hidden border border-white/15">
              
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-xl shimmer-btn-red mx-auto flex items-center justify-center text-white shadow-md glow-medical-red">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Become a BloodLink Donor</h2>
                <p className="text-xs text-gray-400">Enter your details to create your account</p>
              </div>

              <SocialLoginButtons
                onGoogleLogin={handleGoogle}
                onFacebookLogin={handleFacebook}
                loading={isSigningUp}
              />

              <div className="relative flex items-center justify-center my-2">
                <div className="w-full border-t border-white/10" />
                <span className="absolute px-3 bg-[#09090b]/80 text-xs text-gray-400 uppercase tracking-wider backdrop-blur-md rounded-full border border-white/10">
                  Or register with email
                </span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Username */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Username</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="john_donor"
                        {...register("username", { required: "Username is required" })}
                        className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-gray-500"
                      />
                    </div>
                    {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
                  </div>

                  {/* Blood Group Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Blood Group</label>
                    <div className="relative">
                      <Droplet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 fill-red-500" />
                      <select
                        {...register("bloodGroup", { required: "Blood group is required" })}
                        className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-[#09090b]"
                      >
                        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                          <option key={bg} value={bg} className="bg-[#09090b] text-white">
                            {bg} Blood Group
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="john@example.com"
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

                {/* Password */}
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

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register("confirmPassword", {
                        validate: (value) => value === passwordValue || "Passwords do not match",
                      })}
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-gray-500"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
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
                      <span>Join BloodLink Lifesaving Network</span>
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
