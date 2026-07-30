import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Activity,
  Shield,
  Bell,
  Search,
  LogOut,
  TrendingUp,
  Clock,
  Zap,
  Lock,
  ChevronDown,
  Droplet,
  Building2,
  Ambulance,
  AlertTriangle,
  HeartPulse,
  PlusCircle,
  FileCheck,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const DashboardPage = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const statCards = [
    { title: "Total Blood Units Available", value: "12,450 Units", trend: "+8.4% this week", icon: Droplet, color: "from-red-500 to-rose-600" },
    { title: "Critical Emergency Requests", value: "3 Active Alerts", trend: "Immediate Response", icon: AlertTriangle, color: "from-amber-500 to-red-600" },
    { title: "Active Donors Online", value: "1,840 Donors", trend: "Live Network", icon: HeartPulse, color: "from-emerald-500 to-teal-600" },
    { title: "Connected Hospitals & Banks", value: "820 Centers", trend: "Nationwide", icon: Building2, color: "from-blue-500 to-indigo-600" },
  ];

  const emergencyRequests = [
    { hospital: "St. Jude Children's Hospital", bloodGroup: "O-", unitsNeeded: "3 Units", status: "CRITICAL", urgency: "High", time: "10 mins ago" },
    { hospital: "City General Trauma Center", bloodGroup: "A+", unitsNeeded: "2 Units", status: "URGENT", urgency: "Medium", time: "25 mins ago" },
    { hospital: "Metropolitan Blood Bank", bloodGroup: "B-", unitsNeeded: "5 Units", status: "CRITICAL", urgency: "High", time: "42 mins ago" },
    { hospital: "Mercy Health Care Center", bloodGroup: "AB+", unitsNeeded: "1 Unit", status: "STABLE", urgency: "Low", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white relative z-10">
      
      {/* Animated Medical Glass Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 border-r border-white/10 glass-card p-6 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0"
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl shimmer-btn-red flex items-center justify-center text-white shadow-lg glow-medical-red">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none tracking-tight">BloodLink</h2>
              <span className="text-[10px] text-red-400 font-semibold tracking-wider uppercase">Command Center</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Dashboard", icon: LayoutDashboard },
              { id: "emergencies", label: "Emergency Alerts", icon: AlertTriangle },
              { id: "profile", label: "Donor Profile", icon: User, path: "/profile" },
              { id: "security", label: "Security & JWT", icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    else setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-red-600/25 text-red-300 border border-red-500/40 shadow-lg glow-medical-red"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={authUser?.avatar || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256"}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-red-500/50"
            />
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate">{authUser?.username || "Donor"}</p>
                <span className="px-1.5 py-0.2 rounded bg-red-500/30 text-red-400 text-[10px] font-bold">
                  {authUser?.bloodGroup || "O+"}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 truncate">{authUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="text-gray-400 hover:text-red-400 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/10 glass-card px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          
          <div className="relative w-72 hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blood group, hospital, city..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-4">
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>3 Critical Emergency Alerts Active</span>
            </div>

            <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <img
                  src={authUser?.avatar || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256"}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border border-red-500/60"
                />
                <span className="text-xs font-medium text-gray-200 hidden md:block">{authUser?.username}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-2 border border-white/15 shadow-2xl z-50 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-semibold text-white">{authUser?.fullName || authUser?.username}</p>
                      <p className="text-[10px] text-red-400 font-bold">Blood Group: {authUser?.bloodGroup || "O+"}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <User className="w-4 h-4 text-red-400" />
                      <span>Edit Donor Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-red-950/40 via-rose-950/20 to-transparent"
          >
            <div className="relative z-10 space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
                <HeartPulse className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>BloodLink Lifesaving Network</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome back, {authUser?.username || "Donor"} ❤️
              </h1>
              <p className="text-sm text-gray-300 leading-relaxed">
                Your registered Blood Group is <span className="text-red-400 font-bold px-2 py-0.5 rounded bg-red-500/20">{authUser?.bloodGroup || "O+"}</span>. Your donor account is active and connected to the emergency blood shortage dispatch system.
              </p>
              <div className="pt-2 flex gap-3">
                <Link
                  to="/profile"
                  className="px-4 py-2.5 rounded-xl shimmer-btn-red text-xs font-semibold text-white shadow-lg"
                >
                  Manage Donor Settings
                </Link>
                <button
                  onClick={() => setActiveTab("emergencies")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  View Emergency Alerts
                </button>
              </div>
            </div>
          </motion.div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 glass-card-hover"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">{stat.title}</span>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{stat.value}</h3>
                    <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{stat.trend}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Emergency Requests & Quick Donor Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Live Emergency Requests Feed (8 cols) */}
            <div className="lg:col-span-8 glass-card rounded-3xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Live Emergency Blood Requests
                  </h3>
                  <p className="text-xs text-gray-400">Real-time hospital shortage broadcast</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
                  Broadcast Live
                </span>
              </div>

              <div className="space-y-4">
                {emergencyRequests.map((req, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{req.hospital}</h4>
                        <p className="text-[11px] text-gray-400">Needed: <span className="text-gray-200 font-semibold">{req.unitsNeeded}</span> • {req.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        req.status === "CRITICAL"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}>
                        {req.status}
                      </span>
                      <button className="px-3 py-1.5 rounded-lg shimmer-btn-red text-[11px] font-semibold text-white shadow-md">
                        Respond
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Donor Profile Badge (4 cols) */}
            <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4 text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={authUser?.avatar || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256"}
                    alt="Donor Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-red-500/70 shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-600 border-2 border-[#09090b] text-white font-extrabold text-xs flex items-center justify-center shadow-lg">
                    {authUser?.bloodGroup || "O+"}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{authUser?.username}</h3>
                  <p className="text-xs text-red-400 font-medium">{authUser?.jobTitle || "Registered Blood Donor"}</p>
                  <p className="text-xs text-gray-400 mt-1">{authUser?.email}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Donor Status:</span>
                    <span className="font-semibold text-emerald-400">AVAILABLE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Donations:</span>
                    <span className="font-semibold text-white">{authUser?.donationsCount || 0} Lifesaving Donations</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auth Token:</span>
                    <span className="font-semibold text-red-400 uppercase">1-HOUR JWT</span>
                  </div>
                </div>
              </div>

              <Link
                to="/profile"
                className="w-full shimmer-btn-red py-3 rounded-xl text-center text-xs font-semibold text-white shadow-lg block"
              >
                Edit Donor Profile
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
