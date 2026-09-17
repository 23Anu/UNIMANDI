import express from "express";
import { submitRating, getUserRatingSummary } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/", submitRating);
router.get("/:userId", getUserRatingSummary);

export default router;
