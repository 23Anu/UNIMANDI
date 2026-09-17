import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, required: true, enum: ["Rent", "Sell"] },
  category: { type: String, required: true },
  subcategory: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  condition: { type: String, default: "Good" },
  price: { type: Number, required: true },
  rentDuration: { type: String },
  location: { type: String },
  status: { type: String, default: "Available", enum: ["Available", "Reserved", "Sold", "Rented Out"] },
  genderTarget: { type: String, default: "Any" },
  images: [{ type: String }],
  targetBranch: { type: String, default: "All Branches" },
  targetYear: { type: String, default: "All Years" },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ListingModel = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
