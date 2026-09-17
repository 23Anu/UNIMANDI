import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  pickupCode: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentRoll: { type: String },
  studentBranch: { type: String },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Ready for Pickup" }, // Ready for Pickup | Picked Up / Completed | Cancelled
  placedAt: { type: Date, default: Date.now },
  pickupSlot: { type: String, default: "Today, Counter Pickup" },
  pickupLocation: { type: String, default: "SAC Ground Floor Counter #2" },
  qrDataPayload: { type: String, required: true },
  paymentMethod: { type: String, default: "UPI Instant Token" },
  paymentStatus: { type: String, default: "Completed" }
});

export const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);
