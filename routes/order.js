const router = require("express").Router();

const {
  createOrder,
  getOrderList,
  deleteOrder,
  completedOrder,
  paidOrder,
  firstGetLise,
  postingOrder,
} = require("../controllers/orderController");
const authenticate = require("../middleware/authenticate");

router.get("/getOrderList", authenticate, getOrderList);

router.get("/firstGetLise", authenticate, firstGetLise);

router.get("/postingOrder", authenticate, postingOrder);

router.post("/createOrder", createOrder);

router.delete("/deleteOrder/:id", authenticate, deleteOrder);

router.post("/completedOrder", authenticate, completedOrder);

router.post("/paidOrder", authenticate, paidOrder);

module.exports = router;
