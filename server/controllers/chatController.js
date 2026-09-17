import { chats, listings, users, saveDB } from "../data/store.js";
import { getIO } from "../socket.js";

export const getChatsForUser = (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "userId query parameter is required" });
  }

  const userChats = chats.filter((c) => c.buyerId === userId || c.sellerId === userId);

  const enriched = userChats.map((c) => {
    const listing = listings.find((l) => l.id === c.listingId);
    const otherUserId = c.buyerId === userId ? c.sellerId : c.buyerId;
    const otherUser = users.find((u) => u.id === otherUserId);

    return {
      ...c,
      listing: listing || null,
      otherUser: otherUser ? {
        id: otherUser.id,
        name: otherUser.name,
        branch: otherUser.branch,
        isVerified: otherUser.isVerified,
        avatar: otherUser.avatar,
        trustScore: otherUser.trustScore
      } : null,
      lastMessage: c.messages[c.messages.length - 1] || null
    };
  });

  // Sort by recent activity
  enriched.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  res.json({ chats: enriched });
};

export const startOrGetChat = (req, res) => {
  const { listingId, buyerId } = req.body;
  const listing = listings.find((l) => l.id === listingId);

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  // If user is owner testing their own listing, pair with another student or find existing chat
  let targetBuyerId = buyerId;
  let targetSellerId = listing.userId;

  if (listing.userId === buyerId) {
    // Find if someone else chatted about this item
    const existing = chats.find((c) => c.listingId === listingId && c.sellerId === buyerId);
    if (existing) {
      const otherUser = users.find((u) => u.id === existing.buyerId);
      return res.json({
        success: true,
        chat: {
          ...existing,
          listing,
          otherUser,
        },
      });
    }
    // Otherwise create demo inquiry from another student
    targetBuyerId = buyerId === "user_1" ? "user_3" : "user_1";
    targetSellerId = buyerId;
  }

  let chat = chats.find(
    (c) =>
      c.listingId === listingId &&
      ((c.buyerId === targetBuyerId && c.sellerId === targetSellerId) ||
        (c.buyerId === targetSellerId && c.sellerId === targetBuyerId))
  );

  if (!chat) {
    chat = {
      id: `chat_${Date.now()}`,
      listingId,
      buyerId: targetBuyerId,
      sellerId: targetSellerId,
      activeOffer: null,
      dealConfirmation: {
        buyerConfirmed: false,
        sellerConfirmed: false,
        completedAt: null,
      },
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: targetBuyerId,
          type: "text",
          text: `Hi! I am interested in your "${listing.title}". Is it still available?`,
          timestamp: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    chats.unshift(chat);
    saveDB();
  }

  const otherUserId = chat.buyerId === buyerId ? chat.sellerId : chat.buyerId;
  const otherUser = users.find((u) => u.id === otherUserId) || {
    id: otherUserId,
    name: "Campus Student",
    branch: "Engineering",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    trustScore: 4.8,
  };

  res.json({
    success: true,
    chat: {
      ...chat,
      listing,
      otherUser,
    },
  });
};

export const getMessages = (req, res) => {
  const { id } = req.params;
  const chat = chats.find((c) => c.id === id);

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  const listing = listings.find((l) => l.id === chat.listingId);
  const buyer = users.find((u) => u.id === chat.buyerId);
  const seller = users.find((u) => u.id === chat.sellerId);

  res.json({
    chat,
    listing,
    buyer,
    seller,
    messages: chat.messages
  });
};

export const sendMessage = (req, res) => {
  const { id } = req.params;
  const { senderId, text, type = "text", offerAmount = null } = req.body;

  const chat = chats.find((c) => c.id === id);
  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  const cleanText = text.trim();
  const existingRecent = chat.messages.find(
    (m) =>
      m.senderId === senderId &&
      m.text === cleanText &&
      Math.abs(new Date(m.timestamp).getTime() - Date.now()) < 3000
  );

  if (existingRecent) {
    return res.json({ success: true, message: existingRecent, chat });
  }

  const newMessage = {
    id: req.body.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    senderId,
    type,
    offerAmount,
    text: cleanText,
    timestamp: new Date().toISOString()
  };

  chat.messages.push(newMessage);
  chat.updatedAt = new Date().toISOString();
  saveDB();

  // Socket notification
  const io = getIO();
  if (io) {
    io.to(`chat_${id}`).emit("new_message", { chatId: id, message: newMessage, chat });
    const recipientId = chat.buyerId === senderId ? chat.sellerId : chat.buyerId;
    io.to(`user_${recipientId}`).emit("chat_notification", {
      chatId: id,
      text: newMessage.text,
      timestamp: newMessage.timestamp
    });
  }

  res.status(201).json({ success: true, message: newMessage, chat });
};

export const makeOffer = (req, res) => {
  const { id } = req.params;
  const { offeredBy, amount, note, isFinalPrice = false } = req.body;

  const chat = chats.find((c) => c.id === id);
  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  const numAmount = Number(amount);
  chat.activeOffer = {
    amount: numAmount,
    offeredBy,
    status: "pending",
    counterAmount: null,
    isFinalPrice: !!isFinalPrice,
    note: note || ""
  };

  const offerMessage = {
    id: `msg_offer_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    senderId: offeredBy,
    type: "offer",
    offerAmount: numAmount,
    isFinalPrice: !!isFinalPrice,
    note: note || "",
    text: note 
      ? `🤝 ${isFinalPrice ? "Set Final Deal Price" : "Proposed Offer"}: ₹${numAmount.toLocaleString("en-IN")} ("${note}")`
      : `🤝 ${isFinalPrice ? "Set Final Deal Price" : "Proposed Offer"}: ₹${numAmount.toLocaleString("en-IN")}`,
    timestamp: new Date().toISOString()
  };

  chat.messages.push(offerMessage);
  chat.updatedAt = new Date().toISOString();
  saveDB();

  const io = getIO();
  if (io) {
    io.to(`chat_${id}`).emit("offer_updated", { chatId: id, activeOffer: chat.activeOffer, message: offerMessage, chat });
    const recipientId = chat.buyerId === offeredBy ? chat.sellerId : chat.buyerId;
    io.to(`user_${recipientId}`).emit("offer_notification", {
      chatId: id,
      type: "new_offer",
      amount: numAmount,
      isFinalPrice: !!isFinalPrice,
      note: note || "",
      timestamp: new Date().toISOString()
    });
  }

  res.json({ success: true, activeOffer: chat.activeOffer, message: offerMessage });
};

export const respondOffer = (req, res) => {
  const { id } = req.params;
  const { responderId, action, counterAmount, note } = req.body;

  const chat = chats.find((c) => c.id === id);
  if (!chat || !chat.activeOffer) {
    return res.status(404).json({ error: "Chat or active offer not found" });
  }

  const responder = users.find((u) => u.id === responderId);
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
    timestamp: new Date().toISOString()
  };

  chat.messages.push(responseMsg);
  chat.updatedAt = new Date().toISOString();
  saveDB();

  const io = getIO();
  if (io) {
    io.to(`chat_${id}`).emit("offer_updated", { chatId: id, activeOffer: chat.activeOffer, message: responseMsg, chat, finalAmount: chat.finalAmount });
  }

  res.json({ success: true, activeOffer: chat.activeOffer, message: responseMsg, finalAmount: chat.finalAmount });
};
