import express from "express";
import {
  getProducts,
  createProduct,
  getOrders,
  createOrder,
  createPaymentOrder,
  verifyPickup,
} from "../controllers/storeController.js";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", createProduct);
router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.post("/create-payment-order", createPaymentOrder);
router.patch("/orders/:id/pickup", verifyPickup);

export default router;
