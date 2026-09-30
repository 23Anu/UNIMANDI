import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  googleAuth,
  sendPhoneOtp,
  verifyPhoneOtp,
  verifyCollegeEmail,
  completeProfile,
  getAllUsers,
} from "../controllers/authController.js";

const router = express.Router();

// ── New Credential-Based Auth ─────────────────────────────────────────────────
router.post("/register", register);           // POST /api/auth/register
router.post("/login", login);                 // POST /api/auth/login
router.post("/forgot-password", forgotPassword); // POST /api/auth/forgot-password
router.post("/reset-password", resetPassword);   // POST /api/auth/reset-password
router.get("/me", getMe);                     // GET  /api/auth/me  (JWT check)

// ── Legacy / Social Auth ──────────────────────────────────────────────────────
router.post("/google", googleAuth);
router.post("/phone/send-otp", sendPhoneOtp);
router.post("/phone/verify-otp", verifyPhoneOtp);
router.post("/complete-profile", completeProfile);
router.post("/email/verify", verifyCollegeEmail);
router.get("/users", getAllUsers);

export default router;
