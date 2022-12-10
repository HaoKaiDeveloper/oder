const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      validate: {
        validator: validator.isEmail,
      },
    },
    delivery: {
      type: String,
      required: true,
    },
    clientCity: {
      type: String,
      default: "台北",
    },
    clientAddress: {
      type: String,
    },
    payment: {
      type: String,
    },
    creditNum: {
      type: String,
    },
    total: {
      type: String,
    },
    storeId: {
      type: mongoose.Types.ObjectId,
      ref: "storeUser",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paidTime: {
      type: String,
    },
    productList: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
