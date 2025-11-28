const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String },

    price: { type: Number, required: true },

    images: { type: [String], required: true, default: ['https://via.placeholder.com/1200x800.png?text=Artwork'] }, // multiple image URLs

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medium: { type: String },

    style: { type: String },

    tags: [String],

    inventory: { type: Number, default: 1 },

    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artwork", artworkSchema);
