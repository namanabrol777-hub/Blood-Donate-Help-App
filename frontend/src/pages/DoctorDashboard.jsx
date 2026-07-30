import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  PlusCircle,
  Users,
  Activity,
  Search,
  LogOut,
  Droplet,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [requestForm, setRequestForm] = useState({
    patientName: "",
    bloodGroup: "O+",
    unitsNeeded: "2",
    urgency: "HIGH",
    notes: "",
  });

  const [assignedPatients, setAssignedPatients] = useState([
    { id: 1, name: "Eleanor Vance", room: "ICU Room 402", bloodGroup: "O-", status: "CRITICAL", units: 3, hospital: "St. Jude Hospital" },
    { id: 2, name: "Marcus Brody", room: "Ward B 108", bloodGroup: "A+", status: "PENDING", units: 2, hospital: "St. Jude Hospital" },
    { id: 3, name: "Sophia Martinez", room: "Emergency ER-2", bloodGroup: "B-", status: "APPROVED", units: 4, hospital: "St. Jude Hospital" },
  ]);

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!requestForm.patientName) {
      toast.error("Please enter patient name");
      return;
    }

    const newPatient = {
      id: Date.now(),
      name: requestForm.patientName,
      room: "Emergency Ward",
      bloodGroup: requestForm.bloodGroup,
      status: requestForm.urgency === "CRITICAL" ? "CRITICAL" : "PENDING",
      units: Number(requestForm.unitsNeeded),
      hospital: authUser?.hospitalName || "St. Jude Hospital",
    };

    setAssignedPatients([newPatient, ...assignedPatients]);
    toast.success("Emergency Blood Request Dispatched to Blood Banks!");
    setShowRequestModal(false);
    setRequestForm({ patientName: "", bloodGroup: "O+", unitsNeeded: "2", urgency: "HIGH", notes: "" });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white relative z-10">
      
      {/* Clinical Blue Doctor Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-blue-500/20 glass-card p-6 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 bg-blue-950/20"
      >
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg glow-medical-blue">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none tracking-tight">Doctor Portal</h2>
              <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Clinical Dashboard</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { label: "Assigned Patients", icon: Users, active: true },
              { label: "Create Blood Request", icon: PlusCircle, action: () => setShowRequestModal(true) },
              { label: "Track Requests", icon: Activity },
              { label: "Nearby Stock", icon: Building2 },
              { label: "Medical Records", icon: FileText },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => item.action && item.action()}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    item.active
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-lg glow-medical-blue"
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
              src={authUser?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256"}
              alt="Doctor Avatar"
              className="w-9 h-9 rounded-full border border-blue-500/60 object-cover"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{authUser?.fullName || "Dr. Alex Reed"}</p>
              <p className="text-[10px] text-blue-400 font-semibold uppercase truncate">{authUser?.hospitalName || "General Hospital"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-2">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="h-20 border-b border-white/10 glass-card px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-blue-950/10">
          <div className="relative w-72 hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, blood units, medical ID..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity glow-medical-blue"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Blood Request</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10"
              >
                <img
                  src={authUser?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256"}
                  alt="Doctor"
                  className="w-8 h-8 rounded-full object-cover border border-blue-500"
                />
                <span className="text-xs font-bold text-blue-300">DOCTOR PANEL</span>
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
          
          {/* Doctor Greeting Banner */}
          <div className="glass-card rounded-3xl p-8 border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-transparent">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                ROLE 2 — DOCTOR CLINICAL PORTAL
              </span>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome, {authUser?.fullName || "Dr. Physician"} 🩺
              </h1>
              <p className="text-xs text-gray-300">
                Hospital: <span className="text-blue-400 font-bold">{authUser?.hospitalName || "St. Jude General Hospital"}</span> • License: <span className="text-gray-200 font-semibold">{authUser?.licenseNumber || "MD-99201"}</span>
              </p>
            </div>
          </div>

          {/* Assigned Patients Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Assigned Patients & Active Blood Requirements
              </h3>
              <button
                onClick={() => setShowRequestModal(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline"
              >
                + Dispatch New Request
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {assignedPatients.map((patient) => (
                <div key={patient.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 glass-card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{patient.name}</h4>
                      <p className="text-[11px] text-gray-400">{patient.room}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-black text-lg flex items-center justify-center shadow-md">
                      {patient.bloodGroup}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Units Needed:</span>
                      <span className="font-bold text-white">{patient.units} Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hospital:</span>
                      <span className="font-semibold text-blue-300">{patient.hospital}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                      patient.status === "CRITICAL"
                        ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                        : patient.status === "APPROVED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    }`}>
                      {patient.status}
                    </span>
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                      Track Status →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Emergency Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
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
              className="glass-card max-w-lg w-full p-6 rounded-3xl space-y-5 border border-blue-500/30 shadow-2xl relative"
            >
              <button onClick={() => setShowRequestModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Droplet className="w-6 h-6 fill-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Create Emergency Blood Request</h3>
                  <p className="text-xs text-gray-400">Broadcast request directly to regional blood banks</p>
                </div>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 font-medium mb-1 block">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={requestForm.patientName}
                    onChange={(e) => setRequestForm({ ...requestForm, patientName: e.target.value })}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-medium mb-1 block">Required Blood Group</label>
                    <select
                      value={requestForm.bloodGroup}
                      onChange={(e) => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}
                      className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-red-400 font-bold bg-[#09090b]"
                    >
                      {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                        <option key={bg} value={bg}>{bg} Blood</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 font-medium mb-1 block">Units Needed</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={requestForm.unitsNeeded}
                      onChange={(e) => setRequestForm({ ...requestForm, unitsNeeded: e.target.value })}
                      className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-medium mb-1 block">Urgency Level</label>
                  <select
                    value={requestForm.urgency}
                    onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm bg-[#09090b]"
                  >
                    <option value="CRITICAL">🔴 CRITICAL (Immediate Life Threat)</option>
                    <option value="HIGH">🟠 HIGH (Within 2 Hours)</option>
                    <option value="NORMAL">🟢 NORMAL (Scheduled Surgery)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-xl cursor-pointer"
                >
                  Dispatch Emergency Request
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDashboard;
