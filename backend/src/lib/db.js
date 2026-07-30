import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// Helper to seed default Admin account silently during database initialization
const seedAdminAccount = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "namanabrol777@gmail.com";
    const adminPass = process.env.ADMIN_PASSWORD || "namanabrol";

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminPass, salt);

      const adminUser = new User({
        username: "namanabrol",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        fullName: "Super Admin",
        role: "ADMIN",
        isVerified: true,
        jobTitle: "Platform Super Administrator",
        bio: "System Administrator of BloodLink Platform",
        authProvider: "local",
      });

      await adminUser.save();
      console.log("✅ Super Admin Account initialized successfully.");
    } else if (existingAdmin.role !== "ADMIN") {
      existingAdmin.role = "ADMIN";
      existingAdmin.isVerified = true;
      await existingAdmin.save();
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