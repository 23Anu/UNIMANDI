import express from "express";
import { reportListingOrUser, blockUser } from "../controllers/safetyController.js";

const router = express.Router();

router.post("/reports", reportListingOrUser);
router.post("/users/:id/block", blockUser);

export default router;
