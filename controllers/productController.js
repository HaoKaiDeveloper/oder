const Statistic = require("../model/statistics");
const Product = require("../model/productModel");
const { StatusCodes } = require("http-status-codes");
const { upload } = require("./imageControler");
const fs = require("fs");

const getProductList = async (req, res) => {
  const { storeId } = req.params;
  const { category, search } = req.query;

  if (!storeId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "查無此商家" });
  }
  let filterObj = {
    createBy: storeId,
  };

  if (category && category !== "全部") {
    filterObj.category = category;
  }

  if (search) {
    filterObj.productName = { $regex: search, $options: "i" };
  }

  let result = Product.find(filterObj);

  const productList = await result;

  res.status(StatusCodes.OK).json({ success: true, productList });
};
const firstGetProductList = async (req, res) => {
  const { storeId } = req.params;
  if (!storeId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "查無此商家" });
  }

  const productList = await Product.find({ createBy: storeId });
  res.status(StatusCodes.OK).json({ success: true, productList });
};

const createProduct = async (req, res) => {
  const { _id: storeId } = req.user;
  let { productName, price } = req.body;

  if (!productName || !price) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "資料請填寫齊全" });
  }

  const product = await Product.create({ ...req.body, createBy: storeId });
  const statisticDate = await Statistic.findOne({ storeId });

  let tempProducts = statisticDate.products;
  let tempAllData = statisticDate.allData;
  const tempObj = {
    productId: product._id.toString(),
    category: product.category,
    productName: productName,
    price: price,
    amount: 0,
    total: 0,
  };

  if (tempAllData.length > 0) {
    tempAllData[tempAllData.length - 1].products.push(tempObj);
  }

  tempProducts.push(tempObj);

  await Statistic.findOneAndUpdate(
    { storeId },
    { products: tempProducts, allData: tempAllData },
    {
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({ product, success: true });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const { _id: storeId } = req.user;
  const { productName, category, price } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "查無此商品" });
  }

  if (product.createBy.toString() !== storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "查無此商品" });
  }
  const statisticDate = await Statistic.findOne({ storeId });
  let tempProducts = statisticDate.products;
  let tempAllData = statisticDate.allData;

  tempProducts.forEach((item) => {
    if (item.productId === product._id.toString()) {
      item.productName = productName;
      item.price = price;
      item.category = category;
    }
  });

  if (tempAllData.length > 0) {
    let arr = tempAllData[tempAllData.length - 1].products;
    arr.forEach((item) => {
      if (item.productId === product._id.toString()) {
        item.productName = productName;
        item.price = price;
        item.category = category;
      }
    });
    tempAllData[tempAllData.length - 1].products = arr;
  }

  const newPrduct = await Product.findOneAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );
  await Statistic.findOneAndUpdate(
    { storeId },
    { products: tempProducts, allData: tempAllData },
    {
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({ newPrduct, success: true });
};

const updateProductImage = async (req, res) => {
  const { id: productId } = req.params;
  const { _id: storeId } = req.user;
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, err });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, msg: "查無此商品" });
    }

    if (product.createBy.toString() !== storeId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, msg: "查無此商品" });
    }

    product.imgs = [...product.imgs, res.req.file.path];
    await product.save();

    res.status(StatusCodes.OK).json({ success: true, product });
  });
};

const deleteProductImg = async (req, res) => {
  const { _id: storeId } = req.user;
  const { id: productId } = req.params;
  let { url } = req.body;
  url = url.slice(7);
  const path = `./uploads/${url}`;
  fs.unlinkSync(path);

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "查無此商品" });
  }

  if (product.createBy.toString() !== storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "查無此商品" });
  }

  product.imgs = product.imgs.filter((img) => img.slice(7) !== url);
  await product.save();

  res.status(StatusCodes.OK).json({ product, success: false });
};

const soldOutProduce = async (req, res) => {
  const { _id: storeId } = req.user;
  const { id: productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "查無此商品" });
  }

  if (product.createBy.toString() !== storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "查無此商品" });
  }

  product.soldOut = !product.soldOut;

  await product.save();

  res.status(StatusCodes.OK).json({ product, success: true });
};

const deleteProduct = async (req, res) => {
  const { _id: storeId } = req.user;
  const { id: productId } = req.params;

  const product = await Product.findById(productId);
  const statisticDate = await Statistic.findOne({ storeId });
  let tempAllData = statisticDate.allData;
  let tempProducts = statisticDate.products;
  const tempImgs = product.imgs;
  if (!product || !statisticDate) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "查無此商品" });
  }

  if (product.createBy.toString() !== storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "查無此商品" });
  }

  if (tempAllData.length > 0) {
    let arr = tempAllData[tempAllData.length - 1].products;
    arr = arr.filter((p) => p.productId !== product._id.toString());

    tempAllData[tempAllData.length - 1].products = arr;
  }

  await Statistic.findOneAndUpdate(
    { storeId },
    { products: tempProducts, allData: tempAllData },
    {
      new: true,
    }
  );
  await product.delete();
  tempImgs.forEach((img) => {
    let url = img.slice(7);
    const path = `./uploads/${url}`;
    fs.unlinkSync(path);
  });
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getProductList,
  createProduct,
  updateProduct,
  deleteProduct,
  soldOutProduce,
  updateProductImage,
  deleteProductImg,
  firstGetProductList,
};
