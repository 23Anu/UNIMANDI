import { Server } from "socket.io";
import { chats, listings, users, saveDB } from "./data/store.js";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    // User connects & registers their personal notification room
    socket.on("register_user", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        socket.userId = userId;
      }
    });

    // Join specific chat room
    socket.on("join_chat", (chatId) => {
      if (chatId) {
        socket.join(`chat_${chatId}`);
      }
    });

    // Leave chat room
    socket.on("leave_chat", (chatId) => {
      if (chatId) {
        socket.leave(`chat_${chatId}`);
      }
    });

    // Real-time Message Send with strictly deduplicated storage & broadcast
    socket.on("send_message", ({ id, chatId, senderId, text, type = "text", offerAmount = null }) => {
      try {
        if (!chatId || !senderId || !text || !text.trim()) return;

        const chat = chats.find((c) => c.id === chatId);
        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        const cleanText = text.trim();
        const msgId = id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

        // Check if duplicate message already recorded in last 3 seconds
        const isDuplicate = chat.messages.some(
          (m) =>
            m.id === msgId ||
            (m.senderId === senderId &&
              m.text === cleanText &&
              Math.abs(new Date(m.timestamp).getTime() - Date.now()) < 3000)
        );

        if (isDuplicate) {
          return;
        }

        const newMessage = {
          id: msgId,
          senderId,
          text: cleanText,
          type,
          offerAmount,
          timestamp: new Date().toISOString(),
        };

        chat.messages.push(newMessage);
        chat.updatedAt = new Date().toISOString();
        saveDB();

        // Broadcast to all participants in this chat room
        io.to(`chat_${chatId}`).emit("new_message", {
          chatId,
          message: newMessage,
          chat,
        });

        // Notify recipient if they are in their personal user room
        const recipientId = chat.buyerId === senderId ? chat.sellerId : chat.buyerId;
        const sender = users.find((u) => u.id === senderId);
        const listing = listings.find((l) => l.id === chat.listingId);

        io.to(`user_${recipientId}`).emit("chat_notification", {
          chatId,
          senderName: sender?.name || "Campus Peer",
          senderAvatar: sender?.avatar,
          listingTitle: listing?.title || "Item Discussion",
          text: newMessage.text,
          timestamp: newMessage.timestamp,
        });
      } catch (err) {
        console.error("Socket send_message error:", err);
      }
    });

    // Real-time "Make an Offer" & Price Negotiation
    socket.on("send_offer", ({ chatId, offeredBy, amount, note, isFinalPrice = false }) => {
      try {
        const chat = chats.find((c) => c.id === chatId);
        if (!chat) return;

        const numAmount = Number(amount);
        const listing = listings.find((l) => l.id === chat.listingId);
        const sender = users.find((u) => u.id === offeredBy);
        const recipientId = chat.buyerId === offeredBy ? chat.sellerId : chat.buyerId;

        chat.activeOffer = {
          amount: numAmount,
          offeredBy,
          status: "pending",
          counterAmount: null,
          isFinalPrice: !!isFinalPrice,
          note: note || "",
        };

        const offerMsgText = note
          ? `🤝 ${isFinalPrice ? "Set Final Deal Price" : "Proposed Offer"}: ₹${numAmount.toLocaleString("en-IN")} ("${note}")`
          : `🤝 ${isFinalPrice ? "Set Final Deal Price" : "Proposed Offer"}: ₹${numAmount.toLocaleString("en-IN")}`;

        const offerMessage = {
          id: `msg_offer_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          senderId: offeredBy,
          type: "offer",
          offerAmount: numAmount,
          isFinalPrice: !!isFinalPrice,
          note: note || "",
          text: offerMsgText,
          timestamp: new Date().toISOString(),
        };

        chat.messages.push(offerMessage);
        chat.updatedAt = new Date().toISOString();
        saveDB();

        io.to(`chat_${chatId}`).emit("offer_updated", {
          chatId,
          activeOffer: chat.activeOffer,
          message: offerMessage,
          chat,
        });

        io.to(`user_${recipientId}`).emit("offer_notification", {
          chatId,
          type: "new_offer",
          senderName: sender?.name || "Campus Peer",
          amount: numAmount,
          isFinalPrice: !!isFinalPrice,
          listingTitle: listing?.title || "Item",
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Socket send_offer error:", err);
      }
    });

    // Real-time Offer Response (Accept / Decline / Counter)
    socket.on("respond_offer", ({ chatId, responderId, action, counterAmount = null, note = "" }) => {
      try {
        const chat = chats.find((c) => c.id === chatId);
        if (!chat || !chat.activeOffer) return;

        const responder = users.find((u) => u.id === responderId);
        const recipientId = chat.buyerId === responderId ? chat.sellerId : chat.buyerId;
        const listing = listings.find((l) => l.id === chat.listingId);

        let systemMsgText = "";

        if (action === "accept") {
          chat.activeOffer.status = "accepted";
          chat.finalAmount = chat.activeOffer.amount;
          systemMsgText = `🎉 Final Price Agreed: ₹${chat.activeOffer.amount.toLocaleString("en-IN")} accepted by ${responder?.name || "Peer"}! Both parties can now Lock Deal.`;
        } else if (action === "decline") {
          chat.activeOffer.status = "declined";
          systemMsgText = `❌ Offer of ₹${chat.activeOffer.amount.toLocaleString("en-IN")} was declined.`;
        } else if (action === "counter") {
          const numCounter = Number(counterAmount);
          chat.activeOffer.status = "pending";
          chat.activeOffer.amount = numCounter;
          chat.activeOffer.counterAmount = numCounter;
          chat.activeOffer.offeredBy = responderId;
          chat.activeOffer.note = note || "";
          systemMsgText = `🔄 Counter-offer proposed: ₹${numCounter.toLocaleString("en-IN")} by ${responder?.name || "Peer"}${note ? ` ("${note}")` : ""}.`;
        }

        const responseMsg = {
          id: `msg_sys_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          senderId: "system",
          type: "system",
          text: systemMsgText,
          timestamp: new Date().toISOString(),
        };

        chat.messages.push(responseMsg);
        chat.updatedAt = new Date().toISOString();
        saveDB();

        io.to(`chat_${chatId}`).emit("offer_updated", {
          chatId,
          activeOffer: chat.activeOffer,
          message: responseMsg,
          chat,
          finalAmount: chat.finalAmount,
        });

        io.to(`user_${recipientId}`).emit("offer_notification", {
          chatId,
          type: `offer_${action}`,
          senderName: responder?.name || "Campus Peer",
          amount: action === "counter" ? Number(counterAmount) : chat.activeOffer.amount,
          listingTitle: listing?.title || "Item",
          actionText: systemMsgText,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Socket respond_offer error:", err);
      }
    });

    // Real-time Two-Sided Deal Confirmation
    socket.on("confirm_deal", ({ chatId, userId, agreedPrice = null }) => {
      try {
        const chat = chats.find((c) => c.id === chatId);
        if (!chat) return;

        const listing = listings.find((l) => l.id === chat.listingId);
        if (!listing) return;

        if (agreedPrice) {
          chat.finalAmount = Number(agreedPrice);
        } else if (!chat.finalAmount && chat.activeOffer?.amount) {
          chat.finalAmount = chat.activeOffer.amount;
        } else if (!chat.finalAmount) {
          chat.finalAmount = listing.price;
        }

        if (!chat.dealConfirmation) {
          chat.dealConfirmation = {
            buyerConfirmed: false,
            sellerConfirmed: false,
            completedAt: null,
          };
        }

        if (chat.buyerId === userId) {
          chat.dealConfirmation.buyerConfirmed = true;
        } else if (chat.sellerId === userId) {
          chat.dealConfirmation.sellerConfirmed = true;
        }

        const isBothConfirmed = chat.dealConfirmation.buyerConfirmed && chat.dealConfirmation.sellerConfirmed;

        if (isBothConfirmed) {
          chat.dealConfirmation.completedAt = new Date().toISOString();
          listing.status = listing.type === "Rent" ? "Rented Out" : "Sold";

          const buyer = users.find((u) => u.id === chat.buyerId);
          const seller = users.find((u) => u.id === chat.sellerId);
          if (buyer) buyer.dealsCount = (buyer.dealsCount || 0) + 1;
          if (seller) seller.dealsCount = (seller.dealsCount || 0) + 1;

          const dealPriceFormatted = chat.finalAmount ? `₹${chat.finalAmount.toLocaleString("en-IN")}` : `₹${listing.price.toLocaleString("en-IN")}`;
          const sysMsg = {
            id: `msg_sys_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            senderId: "system",
            type: "system",
            text: `🎉 Deal Sealed at ${dealPriceFormatted}! Both parties verified the handoff. You can now view your digital deal receipt and leave campus ratings.`,
            timestamp: new Date().toISOString(),
          };
          chat.messages.push(sysMsg);
        } else {
          const confirmerName = users.find((u) => u.id === userId)?.name || "One party";
          const dealPriceFormatted = chat.finalAmount ? ` at ₹${chat.finalAmount.toLocaleString("en-IN")}` : "";
          const sysMsg = {
            id: `msg_sys_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            senderId: "system",
            type: "system",
            text: `⏳ ${confirmerName} confirmed & locked the deal${dealPriceFormatted}. Awaiting confirmation from the other party to seal the deal!`,
            timestamp: new Date().toISOString(),
          };
          chat.messages.push(sysMsg);
        }

        chat.updatedAt = new Date().toISOString();
        saveDB();

        io.to(`chat_${chatId}`).emit("deal_status_updated", {
          chatId,
          dealConfirmation: chat.dealConfirmation,
          isBothConfirmed,
          listingStatus: listing.status,
          listing,
          finalAmount: chat.finalAmount,
        });

        if (isBothConfirmed) {
          io.emit("listing_updated", listing);
        }
      } catch (err) {
        console.error("Socket confirm_deal error:", err);
      }
    });

    // Real-time Typing Indicators
    socket.on("typing", ({ chatId, userId, userName }) => {
      socket.to(`chat_${chatId}`).emit("user_typing", { chatId, userId, userName });
    });

    socket.on("stop_typing", ({ chatId, userId }) => {
      socket.to(`chat_${chatId}`).emit("user_stop_typing", { chatId, userId });
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIO = () => io;

export const broadcastNewListing = (listing) => {
  if (io) {
    io.emit("new_listing_posted", listing);
  }
};
