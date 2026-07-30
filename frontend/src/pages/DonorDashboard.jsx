import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import TiltCard from "../components/TiltCard";
import toast from "react-hot-toast";

const DonorDashboard = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showBookModal, setShowBookModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("Metropolitan Central Blood Bank");

  const [emergencyAlerts, setEmergencyAlerts] = useState([
    { id: 1, hospital: "St. Jude Children's Hospital", bloodGroup: authUser?.bloodGroup || "O+", distance: "2.4 km away", urgency: "CRITICAL", units: 2 },
    { id: 2, hospital: "City General Trauma Center", bloodGroup: authUser?.bloodGroup || "O+", distance: "4.1 km away", urgency: "HIGH", units: 3 },
  ]);

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!appointmentDate) {
      toast.error("Please select an appointment date");
      return;
    }
    toast.success(`Donation Appointment Booked at ${selectedCenter} on ${appointmentDate}! ❤️`);
    setShowBookModal(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white relative z-10">
      
      {/* Red & Pink Donor Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-rose-500/20 glass-card p-6 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 bg-rose-950/20"
      >
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg glow-medical-red">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none tracking-tight">BloodLink</h2>
              <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase">Donor Community</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { label: "Donor Dashboard", icon: Heart, active: true },
              { label: "Book Appointment", icon: Calendar, action: () => setShowBookModal(true) },
              { label: "Emergency Alerts", icon: AlertTriangle },
              { label: "Donor Card", icon: QrCode },
              { label: "Badges & Rewards", icon: Award },
              { label: "Profile Settings", icon: User, path: "/profile" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    else if (item.action) item.action();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    item.active
                      ? "bg-rose-600/30 text-rose-300 border border-rose-500/50 shadow-lg glow-medical-red"
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
              src={authUser?.avatar || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256"}
              alt="Donor Avatar"
              className="w-9 h-9 rounded-full border border-rose-500/60 object-cover"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{authUser?.username || "Donor"}</p>
              <p className="text-[10px] text-rose-400 font-bold uppercase truncate">BLOOD: {authUser?.bloodGroup || "O+"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-2">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* Main Donor View */}
      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="h-20 border-b border-white/10 glass-card px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-rose-950/10">
          <div className="relative w-72 hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blood banks, drives, emergency alerts..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowBookModal(true)}
              className="px-4 py-2 rounded-xl shimmer-btn-red text-white text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Donation Appointment</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10"
              >
                <img
                  src={authUser?.avatar || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256"}
                  alt="Donor"
                  className="w-8 h-8 rounded-full object-cover border border-rose-500"
                />
                <span className="text-xs font-bold text-rose-300">DONOR PANEL</span>
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

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Banner */}
          <div className="glass-card rounded-3xl p-8 border border-rose-500/30 bg-gradient-to-r from-red-950/40 via-rose-950/30 to-transparent">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                ROLE 4 — LIFESAVING DONOR PORTAL
              </span>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome, Hero {authUser?.username || "Donor"} ❤️
              </h1>
              <p className="text-xs text-gray-300">
                Your single blood donation can save up to 3 human lives. Thank you for being a part of the BloodLink community!
              </p>
            </div>
          </div>

          {/* Top Row: Digital Donor Card (6 cols) & Stats (6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Digital Donor Card Widget (6 cols) */}
            <div className="lg:col-span-6">
              <TiltCard>
                <div className="glass-card rounded-3xl p-6 border border-rose-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-red-900/40 via-rose-950/30 to-black space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl shimmer-btn-red flex items-center justify-center text-white font-bold text-lg shadow-md">
                        <Droplet className="w-5 h-5 fill-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Digital Donor ID</h3>
                        <p className="text-[10px] text-rose-400 font-semibold tracking-wider">BLOODLINK EMERGENCY NETWORK</p>
                      </div>
                    </div>

                    <div className="px-4 py-1.5 rounded-full bg-red-600 border border-red-500 text-white font-black text-xl shadow-lg">
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
                      <span className="text-gray-400 text-[10px] uppercase block">Donor Status</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Eligible to Donate
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase block">Donation Streak</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {authUser?.donationStreak || 4} Streak
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <QrCode className="w-4 h-4 text-rose-400" />
                      Show QR code at blood bank
                    </span>
                    <span className="text-gray-300 font-semibold">1-Hour JWT Auth Active</span>
                  </div>

                </div>
              </TiltCard>
            </div>

            {/* Impact & Streak Stats (6 cols) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              
              <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3 glass-card-hover flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Heart className="w-6 h-6 fill-red-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white">12 Lives</h3>
                  <p className="text-xs text-rose-400 font-semibold">Saved Through Donations</p>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3 glass-card-hover flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white">Platinum</h3>
                  <p className="text-xs text-amber-400 font-semibold">Donor Badge Level</p>
                </div>
              </div>

              <div className="col-span-2 glass-card rounded-3xl p-6 border border-white/10 space-y-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Ready for Next Donation?</h4>
                  <p className="text-xs text-gray-400">You are fully eligible to donate blood today.</p>
                </div>
                <button
                  onClick={() => setShowBookModal(true)}
                  className="px-5 py-2.5 rounded-xl shimmer-btn-red text-xs font-bold text-white shadow-lg shrink-0"
                >
                  Book Appointment Now
                </button>
              </div>

            </div>

          </div>

          {/* Emergency Alerts Near You */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Urgent Blood Requirements Matching Your Blood Group ({authUser?.bloodGroup || "O+"})
                </h3>
                <p className="text-xs text-gray-400">Hospitals near your location asking for immediate assistance</p>
              </div>
            </div>

            <div className="space-y-3">
              {emergencyAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-rose-500/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 font-black text-lg flex items-center justify-center">
                      {alert.bloodGroup}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{alert.hospital}</h4>
                      <p className="text-[11px] text-gray-400"><MapPin className="w-3 h-3 inline text-rose-400" /> {alert.distance} • Needed: <span className="text-white font-bold">{alert.units} Units</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success(`Thank you! Hospital notified of your response for ${alert.hospital}`)}
                    className="px-4 py-2 rounded-xl shimmer-btn-red text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Respond & Donate
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {showBookModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full p-6 rounded-3xl space-y-5 border border-rose-500/40 shadow-2xl relative"
            >
              <button onClick={() => setShowBookModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl shimmer-btn-red text-white flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Book Donation Appointment</h3>
                  <p className="text-xs text-gray-400">Choose a blood bank & preferred time</p>
                </div>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 font-medium mb-1 block">Blood Donation Center</label>
                  <select
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm bg-[#09090b]"
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
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl shimmer-btn-red text-white font-bold text-sm shadow-xl cursor-pointer"
                >
                  Confirm Donation Appointment
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DonorDashboard;
