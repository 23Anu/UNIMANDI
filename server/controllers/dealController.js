import { chats, listings, users, saveDB } from "../data/store.js";
import { getIO } from "../socket.js";

// Two-Sided Deal Confirmation Logic
export const confirmDeal = (req, res) => {
  const { listingId } = req.params;
  const { userId, agreedPrice = null } = req.body;

  const chat = chats.find((c) => c.listingId === listingId && (c.buyerId === userId || c.sellerId === userId));
  if (!chat) {
    return res.status(404).json({ error: "No active deal conversation found for this listing" });
  }

  const listing = listings.find((l) => l.id === listingId);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

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

  // Mark the specific party as confirmed
  if (chat.buyerId === userId) {
    chat.dealConfirmation.buyerConfirmed = true;
  } else if (chat.sellerId === userId) {
    chat.dealConfirmation.sellerConfirmed = true;
  }

  const isBothConfirmed = chat.dealConfirmation.buyerConfirmed && chat.dealConfirmation.sellerConfirmed;

  if (isBothConfirmed) {
    chat.dealConfirmation.completedAt = new Date().toISOString();
    listing.status = listing.type === "Rent" ? "Rented Out" : "Sold";

    // Increment deal counters
    const buyer = users.find((u) => u.id === chat.buyerId);
    const seller = users.find((u) => u.id === chat.sellerId);
    if (buyer) buyer.dealsCount = (buyer.dealsCount || 0) + 1;
    if (seller) seller.dealsCount = (seller.dealsCount || 0) + 1;

    const dealPriceFormatted = chat.finalAmount ? `₹${chat.finalAmount.toLocaleString("en-IN")}` : `₹${listing.price.toLocaleString("en-IN")}`;
    // Add a system announcement in the chat
    chat.messages.push({
      id: `msg_sys_${Date.now()}`,
      senderId: "system",
      type: "system",
      text: `🎉 Deal Sealed at ${dealPriceFormatted}! Both parties confirmed the exchange. You can now view your digital deal receipt and leave ratings & reviews.`,
      timestamp: new Date().toISOString()
    });
  } else {
    // Add pending notification message
    const partyName = chat.buyerId === userId ? "Buyer" : "Seller";
    const dealPriceFormatted = chat.finalAmount ? ` at ₹${chat.finalAmount.toLocaleString("en-IN")}` : "";
    chat.messages.push({
      id: `msg_sys_${Date.now()}`,
      senderId: "system",
      type: "system",
      text: `⏳ ${partyName} confirmed & locked the deal${dealPriceFormatted}. Waiting for the other party to confirm.`,
      timestamp: new Date().toISOString()
    });
  }

  chat.updatedAt = new Date().toISOString();
  saveDB();

  const io = getIO();
  if (io) {
    io.to(`chat_${chat.id}`).emit("deal_status_updated", {
      chatId: chat.id,
      dealConfirmation: chat.dealConfirmation,
      isBothConfirmed,
      listingStatus: listing.status,
      listing,
      finalAmount: chat.finalAmount
    });
    if (isBothConfirmed) {
      io.emit("listing_updated", listing);
    }
  }

  res.json({
    success: true,
    isBothConfirmed,
    dealConfirmation: chat.dealConfirmation,
    listingStatus: listing.status,
    finalAmount: chat.finalAmount,
    message: isBothConfirmed
      ? "Deal fully completed by both sides! Rating unlocked."
      : "Your confirmation received! Waiting for the other party to confirm."
  });
};
