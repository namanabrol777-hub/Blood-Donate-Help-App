import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// Helper to seed default Admin account during database initialization
const seedAdminAccount = async () => {
  try {
    const adminEmail = "namanabrol777@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!existingAdmin) {
      console.log("⚡ Seeding Default Admin Account (namanabrol777@gmail.com)...");
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash("namanabrol", salt);

      const adminUser = new User({
        username: "namanabrol",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        fullName: "Super Admin (Naman Abrol)",
        role: "ADMIN",
        isVerified: true,
        jobTitle: "Platform Super Administrator",
        bio: "Default Super Administrator of BloodLink Platform",
        authProvider: "local",
      });

      await adminUser.save();
      console.log("✅ Default Admin Account Seeded Successfully!");
    } else if (existingAdmin.role !== "ADMIN") {
      existingAdmin.role = "ADMIN";
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log("✅ Existing account updated to ADMIN role!");
    }
  } catch (error) {
    console.error("Error seeding Admin account:", error.message);
  }
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    // Run Admin Account Seeder
    await seedAdminAccount();
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};