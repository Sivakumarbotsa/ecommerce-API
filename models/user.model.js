const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

// ✅ Prevent overwrite error in dev mode
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
