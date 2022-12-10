const StoreUser = require("../model/authModel");
const Statistic = require("../model/statistics");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { baseInfo, createJWT } = require("../utils/jwt");
const { upload } = require("./imageControler");
const fs = require("fs");

const register = async (req, res) => {
  const { email, storeName, password } = req.body;
  if (!email || !storeName || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false });
  }
  const emailExist = await StoreUser.findOne({ email });
  if (emailExist) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "email已有使用者" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await StoreUser.create({
    storeName,
    email,
    password: hashPassword,
  });
  const statisticData = await Statistic.create({ storeId: user._id });

  const tokencDate = baseInfo(user);
  const token = createJWT(tokencDate);

  return res.status(StatusCodes.OK).json({
    user: tokencDate,
    success: true,
    token: token,
    statisticData,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false });
  }
  const user = await StoreUser.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "email或密碼錯誤" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "email或密碼錯誤" });
  }
  const statisticData = await Statistic.findOne({ storeId: user._id });
  if (!statisticData) {
    await Statistic.create({ storeId: user._id });
  }

  const tokencDate = baseInfo(user);
  const token = createJWT(tokencDate);

  const resUser = {
    _id: user._id,
    storeName: user.storeName,
    email: user.email,
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    headerImg: user.headerImg || {},
  };

  return res
    .status(StatusCodes.OK)
    .json({ user: resUser, success: true, token: token });
};

const getStoreData = async (req, res) => {
  const { storeId } = req.params;

  if (!storeId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "查無此商家" });
  }
  const user = await StoreUser.findById(storeId).select("-password");
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "查無此商家" });
  }

  const resUser = {
    _id: user._id,
    storeName: user.storeName,
    email: user.email,
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    headerImg: user.headerImg || "",
  };

  res.status(StatusCodes.OK).json({ user: resUser, success: true });
};

const updataStoreInfo = async (req, res) => {
  const { _id: storeId } = req.user;
  const { storeName, email: newEmail } = req.body;

  if (!storeName || !storeId || !newEmail) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "查無此商家" });
  }

  const store = await StoreUser.findOne({ email: newEmail }).select(
    "-password"
  );
  if (store && store._id.toString() !== storeId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "email已有使用者" });
  }

  const newStore = await StoreUser.findByIdAndUpdate(
    { _id: storeId },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  ).select("-password");

  res.status(StatusCodes.OK).json({ newStore, success: true });
};
const uploadHeaderImg = async (req, res) => {
  const { _id: storeId } = req.user;
  const store = await StoreUser.findById(storeId);

  if (!storeId || !store) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "查無此商家" });
  }

  if (store.headerImg) {
    // 刪除
    const url = store.headerImg.slice(7);
    const path = `./uploads/${url}`;
    fs.unlinkSync(path);
  }

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, err });
    }

    store.headerImg = res.req.file.path;
    await store.save();

    res.status(StatusCodes.OK).json({ store, success: true });
  });
};

module.exports = {
  register,
  login,
  getStoreData,
  updataStoreInfo,
  uploadHeaderImg,
};
