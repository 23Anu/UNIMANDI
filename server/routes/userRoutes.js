import express from "express";
import { getUserProfile, updateUserProfile, getUserRatings } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);
router.get("/:id/ratings", getUserRatings);

export default router;
