import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from "firebase/auth";

export const useAuthStore = create((set, get) => ({
  authUser: JSON.parse(localStorage.getItem("authUser")) || null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    
    // First check if we have auth data in localStorage
    const storedUser = localStorage.getItem("authUser");
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        // If user has Firebase uid but no backend token, it's an OAuth user
        if (userData.uid && !userData.token) {
          // For OAuth users, verify with Firebase instead of backend
          const currentFirebaseUser = auth.currentUser;
          
          if (currentFirebaseUser && currentFirebaseUser.uid === userData.uid) {
            // Firebase session is still valid
            set({ authUser: userData, isCheckingAuth: false });
            return;
          } else {
            // Firebase session expired, clear local auth
            localStorage.removeItem("authUser");
            set({ authUser: null, isCheckingAuth: false });
            return;
          }
        }
        
        // For backend users, verify with the backend
        const response = await axiosInstance.get("/auth/check");
        set({ authUser: response.data, isCheckingAuth: false });
      } catch (error) {
        console.log("Authentication check failed, clearing local session");
        localStorage.removeItem("authUser");
        set({ authUser: null, isCheckingAuth: false });
      }
    } else {
      // No stored user found
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  signupWithBackend: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      localStorage.setItem("authUser", JSON.stringify(res.data));
      toast.success("Account created successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during signup.";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Firebase Signup
  signupWithFirebase: async (provider) => {
    set({ isSigningUp: true });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
  
      set({ authUser: userData });
      localStorage.setItem("authUser", JSON.stringify(userData));
      toast.success("Signed up successfully with Firebase");
    } catch (error) {
      toast.error(error.message || "Social login failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login function to handle OAuth or backend login
  login: async (data, provider = null) => {
    set({ isLoggingIn: true });
    try {
      if (provider) {
        // OAuth login (using Firebase)
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        set({ authUser: userData });
        localStorage.setItem("authUser", JSON.stringify(userData));
        toast.success("Logged in successfully with Firebase");
      } else {
        // Regular backend login
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        localStorage.setItem("authUser", JSON.stringify(res.data));
        toast.success("Logged in successfully");
      }
    } catch (error) {
      let errorMessage = "An error occurred during login.";
      if (error.response) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout function to handle both OAuth and regular logout
  // Logout function to handle both OAuth and regular logout
  logout: async () => {
    try {
      const currentUser = get().authUser;
      
      // Handle Firebase signout if applicable
      if (currentUser?.uid) {
        try {
          await signOut(auth);
        } catch (firebaseError) {
          console.warn("Firebase signout error:", firebaseError);
        }
      }
      
      // Only call backend logout if we have a token/session
      if (currentUser?.token) {
        try {
          await axiosInstance.post("/auth/logout");
        } catch (error) {
          console.warn("Backend logout failed, proceeding with local logout");
        }
      }
      
      // Always clear local state
      set({ authUser: null });
      localStorage.removeItem("authUser");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout process. Your local session has been cleared.");
      // Force clear local state even if there was an error
      set({ authUser: null });
      localStorage.removeItem("authUser");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updatePhone: async (data) => {
    set({ isUpdatingPhone: true });
    try {
      const res = await axiosInstance.put("/auth/updatePhone", { phone: Number(data.phone) });
      set((prev) => ({
        ...prev,
        authUser: {
          ...prev.authUser,
          phoneNumber: res.data.phone, // ✅ Fix here
        },
      }));
      toast.success("Phone updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update phone");
    } finally {
      set({ isUpdatingPhone: false });
    }
  },

  updateAddress: async (data) => {
    set({ isUpdatingAddress: true });
    try {
      const res = await axiosInstance.put("/auth/updateAddress", { address: String(data.address) });
      set((prev) => ({
        ...prev,
        authUser: {
          ...prev.authUser,
          address: res.data.address, // ✅ This is fine
        },
      }));
      toast.success("Address updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
    } finally {
      set({ isUpdatingAddress: false });
    }
  },

  changePassword: async (passwordData) => {
    const token = localStorage.getItem('token');
    if (!token || !get().authUser) return null;
    
    set({ isLoading: true, error: null });
    
    try {
      await axios.put(
        `${API_URL}/users/${get().authUser._id}/password`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Password change error:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to change password',
        isLoading: false 
      });
      return false;
    }
  },
  
  clearError: () => set({ error: null })
}));
