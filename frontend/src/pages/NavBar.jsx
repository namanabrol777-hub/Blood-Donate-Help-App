import React from "react";
import logo from "/logo.png";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleViewProfile = async () => {
    try {
      navigate("/profile");
    } catch (error) {
      console.log("erorrr", error);
    }
  }

  const handleDashboard = async () => {
    try {
      navigate("/");
    } catch (error) {
      console.log("erorr", error);
    }
  }

  const handleDonate = async () => {
    try {
      navigate("/sampleAppointment");
    } catch (error) {
      console.log("erorr", error);
    }
  }

  const handleReport = async () => {
    try {
      navigate("/sampleReport");
    } catch (error) {
      console.log("erorr", error);
    }
  }

  const handleFileReport = async () => {
    try {
      navigate("/sampleFileReport");
    } catch (error) {
      console.log("erorr", error);
    }
  }

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.log("errorrr", error);
    }
  }

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="BloodLink" className="w-40" />
      </div>

      {/* Links */}
      <div className="space-x-6 text-gray-700 font-medium hidden md:flex">
        <a href="#" className="hover:text-red-500 cursor-pointer" onClick={handleDashboard}>Dashboard</a>
        <a href="#" className="hover:text-red-500 cursor-pointer" onClick={handleDonate}>Donate</a>
        <a href="#" className="hover:text-red-500 cursor-pointer" onClick={handleReport}>Report</a>
        <a href="#" className="hover:text-red-500 cursor-pointer" onClick={handleFileReport}>Report Shortage</a>
      </div>

      {/* Profile + Logout buttons */}
      <div className="space-x-3">
        <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 cursor-pointer" onClick={handleViewProfile}>
          View Profile
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
