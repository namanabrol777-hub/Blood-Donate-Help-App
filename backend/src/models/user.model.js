import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      minlength: 6,
    },
    fullName: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=256",
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      default: "O+",
    },
    isAvailableForDonation: {
      type: Boolean,
      default: true,
    },
    emergencyContact: {
      type: String,
      default: "",
    },
    donationsCount: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["user", "donor", "hospital", "admin"],
      default: "donor",
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    googleId: {
      type: String,
      default: "",
    },
    facebookId: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "Proud BloodLink Donor saving lives through timely blood donations.",
    },
    jobTitle: {
      type: String,
      default: "Registered Blood Donor",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;