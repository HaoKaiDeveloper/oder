const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Types.ObjectId,
    ref: "storeUser",
    required: true,
  },
  paidOrders: {
    type: Array,
  },
  deleteOrders: {
    type: Array,
  },
  products: {
    type: [{}],
  },
  city: {
    type: Array,
    default: [],
  },
  allData: {
    type: [{}],
  },
  lastSignIn: {
    type: String,
    default: 0,
  },
});

module.exports = mongoose.model("statistic", statisticsSchema);
