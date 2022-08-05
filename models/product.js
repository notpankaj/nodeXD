const mongoose = require("mongoose");

const product = mongoose.Schema({
  title: { type: String, required: true, maxLength: 30 },
  short_description: { type: String, maxLength: 250 },
  qty: { type: Number, default: 1 },
  price: { type: Number, required: true },
  images: [{ type: String }],
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "store",
    required: true,
  },
});

const Product = mongoose.model("product", product);

//* pre -> hooks
// Product.schema("validate", function (next) {
//   if (this.images.length > 5) {
//     throw new Error("product images exceeds maximum array size (5)!");
//   }
//   next();
// });
module.exports = Product;
