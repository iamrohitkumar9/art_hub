const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["buyer", "artist", "admin"],
      default: "buyer",
    },

    bio: { type: String },

    avatarUrl: { type: String },

    socialLinks: {
      instagram: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
