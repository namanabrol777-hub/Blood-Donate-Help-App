import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Droplet,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  LogOut,
  Calendar,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import toast from "react-hot-toast";

const BloodBankDashboard = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const [inventory, setInventory] = useState({
    "O+": 42,
    "O-": 8, // Low Stock Warning
    "A+": 35,
    "A-": 12, // Low Stock Warning
    "B+": 28,
    "B-": 19,
    "AB+": 24,
    "AB-": 6, // Low Stock Warning
  });

  const [requests, setRequests] = useState([
    { id: 1, hospital: "St. Jude Hospital", doctor: "Dr. Alex Reed", bloodGroup: "O-", units: 3, urgency: "CRITICAL", status: "PENDING" },
    { id: 2, hospital: "City General Hospital", doctor: "Dr. Sarah Lin", bloodGroup: "A+", units: 2, urgency: "HIGH", status: "PENDING" },
    { id: 3, hospital: "Mercy Trauma Center", doctor: "Dr. Vance", bloodGroup: "B+", units: 4, urgency: "NORMAL", status: "APPROVED" },
  ]);

  const updateUnits = (group, delta) => {
    setInventory((prev) => {
      const current = prev[group] || 0;
      const next = Math.max(0, current + delta);
      toast.success(`${group} stock updated to ${next} units`);
      return { ...prev, [group]: next };
    });
  };

  const handleAcceptRequest = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
    toast.success("Blood units dispatched to hospital!");
  };

  const handleRejectRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.error("Request rejected.");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white relative z-10">
      
      {/* Crimson Blood Bank Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-red-500/20 glass-card p-6 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 bg-red-950/20"
      >
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg glow-medical-red">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none tracking-tight">Blood Bank</h2>
              <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">Stock Inventory</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { label: "Blood Inventory", icon: Layers, active: true },
              { label: "Hospital Requests", icon: Droplet },
              { label: "Schedule Donations", icon: Calendar },
              { label: "Low Stock Alerts", icon: AlertTriangle },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    item.active
                      ? "bg-red-600/30 text-red-300 border border-red-500/50 shadow-lg glow-medical-red"
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
            <div className="w-9 h-9 rounded-full bg-red-600/30 border border-red-500 text-red-400 font-bold text-xs flex items-center justify-center">
              BB
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{authUser?.bankName || "Metropolitan Blood Bank"}</p>
              <p className="text-[10px] text-red-400 uppercase font-semibold">ROLE: BLOOD_BANK</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-2">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="h-20 border-b border-white/10 glass-card px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-red-950/10">
          <div className="relative w-72 hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blood group, units, hospital..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>3 Groups Low Stock Warning</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center font-bold text-xs text-red-400">
                  BB
                </div>
                <span className="text-xs font-bold text-red-400">BLOOD BANK PANEL</span>
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

        {/* Dashboard Body */}
        <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Banner */}
          <div className="glass-card rounded-3xl p-8 border border-red-500/30 bg-gradient-to-r from-red-950/40 via-rose-950/20 to-transparent">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                ROLE 3 — BLOOD BANK INVENTORY CONTROL
              </span>
              <h1 className="text-3xl font-extrabold text-white">
                {authUser?.bankName || "Metropolitan Central Blood Bank"} Stock Room
              </h1>
              <p className="text-xs text-gray-300">
                Live inventory tracking across all 8 blood groups with real-time hospital dispatch capabilities.
              </p>
            </div>
          </div>

          {/* Interactive Blood Stock Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-500 fill-red-500" />
              Live Blood Group Stock Inventory
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(inventory).map(([group, count]) => {
                const isLow = count < 15;
                return (
                  <div key={group} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3 relative overflow-hidden glass-card-hover">
                    {isLow && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-[10px]">
                        LOW STOCK
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-black text-xl flex items-center justify-center shadow-lg">
                        {group}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white">{count}</h4>
                        <p className="text-[10px] text-gray-400 uppercase">Units Available</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => updateUnits(group, 1)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1 border border-emerald-500/30 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Unit</span>
                      </button>
                      <button
                        onClick={() => updateUnits(group, -1)}
                        className="flex-1 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1 border border-red-500/30 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hospital Requests Queue */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Hospital Emergency Dispatch Queue</h3>
                <p className="text-xs text-gray-400">Review pending requests submitted by verified doctors</p>
              </div>
            </div>

            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 font-black text-base flex items-center justify-center">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{req.hospital}</h4>
                      <p className="text-[11px] text-gray-400">Doctor: <span className="text-gray-200 font-semibold">{req.doctor}</span> • Units: <span className="text-white font-bold">{req.units} Units</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {req.status === "APPROVED" ? (
                      <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                        DISPATCHED
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="px-3.5 py-1.5 rounded-lg shimmer-btn-red text-white text-[11px] font-bold flex items-center gap-1 shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Dispatch</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-red-600/30 text-gray-400 hover:text-red-300 text-[11px] font-semibold border border-white/10"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default BloodBankDashboard;
