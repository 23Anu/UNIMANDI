import express from "express";
import {
  getChatsForUser,
  startOrGetChat,
  getMessages,
  sendMessage,
  makeOffer,
  respondOffer,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", getChatsForUser);
router.post("/", startOrGetChat);
router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);
router.post("/:id/offer", makeOffer);
router.post("/:id/offer/respond", respondOffer);

export default router;
