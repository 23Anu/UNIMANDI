import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useListings } from "./ListingsContext";
import { initialUsers } from "../data/seedListings";
import { chatApi, dealApi } from "../services/api";
import { getSocket, joinChatRoom, leaveChatRoom } from "../services/socket";

const ChatContext = createContext();

const SEED_CHATS = [
  {
    id: "chat_201",
    listingId: "item_101",
    buyerId: "user_3",
    sellerId: "user_1",
    activeOffer: {
      amount: 50,
      offeredBy: "user_3",
      status: "accepted",
      counterAmount: null,
    },
    dealConfirmation: {
      buyerConfirmed: true,
      sellerConfirmed: false,
      completedAt: null,
    },
    messages: [
      {
        id: "msg_1",
        senderId: "user_3",
        text: "Hi Aarav, is the OS book with notes still available?",
        timestamp: "2026-09-08T10:10:00Z",
      },
      {
        id: "msg_offer_1",
        senderId: "user_3",
        type: "offer",
        offerAmount: 50,
        text: "🤝 Made an offer of ₹50/week (Listed: ₹60)",
        timestamp: "2026-09-08T10:12:00Z",
      },
      {
        id: "msg_2",
        senderId: "user_1",
        text: "Yes Rohan, offer accepted! You can pick it up from Hostel 4 tonight.",
        timestamp: "2026-09-08T10:15:00Z",
      },
      {
        id: "msg_3",
        senderId: "user_3",
        text: "Great! Can we meet near the Nescafe stall at 6 PM?",
        timestamp: "2026-09-08T10:18:00Z",
      },
    ],
    updatedAt: "2026-09-08T10:18:00Z",
  },
  {
    id: "chat_202",
    listingId: "item_102",
    buyerId: "user_1",
    sellerId: "user_2",
    activeOffer: {
      amount: 1600,
      offeredBy: "user_1",
      status: "pending",
      counterAmount: null,
    },
    dealConfirmation: {
      buyerConfirmed: false,
      sellerConfirmed: false,
      completedAt: null,
    },
    messages: [
      {
        id: "msg_201",
        senderId: "user_1",
        text: "Hi Priya! Is the TI-84 Graphic Calculator available for inspection?",
        timestamp: "2026-09-08T11:00:00Z",
      },
      {
        id: "msg_202",
        senderId: "user_2",
        text: "Hey Aarav! Yes, it is in great condition with fresh batteries. You can test it at Girls Hostel B or SAC.",
        timestamp: "2026-09-08T11:05:00Z",
      },
      {
        id: "msg_offer_202",
        senderId: "user_1",
        type: "offer",
        offerAmount: 1600,
        text: "🤝 Made an offer of ₹1,600 (Listed: ₹1,800)",
        timestamp: "2026-09-08T11:10:00Z",
      },
    ],
    updatedAt: "2026-09-08T11:10:00Z",
  }
];

