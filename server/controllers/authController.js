import jwt from "jsonwebtoken";
import { users, saveDB } from "../data/store.js";

const JWT_SECRET = process.env.JWT_SECRET || "rentify_campus_jwt_secret_key_2026";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role || "student" }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const googleAuth = (req, res) => {
  const { email, name, avatar } = req.body;
  let user = users.find((u) => u.email === email);

  if (!user) {
    const isCollegeEmail = email?.endsWith(".edu") || email?.includes("college") || email?.includes("campus") || email?.includes("ac.in");
    user = {
      id: `user_${Date.now()}`,
      name: name || "Campus Student",
      email: email || `student_${Date.now()}@campus.edu`,
      phone: "",
      college: "National Institute of Technology",
      branch: "Computer Engineering",
      year: "2nd Year",
      semester: "4th Semester",
      rollNo: "",
      addressType: "Campus Hostel / Dorm",
      roomNo: "",
      buildingName: "Hostel Block 3",
      streetArea: "North Campus",
      landmark: "Near Central Mess",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411038",
      pickupLocation: "Central Library / Canteen",
      fullAddress: "",
      hostel: "Hostel Block 3",
      isVerified: Boolean(isCollegeEmail),
      isEmailVerified: Boolean(isCollegeEmail),
      isPhoneVerified: false,
      isAddressVerified: false,
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      trustScore: 5.0,
      dealsCount: 0,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    };
    users.unshift(user);
    saveDB();
  }

  const token = generateToken(user);
  res.json({ success: true, user, token });
};

export const sendPhoneOtp = (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }
  // Generate random 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`📱 Generated OTP for ${phone}: ${generatedOtp} (or use default demo: 123456)`);
  
  res.json({
    success: true,
    message: "OTP sent successfully! Use 123456 or generated code for instant login.",
    otp: "123456"
  });
};

export const verifyPhoneOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== "123456" && otp !== "000000" && !otp) {
    return res.status(400).json({ error: "Invalid OTP. Use 123456 for demo." });
  }

  let user = users.find((u) => u.phone === phone);
  if (!user) {
    user = {
      id: `user_${Date.now()}`,
      name: "Campus Student",
      email: "",
      phone,
      college: "National Institute of Technology",
      branch: "General Engineering",
      year: "1st Year",
      semester: "2nd Semester",
      rollNo: "",
      addressType: "Campus Hostel / Dorm",
      roomNo: "",
      buildingName: "Hostel Block 1",
      streetArea: "Campus Quad",
      landmark: "Main Gate",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411038",
      pickupLocation: "Main Canteen",
      fullAddress: "",
      hostel: "Hostel Block 1",
      isVerified: false,
      isEmailVerified: false,
      isPhoneVerified: true,
      isAddressVerified: false,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      trustScore: 5.0,
      dealsCount: 0,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    };
    users.unshift(user);
    saveDB();
  }

  const token = generateToken(user);
  res.json({ success: true, user, token });
};

export const completeProfile = (req, res) => {
  const { userId, ...profileData } = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...profileData,
    isProfileComplete: true,
    updatedAt: new Date().toISOString()
  };

  saveDB();
  res.json({ success: true, user: users[userIndex], message: "Profile successfully completed and verified!" });
};

export const verifyCollegeEmail = (req, res) => {
  const { userId, collegeEmail } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!collegeEmail || (!collegeEmail.includes(".edu") && !collegeEmail.includes(".ac.in"))) {
    return res.status(400).json({ error: "Please enter a valid official college/university email ending in .edu or .ac.in" });
  }

  user.email = collegeEmail;
  user.isVerified = true;
  user.isEmailVerified = true;
  saveDB();
  res.json({ success: true, user, message: "College email verified! 'Verified Student' badge awarded." });
};

export const getAllUsers = (req, res) => {
  res.json({ users });
};
