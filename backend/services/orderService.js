const Order = require("../models/orderModel");
const Artwork = require("../models/artworkModel");

module.exports = {
  // Create order
  async createOrder(buyerId, data) {
    const { items, shippingAddress } = data;

    let total = 0;
    const processedItems = [];

    for (const item of items) {
      const art = await Artwork.findById(item.artwork);
      if (!art) throw new Error("Artwork not found");

      if (art.inventory < item.quantity)
        throw new Error(`Not enough inventory for ${art.title}`);

      total += art.price * item.quantity;

      processedItems.push({
        artwork: art._id,
        quantity: item.quantity,
        price: art.price,
      });

      art.inventory -= item.quantity;
      await art.save();
    }

    const order = await Order.create({
      buyer: buyerId,
      items: processedItems,
      total,
      shippingAddress,
      status: "paid",
    });

    return order;
  },

  // Get user orders
  async getOrders(buyerId) {
    return await Order.find({ buyer: buyerId }).populate("items.artwork");
  },
};
