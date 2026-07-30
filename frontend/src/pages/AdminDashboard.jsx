import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Users,
  Building2,
  Stethoscope,
  Activity,
  Sparkles,
  Search,
  LogOut,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  BrainCircuit,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const [verificationQueue, setVerificationQueue] = useState([
    { id: 1, name: "Dr. Robert Vance", type: "DOCTOR", hospital: "St. Jude Children's Hospital", license: "MD-88392-NY", status: "PENDING" },
    { id: 2, name: "Metropolitan Life Blood Bank", type: "BLOOD_BANK", hospital: "City Center", license: "BB-99201-CA", status: "PENDING" },
    { id: 3, name: "Dr. Sarah Lin", type: "DOCTOR", hospital: "Mercy General Hospital", license: "MD-44210-TX", status: "VERIFIED" },
    { id: 4, name: "Red Cross Blood Center #4", type: "BLOOD_BANK", hospital: "District 9", license: "BB-11204-FL", status: "PENDING" },
  ]);

  const handleApprove = (id) => {
    setVerificationQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "VERIFIED" } : item))
    );
    toast.success("License & Role verified successfully!");
  };

  const handleSuspend = (id) => {
    setVerificationQueue((prev) => prev.filter((item) => item.id !== id));
    toast.error("User suspended and revoked.");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white relative z-10">
      
      {/* Deep Indigo/Purple Admin Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-indigo-500/20 glass-card p-6 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 bg-indigo-950/20"
      >
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg glow-primary">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none tracking-tight">Super Admin</h2>
              <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Platform Governance</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { label: "Platform Analytics", icon: Activity, active: true },
              { label: "User Management", icon: Users },
              { label: "Doctor Approvals", icon: Stethoscope },
              { label: "Blood Banks", icon: Building2 },
              { label: "AI Predictions", icon: BrainCircuit },
              { label: "Audit & Logs", icon: FileSpreadsheet },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    item.active
                      ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-lg glow-primary"
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

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={authUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full border border-purple-500/60 object-cover"
            />
            <div>
              <p className="text-xs font-bold text-white">Super Admin</p>
              <p className="text-[10px] text-purple-400 uppercase font-semibold">ROLE: ADMIN</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-2">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* Main Admin View */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar */}
        <header className="h-20 border-b border-white/10 glass-card px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-indigo-950/10">
          <div className="relative w-72 hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, doctors, logs..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>System Health: 100% Operational</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10"
              >
                <img
                  src={authUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover border border-purple-500"
                />
                <span className="text-xs font-bold text-indigo-300">ADMIN PANEL</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-2 border border-white/10 z-50">
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/5 rounded-lg flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Admin Banner */}
          <div className="glass-card rounded-3xl p-8 border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-transparent">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                ROLE 1 — SUPER ADMIN GOVERNANCE
              </span>
              <h1 className="text-3xl font-extrabold text-white">BloodLink Global System Controls</h1>
              <p className="text-xs text-gray-300">
                Full governance over 25,480 users, 18,240 registered donors, 840 verified doctors, and 320 connected blood banks.
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Total Users", val: "25,480", icon: Users, color: "from-indigo-600 to-blue-600" },
              { title: "Active Donors", val: "18,240", icon: Activity, color: "from-purple-600 to-pink-600" },
              { title: "Verified Doctors", val: "840", icon: Stethoscope, color: "from-blue-600 to-cyan-600" },
              { title: "Blood Banks", val: "320", icon: Building2, color: "from-amber-600 to-red-600" },
              { title: "Emergency Requests", val: "14 Active", icon: AlertTriangle, color: "from-red-600 to-rose-600" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-card rounded-2xl p-4 border border-white/10 space-y-3 glass-card-hover">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">{stat.title}</span>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{stat.val}</h3>
                </div>
              );
            })}
          </div>

          {/* AI Predictions & Doctor Verification Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Verification Table (8 cols) */}
            <div className="lg:col-span-8 glass-card rounded-3xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Doctor & Blood Bank Verification Queue</h3>
                  <p className="text-xs text-gray-400">Review medical licenses and assign platform roles</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                  {verificationQueue.filter((i) => i.status === "PENDING").length} Pending Verification
                </span>
              </div>

              <div className="space-y-3">
                {verificationQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                          item.type === "DOCTOR" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">{item.hospital} • License: <span className="text-gray-200 font-semibold">{item.license}</span></p>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === "VERIFIED" ? (
                        <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                          VERIFIED
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                          <button
                            onClick={() => handleSuspend(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 text-[11px] font-semibold flex items-center gap-1 border border-red-500/30"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Predictions & Insights (4 cols) */}
            <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-white/10 space-y-6 bg-gradient-to-b from-purple-950/20 to-transparent">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
                <div>
                  <h3 className="text-base font-bold text-white">AI Shortage Predictions</h3>
                  <p className="text-[11px] text-gray-400">7-Day Forecast Insights</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <p className="font-bold text-amber-400">⚠️ O- Negative Shortage Risk</p>
                  <p className="text-gray-300 text-[11px]">District 4 predicted to face a 28% shortage in O- Negative units by Thursday.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <p className="font-bold text-emerald-400">✅ A+ Surplus Expected</p>
                  <p className="text-gray-300 text-[11px]">Recent donation drive added 140+ units of A+ blood to Metropolitan Blood Center.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-1">
                  <p className="font-bold text-indigo-300">🤖 AI Dispatch Optimization</p>
                  <p className="text-gray-300 text-[11px]">Rerouted 15 units of AB- blood to City General Hospital ahead of peak hours.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
