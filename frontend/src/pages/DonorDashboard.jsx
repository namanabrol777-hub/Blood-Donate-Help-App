import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Heart,
  Droplet,
  Calendar,
  Award,
  Sparkles,
  Search,
  LogOut,
  MapPin,
  Flame,
  QrCode,
  AlertTriangle,
  User,
  ChevronDown,
  CheckCircle2,
  X,
  FileText,
  Activity,
  Bell,
  Settings,
  HelpCircle,
  Building2,
  Download,
  Plus,
  Shield,
  Clock,
  Navigation,
  Phone,
  Share2,
  TrendingUp,
  Sliders,
  Check,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import TiltCard from "../components/TiltCard";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DonorDashboard = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [donationRecords, setDonationRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [rewardsData, setRewardsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Modals & Search
  const [showBookModal, setShowBookModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [recordSearch, setRecordSearch] = useState("");
  const [newApt, setNewApt] = useState({ center: "Metropolitan Central Blood Bank", date: "", donationType: "Whole Blood", notes: "" });

  // Fetch Dashboard Stats & Initial Data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/donor/dashboard`);
      if (res.data?.success) setDashboardData(res.data.stats);

      const profileRes = await axios.get(`${API_URL}/donor/profile`);
      if (profileRes.data?.success) setProfileData(profileRes.data.profile);

      const recordsRes = await axios.get(`${API_URL}/donor/records`);
      if (recordsRes.data?.success) setDonationRecords(recordsRes.data.records);

      const aptRes = await axios.get(`${API_URL}/donor/appointments`);
      if (aptRes.data?.success) setAppointments(aptRes.data.appointments);

      const emgRes = await axios.get(`${API_URL}/donor/emergency`);
      if (emgRes.data?.success) setEmergencyRequests(emgRes.data.emergencyRequests);

      const bbRes = await axios.get(`${API_URL}/donor/bloodbanks`);
      if (bbRes.data?.success) setBloodBanks(bbRes.data.bloodBanks);

      const rewRes = await axios.get(`${API_URL}/donor/rewards`);
      if (rewRes.data?.success) setRewardsData(rewRes.data.rewards);

      const anaRes = await axios.get(`${API_URL}/donor/analytics`);
      if (anaRes.data?.success) setAnalyticsData(anaRes.data.analytics);

      const notifRes = await axios.get(`${API_URL}/donor/notifications`);
      if (notifRes.data?.success) setNotifications(notifRes.data.notifications);
    } catch (err) {
      console.log("Error fetching donor data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!newApt.date) {
      toast.error("Please select an appointment date & time");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/donor/appointments`, newApt);
      if (res.data?.success) {
        toast.success("Donation Appointment Booked Successfully! ❤️");
        setAppointments((prev) => [res.data.appointment, ...prev]);
        setShowBookModal(false);
      }
    } catch (error) {
      toast.error("Failed to book appointment");
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await axios.delete(`${API_URL}/donor/appointments/${id}`);
      toast.success("Appointment cancelled");
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/donor/profile`, profileData);
      if (res.data?.success) {
        toast.success("Profile Updated Successfully! ✨");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Heart },
    { id: "profile", label: "My Profile", icon: User },
    { id: "records", label: "Donation Records", icon: FileText },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "emergency", label: "Emergency Requests", icon: AlertTriangle, badge: emergencyRequests.length },
    { id: "bloodbanks", label: "Nearby Blood Banks", icon: Building2 },
    { id: "rewards", label: "Rewards & Badges", icon: Award },
    { id: "card", label: "Digital Donor Card", icon: QrCode },
    { id: "analytics", label: "Health Analytics", icon: Activity },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notifications.filter(n => n.unread).length },
    { id: "settings", label: "Settings & Help", icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#05070d] text-white relative z-10 font-sans">
      
      {/* 12-Tab Animated Glass Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-rose-500/20 glass-card p-5 flex flex-col justify-between hidden lg:flex min-h-screen sticky top-0 bg-rose-950/20 backdrop-blur-2xl"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg glow-biotech-red">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="font-black text-lg leading-none tracking-tight text-white">BloodLink</h2>
              <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase">Donor Command Portal</span>
            </div>
          </div>

          <nav className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-rose-600/30 text-rose-300 border border-rose-500/50 shadow-lg glow-biotech-red"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <img
              src={authUser?.avatar || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256"}
              alt="Donor"
              className="w-8 h-8 rounded-full border border-rose-500 object-cover"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{authUser?.fullName || authUser?.username}</p>
              <p className="text-[10px] text-rose-400 font-bold uppercase truncate">BLOOD: {authUser?.bloodGroup || "O+"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-1.5 cursor-pointer">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* Main Donor View Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Top Header */}
        <header className="h-16 border-b border-white/10 glass-card px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-rose-950/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
              PORTAL: {activeTab.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookModal(true)}
              className="px-3.5 py-1.5 rounded-xl shimmer-btn-red text-white text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full bg-white/5 border border-white/10 cursor-pointer"
              >
                <img
                  src={authUser?.avatar || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256"}
                  alt="Donor"
                  className="w-7 h-7 rounded-full object-cover border border-rose-500"
                />
                <span className="text-xs font-bold text-rose-300">DONOR PANEL</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-2 border border-white/10 z-50">
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body Content */}
        <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          <AnimatePresence mode="wait">
            
            {/* 1. DASHBOARD OVERVIEW TAB */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Banner */}
                <div className="glass-card rounded-3xl p-8 border border-rose-500/30 bg-gradient-to-r from-red-950/40 via-rose-950/30 to-transparent flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                      LIFESAVING COMMAND CENTER
                    </span>
                    <h1 className="text-3xl font-black text-white">
                      Welcome Back, {authUser?.fullName || authUser?.username} ❤️
                    </h1>
                    <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                      Your blood group is <span className="text-rose-400 font-bold">{authUser?.bloodGroup || "O+"}</span>. You are fully eligible to donate blood today and save up to 3 human lives.
                    </p>
                  </div>

                  <div className="hidden sm:flex flex-col items-end gap-2">
                    <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Health Score: 96/100</span>
                    </div>
                    <span className="text-[11px] text-gray-400">Next Eligible: Today</span>
                  </div>
                </div>

                {/* 4 Animated Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2 glass-card-hover">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                      <Droplet className="w-5 h-5 fill-red-500" />
                    </div>
                    <h3 className="text-3xl font-black text-white">{dashboardData?.metrics?.totalDonations || 4}</h3>
                    <p className="text-xs text-gray-400">Total Donations</p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2 glass-card-hover">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-rose-500" />
                    </div>
                    <h3 className="text-3xl font-black text-white">{dashboardData?.metrics?.livesSaved || 12}</h3>
                    <p className="text-xs text-rose-400 font-semibold">Lives Saved</p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2 glass-card-hover">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Flame className="w-5 h-5 fill-amber-500" />
                    </div>
                    <h3 className="text-3xl font-black text-white">{dashboardData?.metrics?.donationStreak || 4} Streak</h3>
                    <p className="text-xs text-amber-400 font-semibold">Donation Streak</p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2 glass-card-hover">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-3xl font-black text-white">{dashboardData?.metrics?.rewardPoints || 1250}</h3>
                    <p className="text-xs text-purple-400 font-semibold">Reward Points</p>
                  </div>
                </div>

                {/* Upcoming Appointment & Emergency Card Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Upcoming Appointment (6 cols) */}
                  <div className="lg:col-span-6 glass-card rounded-3xl p-6 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-400" />
                        <span>Upcoming Appointment</span>
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="text-sm font-bold text-white">{dashboardData?.upcomingAppointment?.center || "Metropolitan Central Blood Bank"}</p>
                      <p className="text-gray-400"><Clock className="w-3.5 h-3.5 inline text-rose-400 mr-1" /> Scheduled: Aug 5, 2026 at 10:00 AM</p>
                      <p className="text-gray-400">Type: <span className="text-white font-semibold">{dashboardData?.upcomingAppointment?.donationType || "Whole Blood"}</span></p>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedQR(dashboardData?.upcomingAppointment?.qrCode || "BL-APT-99201-QR");
                          setShowQRModal(true);
                        }}
                        className="flex-1 py-2 rounded-xl shimmer-btn-red text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View Check-in QR</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Emergency Response Alert (6 cols) */}
                  <div className="lg:col-span-6 glass-card rounded-3xl p-6 border border-red-500/30 bg-gradient-to-br from-red-950/30 to-black space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span>Nearby Emergency Blood Request</span>
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        CRITICAL
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-sm font-bold text-white">St. Jude Children's Hospital</p>
                      <p className="text-gray-300">Required: <span className="text-red-400 font-extrabold">{authUser?.bloodGroup || "O+"} (2 Units)</span> • Distance: 2.4 km away</p>
                      <p className="text-gray-400">Doctor: Dr. Alex Reed (Pediatric ICU)</p>
                    </div>

                    <button
                      onClick={() => toast.success("Thank you! Hospital notified of your immediate response. ❤️")}
                      className="w-full py-2.5 rounded-xl shimmer-btn-red text-white text-xs font-bold shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Respond & Save Lives Now</span>
                    </button>
                  </div>

                </div>

              </motion.div>
            )}

            {/* 2. MY PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-3xl p-8 border border-white/10 space-y-6"
              >
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-bold text-white">Donor Profile & Medical Questionnaire</h2>
                  <p className="text-xs text-gray-400">Keep your information up to date for instant emergency matching</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData?.fullName || ""}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-1">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={profileData?.email || ""}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm opacity-60 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={profileData?.phone || ""}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-1">Blood Group</label>
                      <input
                        type="text"
                        disabled
                        value={profileData?.bloodGroup || "O+"}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-red-400 font-bold opacity-80 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={profileData?.weight || 72}
                        onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-1">Emergency Contact</label>
                      <input
                        type="text"
                        value={profileData?.emergencyContact || ""}
                        onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-bold text-white mb-3">Lifestyle & Medical Screening</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-gray-400 text-[10px] uppercase block">Smoking</span>
                        <span className="text-white font-bold text-xs">{profileData?.lifestyle?.smoking || "No"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-gray-400 text-[10px] uppercase block">Alcohol</span>
                        <span className="text-white font-bold text-xs">{profileData?.lifestyle?.alcohol || "Occasional"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-gray-400 text-[10px] uppercase block">Medications</span>
                        <span className="text-white font-bold text-xs">{profileData?.lifestyle?.medications || "None"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-gray-400 text-[10px] uppercase block">Organ Donor</span>
                        <span className="text-emerald-400 font-bold text-xs">Registered Yes</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl shimmer-btn-red text-white text-xs font-bold shadow-lg cursor-pointer"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </motion.div>
            )}

            {/* 3. DONATION RECORDS TAB */}
            {activeTab === "records" && (
              <motion.div
                key="records"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-3xl p-6 border border-white/10 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Donation History & Certificates</h2>
                    <p className="text-xs text-gray-400">Complete record of your lifesaving contributions</p>
                  </div>
                  <div className="relative w-64 hidden sm:block">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search record..."
                      value={recordSearch}
                      onChange={(e) => setRecordSearch(e.target.value)}
                      className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Donation ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Blood Bank</th>
                        <th className="py-3 px-4">Hospital</th>
                        <th className="py-3 px-4">Units</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Certificate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {donationRecords
                        .filter((r) => r.hospital.toLowerCase().includes(recordSearch.toLowerCase()) || r.id.toLowerCase().includes(recordSearch.toLowerCase()))
                        .map((rec) => (
                          <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-bold text-rose-400">{rec.id}</td>
                            <td className="py-4 px-4 text-white">{rec.date}</td>
                            <td className="py-4 px-4 text-gray-300">{rec.bloodBank}</td>
                            <td className="py-4 px-4 text-gray-300">{rec.hospital}</td>
                            <td className="py-4 px-4 font-bold text-white">{rec.units} Unit</td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                                {rec.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => toast.success(`Downloading Certificate for ${rec.id}...`)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-[11px] border border-white/10 flex items-center gap-1.5 ml-auto cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-rose-400" />
                                <span>PDF Certificate</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 4. APPOINTMENTS TAB */}
            {activeTab === "appointments" && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Donation Appointments</h2>
                    <p className="text-xs text-gray-400">Schedule or manage your upcoming blood donation slots</p>
                  </div>
                  <button
                    onClick={() => setShowBookModal(true)}
                    className="px-4 py-2 rounded-xl shimmer-btn-red text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book New Slot</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="glass-card rounded-3xl p-6 border border-white/10 space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-bold text-rose-400">{apt.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${apt.status === "UPCOMING" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/10 text-gray-400 border-white/10"}`}>
                          {apt.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-base font-bold text-white">{apt.center}</p>
                        <p className="text-gray-300"><Calendar className="w-3.5 h-3.5 inline text-rose-400 mr-1" /> {new Date(apt.date).toLocaleString()}</p>
                        <p className="text-gray-400">Donation Type: <span className="text-white font-semibold">{apt.donationType}</span></p>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setSelectedQR(apt.qrCode);
                            setShowQRModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Show QR Code</span>
                        </button>
                        {apt.status === "UPCOMING" && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-bold border border-red-500/30 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 5. EMERGENCY REQUESTS TAB */}
            {activeTab === "emergency" && (
              <motion.div
                key="emergency"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <span>Emergency Blood Requests Near You</span>
                  </h2>
                  <p className="text-xs text-gray-400">Urgent hospital requests matching your blood group ({authUser?.bloodGroup || "O+"})</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {emergencyRequests.map((req) => (
                    <div key={req.id} className="glass-card rounded-3xl p-6 border border-red-500/40 bg-gradient-to-b from-red-950/30 to-black space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px]">
                          {req.urgency}
                        </span>
                        <span className="text-xs font-black text-rose-400">{req.bloodGroup} Needed</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <h3 className="text-base font-bold text-white">{req.hospital}</h3>
                        <p className="text-gray-300">Doctor: <span className="text-white font-semibold">{req.doctor}</span></p>
                        <p className="text-gray-400"><MapPin className="w-3.5 h-3.5 inline text-rose-400 mr-1" /> {req.distance} ({req.address})</p>
                        <p className="text-gray-400"><Clock className="w-3.5 h-3.5 inline text-amber-400 mr-1" /> Time Left: <span className="text-amber-400 font-bold">{req.timeRemaining}</span></p>
                      </div>

                      <button
                        onClick={() => toast.success(`Responding to ${req.hospital}! Contact details sent to your mobile.`)}
                        className="w-full py-2.5 rounded-xl shimmer-btn-red text-white text-xs font-bold shadow-lg cursor-pointer"
                      >
                        Accept & Respond
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 6. NEARBY BLOOD BANKS TAB */}
            {activeTab === "bloodbanks" && (
              <motion.div
                key="bloodbanks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white">Nearby Verified Blood Banks</h2>
                  <p className="text-xs text-gray-400">Locate blood inventory storage centers near your area</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {bloodBanks.map((bank) => (
                    <div key={bank.id} className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h3 className="text-sm font-bold text-white">{bank.name}</h3>
                        <span className="text-amber-400 font-bold text-xs">★ {bank.rating}</span>
                      </div>

                      <div className="space-y-2 text-xs text-gray-300">
                        <p><MapPin className="w-3.5 h-3.5 inline text-rose-400 mr-1" /> {bank.distance} • {bank.address}</p>
                        <p><Phone className="w-3.5 h-3.5 inline text-emerald-400 mr-1" /> {bank.phone}</p>
                        <p className="text-emerald-400 font-semibold">{bank.openHours}</p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">O+ Stock: <strong className="text-white">{bank.stock["O+"]} Units</strong></span>
                        <button
                          onClick={() => setShowBookModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 8. REWARDS & BADGES TAB */}
            {activeTab === "rewards" && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Level Progress Banner */}
                <div className="glass-card rounded-3xl p-8 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-rose-950/20 to-transparent space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-purple-400 uppercase">DONOR GAMIFICATION LEVEL</span>
                      <h2 className="text-3xl font-black text-white">{rewardsData?.level || "Platinum Donor"}</h2>
                    </div>
                    <div className="text-right">
                      <h3 className="text-3xl font-black text-amber-400">{rewardsData?.points || 1250}</h3>
                      <span className="text-xs text-gray-400">Total Points Earned</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Progress to {rewardsData?.nextLevel || "Diamond Hero"}</span>
                      <span className="font-bold">{rewardsData?.progress || 82}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full" style={{ width: `${rewardsData?.progress || 82}%` }} />
                    </div>
                  </div>
                </div>

                {/* Badges Grid */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Unlocked Badges & Medals</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {rewardsData?.badges?.map((badge) => (
                      <div key={badge.id} className={`glass-card rounded-2xl p-5 border space-y-2 text-center ${badge.unlocked ? "border-amber-500/40 bg-amber-500/5" : "border-white/10 opacity-50"}`}>
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-xl">
                          <Award className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                        <p className="text-[11px] text-gray-400">{badge.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 9. DIGITAL DONOR CARD TAB */}
            {activeTab === "card" && (
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-xl mx-auto space-y-6"
              >
                <TiltCard>
                  <div className="glass-card rounded-3xl p-8 border border-rose-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-red-950/60 via-rose-950/40 to-black space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl shimmer-btn-red flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          <Droplet className="w-6 h-6 fill-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white">Digital Donor ID</h3>
                          <p className="text-[10px] text-rose-400 font-bold tracking-widest">BLOODLINK EMERGENCY NETWORK</p>
                        </div>
                      </div>

                      <div className="px-5 py-2 rounded-2xl bg-red-600 border border-red-500 text-white font-black text-2xl shadow-xl">
                        {authUser?.bloodGroup || "O+"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase block">Donor Name</span>
                        <span className="font-bold text-white text-base">{authUser?.fullName || authUser?.username}</span>
                      </div>

                      <div>
                        <span className="text-gray-400 text-[10px] uppercase block">Card ID</span>
                        <span className="font-bold text-rose-300 text-base">{authUser?.digitalCardId || "BL-DONOR-88291"}</span>
                      </div>

                      <div>
                        <span className="text-gray-400 text-[10px] uppercase block">Status</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Eligible Today
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-400 text-[10px] uppercase block">Emergency Contact</span>
                        <span className="font-bold text-white text-xs">{authUser?.emergencyContact || "+1 (555) 987-6543"}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        <QrCode className="w-4 h-4 text-rose-400" />
                        Show QR Code at Center
                      </span>
                      <button
                        onClick={() => toast.success("Downloading Wallet Digital ID PDF...")}
                        className="px-4 py-2 rounded-xl shimmer-btn-red text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            )}

            {/* 10. HEALTH ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white">Donor Health Analytics</h2>
                  <p className="text-xs text-gray-400">Vital metrics tracked to ensure continuous donation readiness</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
                    <span className="text-gray-400 text-[10px] uppercase block">Body Mass Index (BMI)</span>
                    <h3 className="text-2xl font-black text-white">{analyticsData?.bmi || 22.7}</h3>
                    <p className="text-emerald-400 text-[11px] font-semibold">{analyticsData?.bmiCategory || "Healthy Weight"}</p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
                    <span className="text-gray-400 text-[10px] uppercase block">Blood Pressure</span>
                    <h3 className="text-2xl font-black text-white">{analyticsData?.bloodPressure || "118 / 78"}</h3>
                    <p className="text-emerald-400 text-[11px] font-semibold">Optimal Range</p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
                    <span className="text-gray-400 text-[10px] uppercase block">Hemoglobin Level</span>
                    <h3 className="text-2xl font-black text-white">{analyticsData?.hemoglobin || "14.5 g/dL"}</h3>
                    <p className="text-emerald-400 text-[11px] font-semibold">Excellent Level</p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
                    <span className="text-gray-400 text-[10px] uppercase block">Hydration Score</span>
                    <h3 className="text-2xl font-black text-white">{analyticsData?.hydrationScore || "95%"}</h3>
                    <p className="text-blue-400 text-[11px] font-semibold">Optimal Hydration</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 11. NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-3xl p-6 border border-white/10 space-y-4"
              >
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Notifications Feed</h2>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-white">{notif.title}</h4>
                        <p className="text-gray-300">{notif.body}</p>
                        <span className="text-[10px] text-gray-500">{notif.time}</span>
                      </div>
                      {notif.unread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 12. SETTINGS & HELP TAB */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-3xl p-8 border border-white/10 space-y-6"
              >
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Account Settings & Help Support</h2>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                    <div>
                      <h4 className="font-bold text-white">Emergency SMS Alerts</h4>
                      <p className="text-gray-400">Receive instant SMS alerts for critical blood shortages in your city</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-red-600 cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                    <div>
                      <h4 className="font-bold text-white">Two-Factor Authentication (2FA)</h4>
                      <p className="text-gray-400">Protect account session with mobile verification</p>
                    </div>
                    <button onClick={() => toast.success("2FA Enabled!")} className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white font-bold cursor-pointer">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {showBookModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full p-6 rounded-3xl space-y-5 border border-rose-500/40 shadow-2xl relative"
            >
              <button onClick={() => setShowBookModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl shimmer-btn-red text-white flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Book Donation Slot</h3>
                  <p className="text-xs text-gray-400">Select center & date/time</p>
                </div>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 font-medium mb-1 block">Blood Donation Center</label>
                  <select
                    value={newApt.center}
                    onChange={(e) => setNewApt({ ...newApt, center: e.target.value })}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm bg-[#05070d]"
                  >
                    <option value="Metropolitan Central Blood Bank">Metropolitan Central Blood Bank</option>
                    <option value="Red Cross Regional Center #4">Red Cross Regional Center #4</option>
                    <option value="St. Jude Hospital Blood Bank">St. Jude Hospital Blood Bank</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-medium mb-1 block">Preferred Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newApt.date}
                    onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium mb-1 block">Donation Type</label>
                  <select
                    value={newApt.donationType}
                    onChange={(e) => setNewApt({ ...newApt, donationType: e.target.value })}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm bg-[#05070d]"
                  >
                    <option value="Whole Blood">Whole Blood (1 Pint)</option>
                    <option value="Power Red">Power Red (Double Red Cells)</option>
                    <option value="Platelets">Platelets Donation</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl shimmer-btn-red text-white font-bold text-sm shadow-xl cursor-pointer"
                >
                  Confirm Appointment Booking
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-sm w-full p-6 rounded-3xl space-y-4 border border-rose-500/40 text-center relative"
            >
              <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white">Check-in QR Code</h3>
              <p className="text-xs text-gray-400">Scan at blood bank kiosk for instant check-in</p>

              <div className="w-48 h-48 rounded-2xl bg-white p-4 mx-auto flex items-center justify-center shadow-2xl">
                <QrCode className="w-36 h-36 text-black" />
              </div>

              <p className="text-xs font-mono text-rose-400 font-bold">{selectedQR}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DonorDashboard;
