const express = require("express");
const router = express.Router();

const auth = require("../utilities/auth");
const orderService = require("../services/orderService");

// CREATE ORDER
router.post("/create", auth, async (req, res) => {
  try {
    const order = await orderService.createOrder(req.user._id, req.body);
    res.json(order);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// GET MY ORDERS
router.get("/", auth, async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.user._id);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
