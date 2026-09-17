import { io } from "socket.io-client";

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    // In dev, Vite proxies /api to port 5000; connect socket to server port 5000 or current host
    const socketUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin;

    socketInstance = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Live WebSockets Connected! Socket ID:", socketInstance.id);
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
