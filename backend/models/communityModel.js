const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String },

    body: { type: String },

    attachments: [String], // image URLs or files
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityPost", communitySchema);
