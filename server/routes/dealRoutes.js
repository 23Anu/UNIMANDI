import express from "express";
import { confirmDeal } from "../controllers/dealController.js";

const router = express.Router();

router.post("/:listingId/confirm", confirmDeal);

export default router;
