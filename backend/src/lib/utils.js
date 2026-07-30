import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role || "user",
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