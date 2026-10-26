import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { users, saveDB } from "../data/store.js";

const JWT_SECRET = process.env.JWT_SECRET || "unimandi_super_secret_jwt_key_2026";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const STORE_PASS = process.env.STORE_PASS || "SACSTORE2026";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ─── Token Helper ─────────────────────────────────────────────────────────────
const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role || "student" }, JWT_SECRET, {
    expiresIn: "30d",
  });

// ─── GOOGLE VERIFY (Primary Auth) ────────────────────────────────────────────
export const googleVerify = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Google credential token is required." });
    }

    // Verify the Google ID token
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.error("Google token verification failed:", verifyErr.message);
      return res.status(401).json({ error: "Invalid Google token. Please try signing in again." });
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    if (!email) {
      return res.status(400).json({ error: "Google account must have an email address." });
    }

    // Upsert user — find by email
    let user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      // New user — create account
      user = {
        id: `user_${Date.now()}`,
        googleId,
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        phone: "",
        college: "",
        branch: "",
        year: "",
        semester: "",
        rollNo: "",
        addressType: "Campus Hostel / Dorm",
        roomNo: "",
        buildingName: "",
        streetArea: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        pickupLocation: "",
        fullAddress: "",
        hostel: "",
        role: "student",
        isVerified: false,
        isEmailVerified: true, // verified via Google
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
      console.log(`✅ New Google user registered: ${user.name} (${user.email})`);
    } else {
      // Existing user — refresh Google info
      user.googleId = googleId;
      if (avatar && !user.avatar?.includes("ui-avatars")) {
        user.avatar = avatar;
      }
      saveDB();
      console.log(`🔐 Google user signed in: ${user.name} (${user.email})`);
    }

    const token = generateToken(user);
    const { password: _pw, resetToken: _rt, resetTokenExpiry: _rte, ...safeUser } = user;

    res.json({ success: true, user: safeUser, token });
  } catch (err) {
    console.error("Google verify error:", err);
    res.status(500).json({ error: "Authentication failed. Please try again." });
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

// ─── COMPLETE PROFILE (Post-Google Onboarding) ───────────────────────────────
export const completeProfile = (req, res) => {
  const { userId, ...profileData } = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: "User not found" });
  users[userIndex] = { ...users[userIndex], ...profileData, isProfileComplete: true, updatedAt: new Date().toISOString() };
  saveDB();
  const { password: _pw, ...safeUser } = users[userIndex];
  res.json({ success: true, user: safeUser, message: "Profile completed!" });
};

// ─── GET ALL USERS (Admin/Internal) ──────────────────────────────────────────
export const getAllUsers = (req, res) => {
  const safeUsers = users.map(({ password, resetToken, resetTokenExpiry, ...u }) => u);
  res.json({ users: safeUsers });
};

// ─── STORE OPERATOR LOGIN (Passcode-based) ────────────────────────────────────
export const storeLogin = (req, res) => {
  try {
    const { passcode } = req.body;
    if (!passcode || passcode.trim() !== STORE_PASS) {
      return res.status(401).json({ error: "Invalid store passcode. Access denied." });
    }

    // Find or create the merchant user
    let merchant = users.find((u) => u.role === "merchant" || u.id === "user_kampus_store");
    if (!merchant) {
      merchant = {
        id: "user_kampus_store",
        name: "SAC Store Operator",
        email: "store@unimandi.campus",
        phone: "",
        role: "merchant",
        avatar: "https://ui-avatars.com/api/?name=SAC+Store&background=FF5A1F&color=fff&bold=true",
        college: "UniMandi Campus",
        branch: "SAC Administration",
        year: "Staff",
        isVerified: true,
        isProfileComplete: true,
        trustScore: 5.0,
        dealsCount: 0,
        createdAt: new Date().toISOString(),
      };
      users.unshift(merchant);
      saveDB();
    }

    const token = generateToken(merchant);
    const { password: _pw, ...safeUser } = merchant;
    console.log(`🏪 Store operator signed in: ${merchant.name}`);
    res.json({ success: true, user: safeUser, token });
  } catch (err) {
    console.error("Store login error:", err);
    res.status(500).json({ error: "Store login failed." });
  }
};
