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
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
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
      default: "Building the future with modern design & clean code.",
    },
    jobTitle: {
      type: String,
      default: "Software Engineer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;