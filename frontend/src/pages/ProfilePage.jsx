import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  Briefcase,
  FileText,
  ArrowLeft,
  Camera,
  Save,
  Droplet,
  HeartPulse,
  PhoneCall,
  Clock,
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
  const [bloodGroup, setBloodGroup] = useState(authUser?.bloodGroup || "O+");
  const [isAvailableForDonation, setIsAvailableForDonation] = useState(authUser?.isAvailableForDonation ?? true);
  const [emergencyContact, setEmergencyContact] = useState(authUser?.emergencyContact || "");

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      username,
      fullName,
      avatar,
      bio,
      jobTitle,
      bloodGroup,
      isAvailableForDonation,
      emergencyContact,
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
          <span>Back to Command Center</span>
        </motion.button>

        {/* Glass Profile Card */}
        <TiltCard>
          <div className="glass-card rounded-3xl p-8 space-y-8 border border-white/15 shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
              <div className="relative group">
                <img
                  src={avatar || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-red-500/70 shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="text-center sm:text-left space-y-2">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h1 className="text-2xl font-bold text-white">{authUser?.username}</h1>
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider border border-red-500/30">
                    {bloodGroup} Donor
                  </span>
                </div>
                <p className="text-xs text-gray-400">{authUser?.email}</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-400" />
                    Joined {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "Recently"}
                  </span>
                  <span className="flex items-center gap-1">
                    <HeartPulse className="w-3 h-3 text-emerald-400" />
                    Available to Donate
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

                {/* Blood Group Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Blood Group</label>
                  <div className="relative">
                    <Droplet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 fill-red-500" />
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
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

                {/* Emergency Contact */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Emergency Phone Contact</label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Job Title / Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Role / Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
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
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

              </div>

              {/* Donation Availability Checkbox */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Available for Emergency Blood Donations</h4>
                  <p className="text-[11px] text-gray-400">Receive instant emergency alerts when hospitals near you need your blood group.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isAvailableForDonation}
                  onChange={(e) => setIsAvailableForDonation(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-700 bg-white/5 text-red-600 focus:ring-red-500 cursor-pointer"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Donor Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
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
                className="w-full sm:w-auto px-8 py-3.5 shimmer-btn-red rounded-xl text-white font-semibold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingProfile ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Donor Profile</span>
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