import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

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
      get().connectSocket();
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
      get().connectSocket();
      return true;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong during signup";
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

      get().connectSocket();
      return true;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong during signup";
      toast.error(msg);
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
      set({ authUser: null });

      toast.success("Logged out successfully");
      get().disconnectSocket();
      return true;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong during signup";
      toast.error(msg);
      return false;
    }
  },

  forgotPassword: async (data) => {
    set({ isForgotingPassword: true });
    try {
      await axios.post("/api/auth/forgot-password", data);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return false;
    } finally {
      set({ isForgotingPassword: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put("/api/auth/profile/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.user;
      set({ authUser: updatedUser });
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      const msg =
        error.response?.data?.error || "Something went wrong during update";
      toast.error(msg);
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
