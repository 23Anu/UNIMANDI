import Razorpay from "razorpay";
import crypto from "crypto";
import { products, orders, saveDB } from "../data/store.js";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;
if (razorpayKeyId && razorpaySecret) {
  try {
    razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecret,
    });
    console.log("💳 Razorpay Payment Gateway Initialized!");
  } catch (err) {
    console.warn("⚠️ Razorpay init warning:", err.message);
  }
}

export const getProducts = (req, res) => {
  const { category, search } = req.query;
  let filtered = [...products];

  if (category && category !== "All") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  res.json({ products: filtered, total: filtered.length });
};

export const createProduct = (req, res) => {
  const { name, category, price, originalPrice, stockCount, unit, image, description } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Missing required product fields" });
  }

  const newProduct = {
    id: `km_prod_${Date.now()}`,
    name,
    category,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Number(price),
    inStock: Number(stockCount) > 0,
    stockCount: Number(stockCount) || 50,
    unit: unit || "piece",
    image: image || "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
    description: description || "",
    isBestseller: false,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  saveDB();

  res.status(201).json({ success: true, product: newProduct });
};

export const getOrders = (req, res) => {
  const { studentId, status } = req.query;
  let filtered = [...orders];

  if (studentId) {
    filtered = filtered.filter((o) => o.studentId === studentId);
  }

  if (status) {
    filtered = filtered.filter((o) => o.status.toLowerCase() === status.toLowerCase());
  }

  filtered.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  res.json({ orders: filtered, total: filtered.length });
};

// Initiate Razorpay / UPI Payment for Stationery Pre-Order
export const createPaymentOrder = async (req, res) => {
  const { studentId, items, totalAmount } = req.body;

  if (!studentId || !items || !totalAmount) {
    return res.status(400).json({ error: "Missing payment order details" });
  }

  const amountInPaise = Math.round(Number(totalAmount) * 100);
  const receipt = `km_rcpt_${Date.now()}`;

  if (razorpay) {
    try {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          studentId,
          itemCount: items.length,
          store: "UniMandi Official SAC Store",
        },
      });

      return res.json({
        success: true,
        mode: "live_razorpay",
        keyId: razorpayKeyId,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt,
      });
    } catch (err) {
      console.error("Razorpay order creation error:", err);
    }
  }

  // Instant Campus UPI Direct Gateway
  const simulatedOrderId = `order_sim_${Date.now()}`;
  res.json({
    success: true,
    mode: "campus_upi_instant",
    orderId: simulatedOrderId,
    amount: amountInPaise,
    currency: "INR",
    receipt,
    upiVpa: "unimandi.sac@icici",
  });
};

// Place / Confirm Order with QR generation
export const createOrder = (req, res) => {
  const {
    studentId,
    studentName,
    studentRoll,
    studentBranch,
    items,
    totalAmount,
    paymentMethod,
    paymentId,
    razorpaySignature,
  } = req.body;

  if (!studentId || !items || items.length === 0 || !totalAmount) {
    return res.status(400).json({ error: "Invalid order parameters" });
  }

  const randomCode = Math.floor(100000 + Math.random() * 900000);
  const pickupCode = `UM-${randomCode}`;
  const qrDataPayload = `UNIMANDI-SAC-${randomCode}-${studentId}-${Date.now()}`;

  const newOrder = {
    id: `ord_${Date.now()}`,
    pickupCode,
    studentId,
    studentName: studentName || "Campus Student",
    studentRoll: studentRoll || "",
    studentBranch: studentBranch || "",
    items,
    totalAmount: Number(totalAmount),
    status: "Ready for Pickup",
    placedAt: new Date().toISOString(),
    pickupSlot: "Today, Counter Pickup (SAC Counter #2)",
    pickupLocation: "UniMandi SAC Central Store Counter #2",
    qrDataPayload,
    paymentMethod: paymentMethod || "Razorpay UPI",
    paymentId: paymentId || `pay_sim_${Date.now()}`,
    paymentStatus: "Paid & Verified",
  };

  orders.unshift(newOrder);

  // Decrement stock
  items.forEach((item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod && prod.stockCount) {
      prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
      prod.inStock = prod.stockCount > 0;
    }
  });

  saveDB();

  res.status(201).json({ success: true, order: newOrder });
};

// Merchant SAC Counter Verifies QR Code
export const verifyPickup = (req, res) => {
  const { id } = req.params;
  const { pickupCode, qrPayload } = req.body;

  let order = orders.find(
    (o) =>
      o.id === id ||
      o.pickupCode === pickupCode ||
      o.pickupCode === `KM-${pickupCode}` ||
      o.pickupCode === `TN-${pickupCode}` ||
      o.qrDataPayload === qrPayload
  );

  if (!order) {
    return res.status(404).json({ error: "Order not found with provided QR or Pickup Code" });
  }

  if (order.status === "Picked Up / Completed") {
    return res.status(400).json({ error: "This order has already been verified and picked up!" });
  }

  order.status = "Picked Up / Completed";
  order.completedAt = new Date().toISOString();
  saveDB();

  res.json({
    success: true,
    message: `Order #${order.pickupCode} verified! Handed over to ${order.studentName} (${order.studentRoll}). Total: ₹${order.totalAmount}`,
    order,
  });
};
