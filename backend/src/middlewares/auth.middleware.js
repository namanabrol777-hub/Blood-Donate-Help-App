import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to verify JWT token & attach user with activeRole to request
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    const secret = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod";
    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    req.user = user;
    // Set activeRole from decoded JWT token or fallback to primary role
    req.user.activeRole = (decoded.activeRole || user.role || "DONOR").toUpperCase();

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized - Session Expired" });
  }
};

// Middleware to enforce active role access control (RBAC)
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized Access" });
    }

    const userActiveRole = (req.user.activeRole || req.user.role || "DONOR").toUpperCase();
    const formattedAllowed = allowedRoles.map((r) => r.toUpperCase());

    if (!formattedAllowed.includes(userActiveRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden - Active role '${userActiveRole}' cannot access this dashboard. Required: [${formattedAllowed.join(", ")}]`,
      });
    }

    next();
  };
};