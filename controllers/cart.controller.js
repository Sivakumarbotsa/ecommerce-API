const Cart = require("../models/cart.model");

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
  const { product, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });

  const index = cart.items.findIndex((item) => item.product == product);
  if (index > -1) cart.items[index].quantity += quantity;
  else cart.items.push({ product, quantity });

  await cart.save();
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  cart.items = cart.items.filter((item) => item._id != req.params.itemId);
  await cart.save();
  res.json(cart);
};
