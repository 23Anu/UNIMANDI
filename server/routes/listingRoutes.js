import express from "express";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  updateListingStatus,
  deleteListing,
} from "../controllers/listingController.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/", createListing);
router.put("/:id", updateListing);
router.patch("/:id/status", updateListingStatus);
router.delete("/:id", deleteListing);

export default router;
