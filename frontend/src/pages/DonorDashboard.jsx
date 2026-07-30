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
import NearbyBloodBanksMap from "../components/maps/NearbyBloodBanksMap";
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
  const [showMapModal, setShowMapModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [recordSearch, setRecordSearch] = useState("");
  const [newApt, setNewApt] = useState({ center: "Metropolitan Central Blood Bank", date: "", donationType: "Whole Blood", notes: "" });

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
    { id: "notifications", label: "Notifications", icon: Bell, badge: notifications.filter((n) => n.unread).length },
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

      {/* Main View */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
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

        {/* Dynamic Body Content */}
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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

            {/* 4. APPOINTMENTS TAB (WITH NEARBY BLOOD BANKS MAP BUTTON) */}
            {activeTab === "appointments" && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Donation Appointments</h2>
                    <p className="text-xs text-gray-400">Schedule or locate nearby blood bank centers</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMapModal(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold border border-blue-500/40 flex items-center gap-2 cursor-pointer transition-all shadow-md"
                    >
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>📍 Find Nearby Blood Banks</span>
                    </button>

                    <button
                      onClick={() => setShowBookModal(true)}
                      className="px-4 py-2 rounded-xl shimmer-btn-red text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Book New Slot</span>
                    </button>
                  </div>
                </div>

                {/* Google Maps Viewport Section */}
                <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>Regional Blood Banks Location Map</span>
                  </h3>
                  <NearbyBloodBanksMap
                    onSelectBank={(bank) => {
                      setNewApt({ ...newApt, center: bank.name });
                      setShowBookModal(true);
                    }}
                  />
                </div>

                {/* Scheduled Appointments Grid */}
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

            {/* OTHER TABS (Profile, Records, Emergency, Blood Banks, Rewards, Card, Analytics, Notifications, Settings) */}
            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8 border border-white/10 space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Donor Profile</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 block mb-1">Full Name</label>
                      <input type="text" value={profileData?.fullName || ""} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} className="w-full glass-input px-4 py-2.5 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-gray-300 block mb-1">Emergency Contact</label>
                      <input type="text" value={profileData?.emergencyContact || ""} onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })} className="w-full glass-input px-4 py-2.5 rounded-xl text-sm" />
                    </div>
                  </div>
                  <button type="submit" className="px-6 py-2.5 rounded-xl shimmer-btn-red text-white font-bold text-xs shadow-lg cursor-pointer">Save Changes</button>
                </form>
              </motion.div>
            )}

            {activeTab === "records" && (
              <motion.div key="records" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Donation Records</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] font-bold">
                        <th className="py-2 px-3">ID</th><th className="py-2 px-3">Date</th><th className="py-2 px-3">Hospital</th><th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donationRecords.map((r) => (
                        <tr key={r.id} className="border-b border-white/5">
                          <td className="py-3 px-3 font-bold text-rose-400">{r.id}</td>
                          <td className="py-3 px-3">{r.date}</td>
                          <td className="py-3 px-3">{r.hospital}</td>
                          <td className="py-3 px-3 text-emerald-400 font-bold">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "bloodbanks" && (
              <motion.div key="bloodbanks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Nearby Blood Banks & Interactive Map</h2>
                <NearbyBloodBanksMap onSelectBank={(bank) => { setNewApt({ ...newApt, center: bank.name }); setShowBookModal(true); }} />
              </motion.div>
            )}

            {activeTab === "card" && (
              <motion.div key="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
                <TiltCard>
                  <div className="glass-card rounded-3xl p-8 border border-rose-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-red-950/60 via-rose-950/40 to-black space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="text-xl font-black text-white">Digital Donor ID</h3>
                      <div className="px-5 py-2 rounded-2xl bg-red-600 text-white font-black text-2xl">{authUser?.bloodGroup || "O+"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div><span className="text-gray-400 text-[10px] block">Name</span><span className="font-bold text-white">{authUser?.fullName || authUser?.username}</span></div>
                      <div><span className="text-gray-400 text-[10px] block">Card ID</span><span className="font-bold text-rose-300">{authUser?.digitalCardId || "BL-DONOR-88291"}</span></div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            )}

            {activeTab === "rewards" && (
              <motion.div key="rewards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card rounded-3xl p-8 border border-purple-500/30 text-center space-y-2">
                  <h2 className="text-3xl font-black text-white">{rewardsData?.level || "Platinum Donor"}</h2>
                  <p className="text-amber-400 font-bold text-lg">{rewardsData?.points || 1250} Reward Points</p>
                </div>
              </motion.div>
            )}

            {activeTab === "emergency" && (
              <motion.div key="emergency" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-red-500" /> Emergency Requests</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {emergencyRequests.map((req) => (
                    <div key={req.id} className="glass-card rounded-3xl p-5 border border-red-500/40 space-y-2 text-xs">
                      <h3 className="text-sm font-bold text-white">{req.hospital}</h3>
                      <p className="text-rose-400 font-bold">{req.bloodGroup} Needed ({req.units} Units)</p>
                      <button onClick={() => toast.success(`Accepted request for ${req.hospital}`)} className="w-full py-2 rounded-xl shimmer-btn-red text-white font-bold cursor-pointer">Accept</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
                <h2 className="text-2xl font-bold text-white">Health Analytics</h2>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/5"><span className="text-gray-400 block">BMI</span><span className="text-xl font-bold text-white">{analyticsData?.bmi || 22.7}</span></div>
                  <div className="p-4 rounded-2xl bg-white/5"><span className="text-gray-400 block">Blood Pressure</span><span className="text-xl font-bold text-white">{analyticsData?.bloodPressure || "118 / 78"}</span></div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Notifications</h2>
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-white/5 text-xs">
                    <h4 className="font-bold text-white">{n.title}</h4>
                    <p className="text-gray-300">{n.body}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <p className="text-xs text-gray-400">Manage notifications & security preferences</p>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {showBookModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-card max-w-md w-full p-6 rounded-3xl space-y-4 border border-rose-500/40 relative">
              <button onClick={() => setShowBookModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-white">Book Donation Slot</h3>
              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 mb-1 block">Blood Bank Center</label>
                  <select value={newApt.center} onChange={(e) => setNewApt({ ...newApt, center: e.target.value })} className="w-full glass-input px-4 py-2.5 rounded-xl text-sm bg-[#05070d]">
                    <option value="Metropolitan Central Blood Bank">Metropolitan Central Blood Bank</option>
                    <option value="Red Cross Regional Center #4">Red Cross Regional Center #4</option>
                    <option value="St. Jude Hospital Blood Bank">St. Jude Hospital Blood Bank</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 mb-1 block">Date & Time</label>
                  <input type="datetime-local" required value={newApt.date} onChange={(e) => setNewApt({ ...newApt, date: e.target.value })} className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl shimmer-btn-red text-white font-bold text-sm shadow-xl cursor-pointer">Confirm Booking</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Maps Dedicated Modal */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-card max-w-3xl w-full p-6 rounded-3xl space-y-4 border border-blue-500/40 relative">
              <button onClick={() => setShowMapModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-bold">Nearby Blood Banks Google Map</h3>
              </div>
              <NearbyBloodBanksMap onSelectBank={(bank) => { setNewApt({ ...newApt, center: bank.name }); setShowMapModal(false); setShowBookModal(true); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-card max-w-sm w-full p-6 rounded-3xl space-y-4 border border-rose-500/40 text-center relative">
              <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="text-lg font-bold text-white">Appointment Check-in QR</h3>
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
