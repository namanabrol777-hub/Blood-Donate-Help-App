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
    role: {
      type: String,
      enum: ["ADMIN", "DOCTOR", "BLOOD_BANK", "DONOR"],
      default: "DONOR",
    },
    // Multi-role support for single account authorization across multiple portals
    roles: {
      type: [String],
      default: function () {
        return [this.role || "DONOR"];
      },
    },
    isVerified: {
      type: Boolean,
      default: function () {
        return this.role === "DONOR" || this.role === "ADMIN";
      },
    },

    // --- Donor Fields ---
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
    donationStreak: {
      type: Number,
      default: 1,
    },
    digitalCardId: {
      type: String,
      default: function () {
        return `BL-DONOR-${Math.floor(100000 + Math.random() * 900000)}`;
      },
    },

    // --- Doctor Fields ---
    hospitalName: {
      type: String,
      default: "",
    },
    licenseNumber: {
      type: String,
      default: "",
    },
    specialty: {
      type: String,
      default: "General Physician",
    },

    // --- Blood Bank Fields ---
    bankName: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
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
      default: "BloodLink User registered on the lifesaving platform.",
    },
    jobTitle: {
      type: String,
      default: "Registered User",
    },
  },
  { timestamps: true }
);

// Pre-save hook ensuring `roles` includes primary `role`
userSchema.pre("save", function (next) {
  if (this.role && (!this.roles || this.roles.length === 0)) {
    this.roles = [this.role];
  } else if (this.role && !this.roles.includes(this.role)) {
    this.roles.push(this.role);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;