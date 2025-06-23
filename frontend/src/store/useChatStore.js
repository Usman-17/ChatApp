import axios from "axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axios.get("/api/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(error?.response?.data?.error || "Error fetching users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axios.get(`/api/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error(error?.response?.data?.error || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Failed to send messages:", error);
      toast.error(error?.response?.data?.error || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = get();
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
