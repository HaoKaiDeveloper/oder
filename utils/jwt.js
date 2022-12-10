const jwt = require("jsonwebtoken");

const baseInfo = (user) => {
  return { _id: user._id, storeName: user.storeName, email: user.email };
};

const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_LIFE_TIME,
  });
  return token;
};

module.exports = {
  createJWT,
  baseInfo,
};
