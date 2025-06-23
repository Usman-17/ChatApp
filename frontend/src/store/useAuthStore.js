import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isForgotingPassword: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axios.get("/api/auth/user");
      set({ authUser: res.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/api/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      try {
        get().connectSocket();
      } catch (socketError) {
        console.error("Socket connection error:", socketError);
      }

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      const msg =
        error.response?.data?.error || "Something went wrong during signup";
      toast.error(msg);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post("/api/auth/login", data);
      set({ authUser: res.data });

      try {
        get().connectSocket();
      } catch (socketError) {
        console.error("Socket connection error:", socketError);
      }

      return true;
    } catch (error) {
      const msg =
        error.response?.data?.error || "Something went wrong during signup";
      toast.error(msg);
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  forgotPassword: async (data) => {
    set({ isForgotingPassword: true });
    try {
      await axios.post("/api/auth/forgot-password", data);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error);
      return false;
    } finally {
      set({ isForgotingPassword: false });
    }
  },
}));
