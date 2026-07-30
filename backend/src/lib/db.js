import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// Helper to seed default multi-role development account during database initialization
const seedAdminAccount = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "namanabrol777@gmail.com";
    const adminPass = process.env.ADMIN_PASSWORD || "namanabrol";
    const allRoles = ["ADMIN", "DOCTOR", "BLOOD_BANK", "DONOR"];

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminPass, salt);

      const adminUser = new User({
        username: "namanabrol",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        fullName: "Super Admin (Multi-Role Dev)",
        role: "ADMIN",
        roles: allRoles, // Multi-role support for single account across all 4 portals
        isVerified: true,
        jobTitle: "Platform Administrator & Doctor",
        bio: "Multi-role development user with full access across all 4 BloodLink portals.",
        hospitalName: "St. Jude Central Hospital",
        licenseNumber: "MD-99201",
        bankName: "Metropolitan Central Blood Bank",
        authProvider: "local",
      });

      await adminUser.save();
      console.log("✅ Default Multi-Role Account initialized successfully.");
    } else {
      // Ensure existing account has all 4 roles
      let modified = false;
      if (!existingAdmin.roles || existingAdmin.roles.length < 4) {
        existingAdmin.roles = allRoles;
        modified = true;
      }
      if (!existingAdmin.hospitalName) {
        existingAdmin.hospitalName = "St. Jude Central Hospital";
        existingAdmin.licenseNumber = "MD-99201";
        existingAdmin.bankName = "Metropolitan Central Blood Bank";
        modified = true;
      }
      if (modified) {
        await existingAdmin.save();
        console.log("✅ Updated existing account with all 4 roles!");
      }
    }
  } catch (error) {
    console.error("Error seeding Admin account:", error.message);
  }
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    await seedAdminAccount();
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};