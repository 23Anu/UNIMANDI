import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { isSupabaseConfigured } from "./config/supabase.js";
import { initSocket } from "./socket.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import safetyRoutes from "./routes/safetyRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Live WebSockets
const io = initSocket(httpServer);

// Global Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Rate Limiting & Anti-Spam (Phase 3 of Kampus Implementation Plan)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40, // 40 auth attempts per 15 min
  message: { error: "Too many authentication attempts, please try again later." },
});

app.use("/api", globalLimiter);
app.use("/api/auth", authLimiter);

// Serve Uploaded Files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "UNIMANDI Live Campus Platform",
    version: "2.1.0-PROD",
    realtime: "Socket.io Active",
    supabaseConfigured: isSupabaseConfigured(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/safety", safetyRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/upload", uploadRoutes);

// Catch-all 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Connect to Database & Start Server
const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`🚀 UNIMANDI Production Server running on http://localhost:${PORT}`);
    console.log(`⚡ Real-time Socket.io Gateway active on port ${PORT}`);
    console.log(`🛡️ Rate Limiting & Anti-Spam active on all /api routes`);
  });
};

startServer();
