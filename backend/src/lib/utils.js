import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  // Minimal secure JWT payload containing only userId, role, and email
  const payload = {
    userId: user._id,
    role: user.role || "DONOR",
    email: user.email,
  };

  const secret = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod";

  const token = jwt.sign(payload, secret, {
    expiresIn: "1h", // Exactly 1 hour expiry
  });

  if (res) {
    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 1000, // 1 hour in ms
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return token;
};