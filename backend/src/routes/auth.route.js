import express from "express";
import { body } from "express-validator";
import {
  checkAuth,
  login,
  logout,
  signup,
  googleAuth,
  facebookAuth,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Input Validation Middleware
const validateRegister = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("usernameOrEmail").notEmpty().withMessage("Username or email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Auth endpoints
router.post("/register", validateRegister, signup);
router.post("/signup", validateRegister, signup); // Alias
router.post("/login", validateLogin, login);
router.post("/google", googleAuth);
router.post("/facebook", facebookAuth);
router.post("/logout", protectRoute, logout);

// Profile endpoints
router.get("/check", protectRoute, checkAuth);
router.get("/profile", protectRoute, checkAuth);
router.put("/profile", protectRoute, updateProfile);
router.put("/update-profile", protectRoute, updateProfile);

export default router;