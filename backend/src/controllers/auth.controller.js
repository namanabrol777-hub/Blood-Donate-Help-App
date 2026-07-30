import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Helper to format user response safely with activeRole & roles array
const sanitizeUser = (user, activeRoleOverride) => {
  const currentActiveRole = activeRoleOverride || user.activeRole || user.role || "DONOR";
  const userRoles = user.roles && user.roles.length > 0 ? user.roles : [currentActiveRole];

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    fullName: user.fullName || user.username,
    avatar: user.avatar,
    role: currentActiveRole.toUpperCase(),
    activeRole: currentActiveRole.toUpperCase(),
    roles: userRoles.map((r) => r.toUpperCase()),
    isVerified: user.isVerified ?? true,
    bloodGroup: user.bloodGroup || "O+",
    isAvailableForDonation: user.isAvailableForDonation ?? true,
    emergencyContact: user.emergencyContact || "",
    donationsCount: user.donationsCount || 0,
    donationStreak: user.donationStreak || 1,
    digitalCardId: user.digitalCardId || `BL-DONOR-${Math.floor(100000 + Math.random() * 900000)}`,
    hospitalName: user.hospitalName || "St. Jude Central Hospital",
    licenseNumber: user.licenseNumber || "MD-99201",
    specialty: user.specialty || "General Physician",
    bankName: user.bankName || "Metropolitan Central Blood Bank",
    address: user.address || "",
    bio: user.bio,
    jobTitle: user.jobTitle,
    authProvider: user.authProvider,
    createdAt: user.createdAt,
  };
};

