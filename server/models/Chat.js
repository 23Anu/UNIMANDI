import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, default: "text" }, // text | offer | system
  offerAmount: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  listingId: { type: String, required: true },
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  activeOffer: {
    amount: Number,
    offeredBy: String,
    status: { type: String, default: "pending" }, // pending | accepted | declined | countered
    counterAmount: Number
  },
  dealConfirmation: {
    buyerConfirmed: { type: Boolean, default: false },
    sellerConfirmed: { type: Boolean, default: false },
    completedAt: Date
  },
  messages: [MessageSchema],
  updatedAt: { type: Date, default: Date.now }
});

export const ChatModel = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
