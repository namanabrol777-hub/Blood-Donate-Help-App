import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Briefcase,
  FileText,
  ArrowLeft,
  Camera,
  Save,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import TiltCard from "../components/TiltCard";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState(authUser?.username || "");
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [avatar, setAvatar] = useState(authUser?.avatar || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [jobTitle, setJobTitle] = useState(authUser?.jobTitle || "");

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      username,
      fullName,
      avatar,
      bio,
      jobTitle,
    });
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 relative z-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ x: -4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </motion.button>

        {/* Glass Profile Card */}
        <TiltCard>
          <div className="glass-card rounded-3xl p-8 space-y-8 border border-white/15 shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
              <div className="relative group">
                <img
                  src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/70 shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-bold text-white">{authUser?.username}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                    {authUser?.role || "USER"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{authUser?.email}</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    Joined {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "Recently"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    1-Hour JWT Auth
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Username</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Job Title / Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Senior Full Stack Engineer"
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Avatar Image URL</label>
                  <div className="relative">
                    <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short bio..."
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Submit Save Button */}
              <motion.button
                type="submit"
                disabled={isUpdatingProfile}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3.5 shimmer-btn rounded-xl text-white font-semibold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingProfile ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </motion.button>

            </form>

          </div>
        </TiltCard>

      </div>
    </div>
  );
};

export default ProfilePage;