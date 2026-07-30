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
  Sparkles,
  Server,
  KeyRound,
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
    { title: "JWT Token Status", value: "Active (1h Expiry)", trend: "Valid", icon: Lock, color: "from-indigo-500 to-purple-600" },
    { title: "Authentication Provider", value: authUser?.authProvider?.toUpperCase() || "LOCAL", trend: "Secure", icon: KeyRound, color: "from-purple-500 to-pink-600" },
    { title: "Account Security Level", value: "Enterprise 100%", trend: "+12% vs last week", icon: Shield, color: "from-cyan-500 to-blue-600" },
    { title: "Active Session ID", value: authUser?._id ? `usr_${authUser._id.substring(0, 8)}` : "usr_demo123", trend: "Live", icon: Server, color: "from-emerald-500 to-teal-600" },
  ];

  const recentActivities = [
    { title: "Logged in via JWT Auth System", time: "Just now", type: "success", icon: Zap },
    { title: "Verified 1-Hour Access Token Expiration", time: "2 mins ago", type: "info", icon: Clock },
    { title: "Security scan passed - Bcrypt 12 rounds", time: "1 hour ago", type: "success", icon: Shield },
    { title: "Session refreshed cleanly", time: "3 hours ago", type: "warning", icon: FileCheck },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white relative z-10">
      
      {/* Animated Glass Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 border-r border-white/10 glass-card p-6 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0"
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl shimmer-btn flex items-center justify-center text-white shadow-lg glow-primary">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">ApexAuth</h2>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Command Center</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Dashboard", icon: LayoutDashboard },
              { id: "profile", label: "Profile Settings", icon: User, path: "/profile" },
              { id: "security", label: "Security & JWT", icon: Shield },
              { id: "activity", label: "Activity Logs", icon: Activity },
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
                      ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-lg glow-primary"
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

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={authUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-white/20"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{authUser?.username || "Developer"}</p>
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/10 glass-card px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          
          {/* Search Bar */}
          <div className="relative w-72 hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search analytics, logs, security..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs placeholder-gray-500"
            />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>JWT Session Active</span>
            </div>

            <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <img
                  src={authUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/50"
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
                      <p className="text-[10px] text-gray-400 truncate">{authUser?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>Edit Profile</span>
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
            className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-transparent"
          >
            <div className="relative z-10 space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Dashboard</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome back, {authUser?.username || "Commander"} 👋
              </h1>
              <p className="text-sm text-gray-300 leading-relaxed">
                Your authenticated session is active under 1-hour JWT token policy. All system security measures and rate limiters are operating at peak efficiency.
              </p>
              <div className="pt-2 flex gap-3">
                <Link
                  to="/profile"
                  className="px-4 py-2.5 rounded-xl shimmer-btn text-xs font-semibold text-white shadow-lg"
                >
                  Manage Profile
                </Link>
                <button
                  onClick={() => setActiveTab("security")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  View Security Token
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
                    <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{stat.trend}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Activity Section & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Recent Activity Timeline (8 cols) */}
            <div className="lg:col-span-8 glass-card rounded-3xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Security & Activity Feed</h3>
                  <p className="text-xs text-gray-400">Live events recorded for your current account</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  Realtime
                </span>
              </div>

              <div className="space-y-4">
                {recentActivities.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-200 truncate">{act.title}</p>
                        <p className="text-[10px] text-gray-400">{act.time}</p>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                        Verified
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Profile Summary Card (4 cols) */}
            <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4 text-center">
                <img
                  src={authUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
                  alt="Profile Avatar"
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-500/60 shadow-xl"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{authUser?.username}</h3>
                  <p className="text-xs text-indigo-400 font-medium">{authUser?.jobTitle || "Software Engineer"}</p>
                  <p className="text-xs text-gray-400 mt-1">{authUser?.email}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-1.5 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="font-semibold text-white uppercase">{authUser?.role || "USER"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auth Method:</span>
                    <span className="font-semibold text-indigo-400 uppercase">{authUser?.authProvider || "LOCAL"}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/profile"
                className="w-full shimmer-btn py-3 rounded-xl text-center text-xs font-semibold text-white shadow-lg block"
              >
                Edit Full Profile
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
