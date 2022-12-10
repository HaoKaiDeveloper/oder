const router = require("express").Router();
const {
  getProductList,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductImage,
  deleteProductImg,
  soldOutProduce,
  firstGetProductList,
} = require("../controllers/productController");
const authenticate = require("../middleware/authenticate");

router.get("/getProductList/:storeId", getProductList);

router.get("/firstGetProductList/:storeId", firstGetProductList);

router.post("/createProduct", authenticate, createProduct);

router.patch("/updateProduct/:id", authenticate, updateProduct);

router.post("/updateProductImage/:id", authenticate, updateProductImage);

router.post("/deleteProductImg/:id", authenticate, deleteProductImg);

router.post("/soldOutProduce/:id", authenticate, soldOutProduce);

router.delete("/deleteProduct/:id", authenticate, deleteProduct);

module.exports = router;
