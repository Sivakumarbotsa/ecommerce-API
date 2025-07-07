const Product = require("../models/product.model");

exports.getAll = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const products = await Product.find({
    name: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(products);
};

exports.add = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
};

exports.update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};
