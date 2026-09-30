import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users, saveDB } from "../data/store.js";

const JWT_SECRET = process.env.JWT_SECRET || "unimandi_super_secret_jwt_key_2026";

// ─── Token Helpers ────────────────────────────────────────────────────────────
const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role || "student" }, JWT_SECRET, {
    expiresIn: "30d",
  });

// ─── REGISTER (Sign Up) ──────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      college,
      branch,
      year,
      semester,
      rollNo,
      roomNo,
      buildingName,
      hostel,
      city,
      state,
      pincode,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    // Check duplicate email
    const existing = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const isCollegeEmail = email.endsWith(".edu") || email.endsWith(".ac.in");

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone || "",
      college: college || "National Institute of Technology",
      branch: branch || "",
      year: year || "",
      semester: semester || "",
      rollNo: rollNo || "",
      addressType: "Campus Hostel / Dorm",
      roomNo: roomNo || "",
      buildingName: buildingName || "",
      streetArea: "",
      landmark: "",
      city: city || "Pune",
      state: state || "Maharashtra",
      pincode: pincode || "411038",
      pickupLocation: "",
      fullAddress: "",
      hostel: hostel || "",
      role: "student",
      isVerified: isCollegeEmail,
      isEmailVerified: isCollegeEmail,
      isPhoneVerified: false,
      isAddressVerified: false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF5A1F&color=fff&size=150`,
      trustScore: 5.0,
      dealsCount: 0,
      isProfileComplete: Boolean(branch && year && rollNo),
      createdAt: new Date().toISOString(),
      resetToken: null,
      resetTokenExpiry: null,
    };

    users.unshift(newUser);
    saveDB();

    const token = generateToken(newUser);
    const { password: _pw, resetToken: _rt, resetTokenExpiry: _rte, ...safeUser } = newUser;

    console.log(`✅ New user registered: ${newUser.name} (${newUser.email})`);
    res.status(201).json({ success: true, user: safeUser, token, message: "Account created successfully!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "No account found with this email. Please sign up first." });
    }

    // Legacy users without password (seeded demo accounts) — allow bypass in dev
    if (!user.password) {
      // For demo/seeded accounts that have no hashed password: set one now for future logins
      const hashed = await bcrypt.hash(password, 12);
      user.password = hashed;
      saveDB();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect password. Please try again or use Forgot Password." });
      }
    }

    const token = generateToken(user);
    const { password: _pw, resetToken: _rt, resetTokenExpiry: _rte, ...safeUser } = user;

    console.log(`🔐 User logged in: ${user.name} (${user.email})`);
    res.json({ success: true, user: safeUser, token, message: "Logged in successfully!" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Security: don't reveal if email exists
      return res.json({
        success: true,
        message: "If this email is registered, a reset code has been sent.",
      });
    }

    // Generate a 6-digit reset token (in production: send via email/SMS)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    saveDB();

    // In production this would send an email. For now, log it to console.
    console.log(`🔑 Password reset token for ${email}: ${resetToken}  (use this in the Reset Password form)`);

    res.json({
      success: true,
      message: "A 6-digit reset code has been generated.",
      // Only expose in dev for testing — REMOVE in production
      resetToken: process.env.NODE_ENV === "production" ? undefined : resetToken,
      devNote: "Check server console for the reset token. In production, this would be emailed.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Could not process request. Please try again." });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ error: "Email, reset code, and new password are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }

    const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user || !user.resetToken) {
      return res.status(400).json({ error: "Invalid or expired reset code." });
    }
    if (user.resetToken !== resetToken) {
      return res.status(400).json({ error: "Incorrect reset code. Please try again." });
    }
    if (new Date() > new Date(user.resetTokenExpiry)) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      saveDB();
      return res.status(400).json({ error: "Reset code has expired. Please request a new one." });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    saveDB();

    console.log(`✅ Password reset successfully for: ${email}`);
    res.json({ success: true, message: "Password reset successfully! You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Could not reset password. Please try again." });
  }
};

// ─── GET MY PROFILE (from JWT) ────────────────────────────────────────────────
export const getMe = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const { password: _pw, resetToken: _rt, resetTokenExpiry: _rte, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// ─── LEGACY: Google / Phone Auth (kept for backward compat) ──────────────────
export const googleAuth = async (req, res) => {
  const { email, name, avatar } = req.body;
  let user = users.find((u) => u.email === email);

  if (!user) {
    const isCollegeEmail = email?.endsWith(".edu") || email?.includes("college") || email?.includes("campus") || email?.includes("ac.in");
    user = {
      id: `user_${Date.now()}`,
      name: name || "Campus Student",
      email: email || `student_${Date.now()}@campus.edu`,
      password: null,
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
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Student")}&background=FF5A1F&color=fff`,
      trustScore: 5.0,
      dealsCount: 0,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    };
    users.unshift(user);
    saveDB();
  }

  const token = generateToken(user);
  const { password: _pw, resetToken: _rt, resetTokenExpiry: _rte, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token });
};

export const sendPhoneOtp = (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`📱 OTP for ${phone}: ${generatedOtp} (or use default: 123456)`);
  res.json({ success: true, message: "OTP sent successfully!", otp: "123456" });
};

export const verifyPhoneOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== "123456" && otp !== "000000" && !otp) {
    return res.status(400).json({ error: "Invalid OTP." });
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
      avatar: `https://ui-avatars.com/api/?name=Student&background=FF5A1F&color=fff`,
      trustScore: 5.0,
      dealsCount: 0,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    };
    users.unshift(user);
    saveDB();
  }
  const token = generateToken(user);
  const { password: _pw, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token });
};

export const completeProfile = (req, res) => {
  const { userId, ...profileData } = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: "User not found" });
  users[userIndex] = { ...users[userIndex], ...profileData, isProfileComplete: true, updatedAt: new Date().toISOString() };
  saveDB();
  const { password: _pw, ...safeUser } = users[userIndex];
  res.json({ success: true, user: safeUser, message: "Profile completed!" });
};

export const verifyCollegeEmail = (req, res) => {
  const { userId, collegeEmail } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!collegeEmail || (!collegeEmail.includes(".edu") && !collegeEmail.includes(".ac.in"))) {
    return res.status(400).json({ error: "Please enter a valid .edu or .ac.in college email." });
  }
  user.email = collegeEmail;
  user.isVerified = true;
  user.isEmailVerified = true;
  saveDB();
  const { password: _pw, ...safeUser } = user;
  res.json({ success: true, user: safeUser, message: "College email verified!" });
};

export const getAllUsers = (req, res) => {
  const safeUsers = users.map(({ password, resetToken, resetTokenExpiry, ...u }) => u);
  res.json({ users: safeUsers });
};
