const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        artwork: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Artwork",
        },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],

    total: Number,

    shippingAddress: { type: String },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentInfo: {
      paymentId: String,
      provider: String,
      status: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
