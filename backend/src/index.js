import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import reportRoutes from "./routes/report.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import bloodBankRoutes from "./routes/bloodBank.route.js";
// import donorRoutes from "./routes/donor.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Reflects request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight requests
app.options('*', cors());

app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/bloodBank", bloodBankRoutes);
// app.use("/api/donor", donorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
  connectDB();
});
