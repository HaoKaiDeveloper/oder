const mongoose = require("mongoose");
const validator = require("validator");

const storeUserSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "請輸入Email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  headerImg: {
    type: String,
  },
});

module.exports = mongoose.model("storeUser", storeUserSchema);
