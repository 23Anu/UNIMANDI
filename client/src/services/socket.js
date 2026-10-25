import { io } from "socket.io-client";

let socketInstance = null;

const resolveSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }

  return window.location.origin;
};

export const getSocket = () => {
  if (!socketInstance) {
    const socketUrl = resolveSocketUrl();

    socketInstance = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Live WebSockets Connected! Socket ID:", socketInstance.id);
    });

    socketInstance.on("connect_error", (error) => {
      console.warn("Socket connection error:", error?.message || error);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 WebSockets Disconnected:", reason);
    });
  }

  return socketInstance;
};

export const registerUserSocket = (userId) => {
  const socket = getSocket();
  if (socket && userId) {
    socket.emit("register_user", userId);
  }
};

export const joinChatRoom = (chatId) => {
  const socket = getSocket();
  if (socket && chatId) {
    socket.emit("join_chat", chatId);
  }
};

export const leaveChatRoom = (chatId) => {
  const socket = getSocket();
  if (socket && chatId) {
    socket.emit("leave_chat", chatId);
  }
};