export const ChatProvider = ({ children }) => {
  const { currentUser, registeredUsers } = useAuth();
  const { listings, updateListingStatus } = useListings();

  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem("rentify_chats_v4");
      return saved ? JSON.parse(saved) : SEED_CHATS;
    } catch (e) {
      return SEED_CHATS;
    }
  });

  const [activeChatId, setActiveChatId] = useState("chat_201");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dealRatingPrompt, setDealRatingPrompt] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTypingUser, setRemoteTypingUser] = useState(null);

  // Fetch live chats from backend
  const fetchLiveChats = async () => {
    if (!currentUser) return;
    try {
      const res = await chatApi.getUserChats(currentUser.id);
      if (res.chats && res.chats.length > 0) {
        setChats(res.chats);
      }
    } catch (err) {
      console.warn("Could not fetch remote chats, using local cache:", err.message);
    }
  };

  useEffect(() => {
    fetchLiveChats();
  }, [currentUser?.id]);

  // Socket.io Real-time event listeners
  useEffect(() => {
    const socket = getSocket();

    // 1. Live Message Listener with strict deduplication
    const handleNewMessage = ({ chatId, message, chat: updatedChat }) => {
      setChats((prev) => {
        const chatIndex = prev.findIndex((c) => c.id === chatId);
        if (chatIndex === -1) {
          return updatedChat ? [updatedChat, ...prev] : prev;
        }

        const currentChat = prev[chatIndex];
        const msgExists = currentChat.messages.some(
          (m) =>
            m.id === message.id ||
            (m.senderId === message.senderId &&
              m.text === message.text &&
              Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 3500)
        );

        if (msgExists) return prev;

        const updated = {
          ...currentChat,
          messages: [...currentChat.messages, message],
          updatedAt: message.timestamp,
        };

        const remaining = prev.filter((c) => c.id !== chatId);
        return [updated, ...remaining];
      });
    };

    // 2. Live Offer Listener
    const handleOfferUpdated = ({ chatId, activeOffer, message, chat: updatedChat, finalAmount }) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id === chatId) {
            const hasMsg = message ? c.messages.some((m) => m.id === message.id) : true;
            return {
              ...c,
              activeOffer,
              finalAmount: finalAmount || c.finalAmount || (activeOffer?.status === "accepted" ? activeOffer.amount : null),
              messages: message && !hasMsg ? [...c.messages, message] : c.messages,
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        });
      });
    };

    // 3. Live Deal Status Listener
    const handleDealStatusUpdated = ({ chatId, dealConfirmation, isBothConfirmed, listingStatus, listing, finalAmount }) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id === chatId) {
            return {
              ...c,
              dealConfirmation,
              finalAmount: finalAmount || c.finalAmount,
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        });
      });

      if (listing) {
        updateListingStatus(listing.id, listingStatus);
      }

      if (isBothConfirmed && currentUser) {
        const chat = chats.find((c) => c.id === chatId);
        if (chat) {
          const isBuyer = chat.buyerId === currentUser.id;
          const otherUserId = isBuyer ? chat.sellerId : chat.buyerId;
          const otherUser = (registeredUsers || initialUsers).find((u) => u.id === otherUserId);

          setDealRatingPrompt({
            listingId: chat.listingId,
            targetUserId: otherUserId,
            targetUserName: otherUser?.name || "Campus Peer",
            chatId: chat.id,
          });
        }
      }
    };

    // 4. Live Typing Listeners
    const handleUserTyping = ({ chatId, userName }) => {
      if (chatId === activeChatId) {
        setRemoteTypingUser(userName);
      }
    };

    const handleUserStopTyping = ({ chatId }) => {
      if (chatId === activeChatId) {
        setRemoteTypingUser(null);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("offer_updated", handleOfferUpdated);
    socket.on("deal_status_updated", handleDealStatusUpdated);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("offer_updated", handleOfferUpdated);
      socket.off("deal_status_updated", handleDealStatusUpdated);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [activeChatId, currentUser, chats, registeredUsers, updateListingStatus]);

  // Join socket room when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      joinChatRoom(activeChatId);
    }
  }, [activeChatId]);

  useEffect(() => {
    try {
      localStorage.setItem("rentify_chats_v4", JSON.stringify(chats));
    } catch (e) {}
  }, [chats]);

  const allKnownUsers = registeredUsers && registeredUsers.length > 0 ? registeredUsers : initialUsers;

  // Filter chats relevant to current user
  const userChats = currentUser
    ? chats
        .filter((c) => c.buyerId === currentUser.id || c.sellerId === currentUser.id)
        .map((c) => {
          const otherUserId = c.buyerId === currentUser.id ? c.sellerId : c.buyerId;
          const otherUser = allKnownUsers.find((u) => u.id === otherUserId) || {
            id: otherUserId,
            name: "Campus Student",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            branch: "Engineering",
            isVerified: true,
            trustScore: 4.8,
          };
          const listing = listings.find((l) => l.id === c.listingId) || {
            id: c.listingId,
            title: "Campus Listing",
            price: 500,
            type: "Sell",
            images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"],
          };
          return {
            ...c,
            otherUser,
            listing,
            lastMessage: c.messages[c.messages.length - 1] || null,
          };
        })
    : [];

  const activeChat = userChats.find((c) => c.id === activeChatId) || userChats[0] || null;

  // Start chat with seller
  const startChat = async (listingId, initialMessage = null) => {
    if (!currentUser) return null;

    // Immediately open chat modal so UI reacts instantly
    setIsChatOpen(true);

    try {
      const res = await chatApi.startOrGetChat(listingId, currentUser.id);
      const chat = res.chat;

      setChats((prev) => {
        const exists = prev.some((c) => c.id === chat.id);
        if (exists) {
          return prev.map((c) => (c.id === chat.id ? { ...c, ...chat } : c));
        }
        return [chat, ...prev];
      });

      setActiveChatId(chat.id);
      setIsChatOpen(true);
      joinChatRoom(chat.id);

      if (initialMessage) {
        await sendMessage(chat.id, initialMessage);
      }

      return chat.id;
    } catch (err) {
      console.warn("Start chat API warning, using local fallback:", err.message);
      const listing = listings.find((l) => l.id === listingId);
      const sellerId = listing?.userId || "user_2";
      let existingChat = chats.find(
        (c) =>
          c.listingId === listingId &&
          (c.buyerId === currentUser.id || c.sellerId === currentUser.id)
      );

      if (existingChat) {
        setActiveChatId(existingChat.id);
        setIsChatOpen(true);
        joinChatRoom(existingChat.id);
        return existingChat.id;
      }

      const newChatId = `chat_${Date.now()}`;
      const targetSeller = sellerId === currentUser.id ? "user_3" : sellerId;
      const newChat = {
        id: newChatId,
        listingId,
        buyerId: currentUser.id,
        sellerId: targetSeller,
        activeOffer: null,
        dealConfirmation: {
          buyerConfirmed: false,
          sellerConfirmed: false,
          completedAt: null,
        },
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            text:
              initialMessage ||
              `Hi! I am interested in your "${listing?.title || "item"}". Is it still available?`,
            timestamp: new Date().toISOString(),
          },
        ],
        updatedAt: new Date().toISOString(),
      };

      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChatId);
      setIsChatOpen(true);
      joinChatRoom(newChatId);
      return newChatId;
    }
  };

  // Send message
  const sendMessage = async (chatId, text) => {
    if (!currentUser || !text.trim()) return;

    const socket = getSocket();
    const cleanText = text.trim();
    const clientMsgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    if (socket && socket.connected) {
      // Send via active WebSocket
      socket.emit("send_message", {
        id: clientMsgId,
        chatId,
        senderId: currentUser.id,
        text: cleanText,
      });
    } else {
      // Fallback only if socket is offline
      chatApi
        .sendMessage(chatId, {
          id: clientMsgId,
          senderId: currentUser.id,
          text: cleanText,
        })
        .catch((err) => console.warn("Fallback send message API error:", err.message));
    }
  };

  // Make Offer / Price Negotiation
  const makeOffer = async (chatId, amount, note = "", isFinalPrice = false) => {
    if (!currentUser || !amount) return;

    const socket = getSocket();
    const numAmount = Number(amount);

    // Emit via Socket.io
    if (socket && socket.connected) {
      socket.emit("send_offer", {
        chatId,
        offeredBy: currentUser.id,
        amount: numAmount,
        note,
        isFinalPrice,
      });
    }

    // Also call REST API
    chatApi.makeOffer(chatId, {
      offeredBy: currentUser.id,
      amount: numAmount,
      note,
      isFinalPrice,
    }).catch((err) => console.warn("Make offer API error:", err.message));
  };

  // Respond to Offer (accept / decline / counter)
  const respondToOffer = async (chatId, action, counterAmount = null, note = "") => {
    if (!currentUser) return;

    const socket = getSocket();
    const numCounter = counterAmount ? Number(counterAmount) : null;

    // Emit via Socket.io
    if (socket && socket.connected) {
      socket.emit("respond_offer", {
        chatId,
        responderId: currentUser.id,
        action,
        counterAmount: numCounter,
        note,
      });
    }

    // Also call REST API
    chatApi.respondOffer(chatId, {
      responderId: currentUser.id,
      action,
      counterAmount: numCounter,
      note,
    }).catch((err) => console.warn("Respond offer API error:", err.message));
  };

  // Confirm Deal Completion with optional agreed final price
  const confirmDeal = async (chatId, agreedPrice = null) => {
    if (!currentUser) return;

    const socket = getSocket();
    const numPrice = agreedPrice ? Number(agreedPrice) : null;

    // Emit via Socket.io
    if (socket && socket.connected) {
      socket.emit("confirm_deal", {
        chatId,
        userId: currentUser.id,
        agreedPrice: numPrice,
      });
    }

    // Call REST API
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      dealApi.confirmDeal(chat.listingId, { userId: currentUser.id, agreedPrice: numPrice }).catch((err) =>
        console.warn("Deal confirm API error:", err.message)
      );
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats: userChats,
        activeChat,
        activeChatId,
        setActiveChatId,
        isChatOpen,
        setIsChatOpen,
        startChat,
        sendMessage,
        makeOffer,
        respondToOffer,
        confirmDeal,
        dealRatingPrompt,
        setDealRatingPrompt,
        isTyping,
        remoteTypingUser,
        refreshChats: fetchLiveChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
