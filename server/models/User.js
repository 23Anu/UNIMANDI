import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  college: { type: String, default: "National Institute of Technology" },
  branch: { type: String },
  year: { type: String },
  semester: { type: String },
  rollNo: { type: String },
  addressType: { type: String },
  roomNo: { type: String },
  buildingName: { type: String },
  streetArea: { type: String },
  landmark: { type: String },
  city: { type: String, default: "Pune" },
  state: { type: String, default: "Maharashtra" },
  pincode: { type: String, default: "411038" },
  pickupLocation: { type: String },
  fullAddress: { type: String },
  hostel: { type: String },
  role: { type: String, default: "student" },
  isVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isAddressVerified: { type: Boolean, default: false },
  isProfileComplete: { type: Boolean, default: false },
  avatar: { type: String },
  trustScore: { type: Number, default: 5.0 },
  dealsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
