import express from "express";
import {
  googleVerify,
  getMe,
  completeProfile,
  getAllUsers,
} from "../controllers/authController.js";

const router = express.Router();

// ── Google OAuth (Primary Auth) ───────────────────────────────────────────────
router.post("/google-verify", googleVerify); // POST /api/auth/google-verify

// ── Session & Profile ─────────────────────────────────────────────────────────
router.get("/me", getMe);                    // GET  /api/auth/me
router.post("/complete-profile", completeProfile); // POST /api/auth/complete-profile
router.get("/users", getAllUsers);           // GET  /api/auth/users

export default router;
