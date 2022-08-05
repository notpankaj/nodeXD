const mongoose = require("mongoose");

const store = mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  email: { type: String, required: false, trim: true },
  isClosed: { type: Boolean, default: false },
  status: { type: String, default: "active", enum: ["active", "inactive"] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
});

const Store = mongoose.model("store", store);
module.exports = Store;
