const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: "other",
  },
  description: {
    type: String,
  },
  imgs: {
    type: [],
  },
  soldOut: {
    type: Boolean,
    default: false,
  },
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: "storeUser",
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
