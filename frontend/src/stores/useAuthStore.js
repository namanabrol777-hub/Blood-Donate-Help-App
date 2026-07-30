import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const getDashboardRoute = (role) => {
  const normalizedRole = role ? role.toUpperCase() : "DONOR";
  switch (normalizedRole) {
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
  authUser: JSON.parse(localStorage.getItem("authUser")) || null,
  token: localStorage.getItem("token") || null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      if (res.data.success) {
        set({ authUser: res.data.user });
        localStorage.setItem("authUser", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.log("Auth check verification failed");
      set({ authUser: null, token: null });
      localStorage.removeItem("authUser");
      localStorage.removeItem("token");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      if (res.data.success) {
        set({ authUser: res.data.user, token: res.data.token });
        localStorage.setItem("authUser", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message || "Registered successfully!");
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      if (res.data.success) {
        set({ authUser: res.data.user, token: res.data.token });
        localStorage.setItem("authUser", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        toast.success(`Welcome back, ${res.data.user.username}!`);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid credentials";
      toast.error(msg);
      return { success: false };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoggingIn: true });
    try {
      const dummyGooglePayload = {
        email: `donor_${Math.floor(Math.random() * 1000)}@gmail.com`,
        name: "Google Donor",
        googleId: `google_${Date.now()}`,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256",
      };

      const res = await axiosInstance.post("/auth/google", dummyGooglePayload);
      if (res.data.success) {
        set({ authUser: res.data.user, token: res.data.token });
        localStorage.setItem("authUser", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        toast.success("Signed in with Google!");
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      toast.error("Google authentication failed");
      return { success: false };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  loginWithFacebook: async () => {
    set({ isLoggingIn: true });
    try {
      const dummyFbPayload = {
        email: `donor_${Math.floor(Math.random() * 1000)}@facebook.com`,
        name: "Facebook Donor",
        facebookId: `fb_${Date.now()}`,
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=256",
      };

      const res = await axiosInstance.post("/auth/facebook", dummyFbPayload);
      if (res.data.success) {
        set({ authUser: res.data.user, token: res.data.token });
        localStorage.setItem("authUser", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        toast.success("Signed in with Facebook!");
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      toast.error("Facebook authentication failed");
      return { success: false };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.log("Logout request error");
    } finally {
      set({ authUser: null, token: null });
      localStorage.removeItem("authUser");
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
    }
  },

  updateProfile: async (profileData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/profile", profileData);
      if (res.data.success) {
        set({ authUser: res.data.user });
        localStorage.setItem("authUser", JSON.stringify(res.data.user));
        toast.success("Profile updated successfully");
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
