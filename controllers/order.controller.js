const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

exports.createOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart || cart.items.length === 0) return res.status(400).json({ msg: "Cart is empty" });

  const order = new Order({ user: req.user.id, items: cart.items });
  await order.save();

  cart.items = [];
  await cart.save();

  res.json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.product");
  res.json(orders);
};
