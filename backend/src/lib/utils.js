import jwt from "jsonwebtoken";

export const generateToken = (user, activeRole, res) => {
  // Secure JWT payload featuring activeRole & roles array
  const currentActiveRole = activeRole || user.activeRole || user.role || "DONOR";
  const userRoles = user.roles && user.roles.length > 0 ? user.roles : [currentActiveRole];

  const payload = {
    userId: user._id,
    email: user.email,
    activeRole: currentActiveRole,
    roles: userRoles,
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