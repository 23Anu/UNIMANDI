import express from "express";
import {
  googleAuth,
  sendPhoneOtp,
  verifyPhoneOtp,
  verifyCollegeEmail,
  completeProfile,
  getAllUsers,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/google", googleAuth);
router.post("/phone/send-otp", sendPhoneOtp);
router.post("/phone/verify-otp", verifyPhoneOtp);
router.post("/complete-profile", completeProfile);
router.post("/email/verify", verifyCollegeEmail);
router.get("/users", getAllUsers);

export default router;
