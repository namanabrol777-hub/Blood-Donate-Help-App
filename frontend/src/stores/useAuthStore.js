import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

axios.defaults.withCredentials = true;

// Helper to determine dashboard path based on activeRole
export const getDashboardRoute = (roleOrActive) => {
  const normalized = (roleOrActive || "DONOR").toUpperCase();
  switch (normalized) {
    case "ADMIN":
      return "/admin/dashboard";
    case "DOCTOR":
      return "/doctor/dashboard";
    case "BLOOD_BANK":
      return "/bloodbank/dashboard";
    case "DONOR":
    default:
      return "/donor/dashboard";
  }
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/check`);
      set({ authUser: res.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, data);
      set({ authUser: res.data.user, isSigningUp: false });
      return { success: true, user: res.data.user };
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      set({ isSigningUp: false });
      return { success: false, message };
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      set({ authUser: res.data.user, isLoggingIn: false });
      return { success: true, user: res.data.user };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      set({ isLoggingIn: false });
      return { success: false, message };
    }
  },

  loginWithGoogle: async (selectedRole) => {
    set({ isLoggingIn: true });
    try {
      const mockGooglePayload = {
        email: "googleuser@bloodlink.org",
        name: "Google Hero Donor",
        googleId: "google-123456",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=googleuser",
        selectedRole: selectedRole || "DONOR",
      };
      const res = await axios.post(`${API_URL}/auth/google`, mockGooglePayload);
      set({ authUser: res.data.user, isLoggingIn: false });
      toast.success("Signed in with Google!");
      return { success: true, user: res.data.user };
    } catch (error) {
      const message = error.response?.data?.message || "Google Auth Failed";
      toast.error(message);
      set({ isLoggingIn: false });
      return { success: false, message };
    }
  },

  loginWithFacebook: async (selectedRole) => {
    set({ isLoggingIn: true });
    try {
      const mockFBPayload = {
        email: "fbuser@bloodlink.org",
        name: "Facebook Lifesaver",
        facebookId: "fb-123456",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fbuser",
        selectedRole: selectedRole || "DONOR",
      };
      const res = await axios.post(`${API_URL}/auth/facebook`, mockFBPayload);
      set({ authUser: res.data.user, isLoggingIn: false });
      toast.success("Signed in with Facebook!");
      return { success: true, user: res.data.user };
    } catch (error) {
      const message = error.response?.data?.message || "Facebook Auth Failed";
      toast.error(message);
      set({ isLoggingIn: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      return { success: false, message };
    }
  },
}));
