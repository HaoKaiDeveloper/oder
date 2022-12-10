const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken.split(" ")[1];
  try {
    const user = jwt.verify(token, process.env.JWT_KEY);
    if (user) {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "授權錯誤" });
  }
};

module.exports = authenticate;