export const signup = async (req, res) => {
  const { username, email, password, role, bloodGroup, hospitalName, licenseNumber, bankName } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Username, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const requestedRole = (role || "DONOR").toUpperCase();

    // Restrict Public Admin Creation
    if (requestedRole === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be created via public registration. Contact system administration.",
      });
    }

    const allowedRoles = ["DOCTOR", "BLOOD_BANK", "DONOR"];
    const finalRole = allowedRoles.includes(requestedRole) ? requestedRole : "DONOR";

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    const existingUsername = await User.findOne({ username: username.trim() });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username is already taken" });
    }

    // Bcrypt with 12 salt rounds
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      fullName: username.trim(),
      password: hashedPassword,
      role: finalRole,
      roles: [finalRole],
      bloodGroup: bloodGroup || "O+",
      hospitalName: hospitalName || "",
      licenseNumber: licenseNumber || "",
      bankName: bankName || "",
      authProvider: "local",
    });

    await newUser.save();
    const token = generateToken(newUser, finalRole, res);

    return res.status(201).json({
      success: true,
      message: `Registered successfully as ${finalRole}`,
      token,
      user: sanitizeUser(newUser, finalRole),
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { usernameOrEmail, password, selectedRole, role } = req.body;

  try {
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: "Username/Email and password are required" });
    }

    const targetRole = (selectedRole || role || "DONOR").toUpperCase();

    const query = usernameOrEmail.includes("@")
      ? { email: usernameOrEmail.toLowerCase().trim() }
      : { username: usernameOrEmail.trim() };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (user.authProvider !== "local" && !user.password) {
      return res.status(400).json({
        success: false,
        message: `Account created via ${user.authProvider}. Please use ${user.authProvider} login.`,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // MULTI-ROLE VALIDATION: Check if user's roles array contains targetRole
    const userRoles = user.roles && user.roles.length > 0 ? user.roles.map((r) => r.toUpperCase()) : [user.role.toUpperCase()];

    if (!userRoles.includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials for the selected role.",
      });
    }

    // Generate token for the active role selected
    const token = generateToken(user, targetRole, res);

    return res.status(200).json({
      success: true,
      message: `Logged in successfully as ${targetRole}`,
      token,
      user: sanitizeUser(user, targetRole),
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  const { email, name, googleId, avatar, selectedRole, role } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required for Google OAuth" });
    }

    const targetRole = (selectedRole || role || "DONOR").toUpperCase();
    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      const finalRole = ["DOCTOR", "BLOOD_BANK", "DONOR"].includes(targetRole) ? targetRole : "DONOR";

      const generatedUsername = (name || email.split("@")[0]).replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000);
      user = new User({
        username: generatedUsername,
        email: email.toLowerCase().trim(),
        fullName: name || generatedUsername,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${generatedUsername}`,
        role: finalRole,
        roles: [finalRole],
        bloodGroup: "O+",
        authProvider: "google",
        googleId: googleId || `google-${Date.now()}`,
      });
      await user.save();
    } else {
      const userRoles = user.roles && user.roles.length > 0 ? user.roles.map((r) => r.toUpperCase()) : [user.role.toUpperCase()];
      if (!userRoles.includes(targetRole)) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials for the selected role.",
        });
      }
    }

    const token = generateToken(user, targetRole, res);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      token,
      user: sanitizeUser(user, targetRole),
    });
  } catch (error) {
    console.error("Error in Google Auth controller:", error);
    return res.status(500).json({ success: false, message: "Google Auth Failed", error: error.message });
  }
};

export const facebookAuth = async (req, res) => {
  const { email, name, facebookId, avatar, selectedRole, role } = req.body;

  try {
    const targetEmail = email || `${facebookId || Date.now()}@facebook.com`;
    const targetRole = (selectedRole || role || "DONOR").toUpperCase();
    let user = await User.findOne({ email: targetEmail.toLowerCase().trim() });

    if (!user) {
      const finalRole = ["DOCTOR", "BLOOD_BANK", "DONOR"].includes(targetRole) ? targetRole : "DONOR";

      const generatedUsername = (name || "donor").replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000);
      user = new User({
        username: generatedUsername,
        email: targetEmail.toLowerCase().trim(),
        fullName: name || generatedUsername,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${generatedUsername}`,
        role: finalRole,
        roles: [finalRole],
        bloodGroup: "O+",
        authProvider: "facebook",
        facebookId: facebookId || `facebook-${Date.now()}`,
      });
      await user.save();
    } else {
      const userRoles = user.roles && user.roles.length > 0 ? user.roles.map((r) => r.toUpperCase()) : [user.role.toUpperCase()];
      if (!userRoles.includes(targetRole)) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials for the selected role.",
        });
      }
    }

    const token = generateToken(user, targetRole, res);

    return res.status(200).json({
      success: true,
      message: "Facebook authentication successful",
      token,
      user: sanitizeUser(user, targetRole),
    });
  } catch (error) {
    console.error("Error in Facebook Auth controller:", error);
    return res.status(500).json({ success: false, message: "Facebook Auth Failed", error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: sanitizeUser(req.user, req.user.activeRole),
    });
  } catch (error) {
    console.error("Error in checkAuth controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, fullName, avatar, bio, jobTitle, bloodGroup, isAvailableForDonation, emergencyContact, hospitalName, licenseNumber, bankName } = req.body;
    const userId = req.user._id;

    const updates = {};
    if (username) updates.username = username.trim();
    if (fullName) updates.fullName = fullName.trim();
    if (avatar) updates.avatar = avatar;
    if (bio) updates.bio = bio;
    if (jobTitle) updates.jobTitle = jobTitle;
    if (bloodGroup) updates.bloodGroup = bloodGroup;
    if (typeof isAvailableForDonation === "boolean") updates.isAvailableForDonation = isAvailableForDonation;
    if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact;
    if (hospitalName !== undefined) updates.hospitalName = hospitalName;
    if (licenseNumber !== undefined) updates.licenseNumber = licenseNumber;
    if (bankName !== undefined) updates.bankName = bankName;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully!",
      user: sanitizeUser(updatedUser, req.user.activeRole),
    });
  } catch (error) {
    console.error("Error in update profile:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};
