const router = require("express").Router();
const {
  register,
  login,
  getStoreData,
  updataStoreInfo,
  uploadHeaderImg,
} = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

router.post("/register", register);
router.post("/login", login);
router.get("/getStoreData/:storeId", getStoreData);
router.patch("/updataStore", authenticate, updataStoreInfo);
router.post("/uploadHeaderImg", authenticate, uploadHeaderImg);

module.exports = router;
