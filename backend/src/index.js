import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import donorRoutes from "./routes/donor.route.js";
import reportRoutes from "./routes/report.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import bloodBankRoutes from "./routes/bloodBank.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate Limiting Security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});
app.use("/api/", limiter);

// Express Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/bloodBank", bloodBankRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Security-Enforced Server running on port: ${PORT}`);
  connectDB();
});
