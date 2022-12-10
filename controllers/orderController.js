const Statistic = require("../model/statistics");
const Order = require("../model/OrderModel");
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res) => {
  const { clientName, clientPhone, storeId } = req.body;
  if (!clientName || !clientPhone || !storeId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "顧客資訊未齊全", success: false });
  }

  const newOrder = await Order.create(req.body);

  res.status(StatusCodes.OK).json({ order: newOrder, success: true });
};

const getOrderList = async (req, res) => {
  const { _id: storeId } = req.user;
  const { search, completed, paid, delivery } = req.query;
  if (!storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "驗證錯誤", success: false });
  }
  const filterObj = {
    storeId: storeId,
  };
  if (completed && completed !== "all") {
    filterObj.completed = completed;
  }
  if (paid && paid !== "null") {
    filterObj.paid = paid;
  }
  if (delivery && delivery === "inStore") {
    filterObj.delivery = delivery;
  }
  if (search && isNaN(search)) {
    filterObj.clientName = { $regex: search, $options: "i" };
  }
  if (search && !isNaN(search)) {
    filterObj.clientPhone = { $regex: search, $options: "i" };
  }
  let result = Order.find(filterObj);
  let limit = Number(req.query.limit);
  if (isNaN(limit)) {
    result = result.skip(0);
  } else {
    limit = limit || 5;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
  }
  const orderList = await result;
  const totalOrder = await Order.countDocuments(filterObj);
  const numOfPages = Math.ceil(totalOrder / limit) || 1;
  res
    .status(StatusCodes.OK)
    .json({ orderList, numOfPages, totalOrder, success: true });
};

const firstGetLise = async (req, res) => {
  const { _id: storeId } = req.user;
  const today = new Date(+new Date() + 8 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  if (!storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "驗證錯誤", success: false });
  }
  const statisticData = await Statistic.findOne({ storeId });
  const origOrderList = await Order.find({ storeId });

  let tempPaideOrders = statisticData.paidOrders;
  let tempLastSignIn = statisticData.lastSignIn;
  let tempProducts = statisticData.products;

  if (!tempLastSignIn || tempLastSignIn === "0") {
    tempLastSignIn = today;
  } else if (tempLastSignIn !== today) {
    tempLastSignIn = today;
    if (tempProducts.length > 0) {
      tempProducts.forEach((p) => {
        p.amount = 0;
        p.total = 0;
      });
    }
    if (tempPaideOrders.length > 0) {
      tempPaideOrders = [];
    }
  }

  await Statistic.findOneAndUpdate(
    { storeId },
    {
      paidOrders: tempPaideOrders,
      products: tempProducts,
      lastSignIn: tempLastSignIn,
    },
    {
      new: true,
    }
  );

  const orderList = origOrderList.slice(0, 5);
  const totalOrder = origOrderList.length;
  const numOfPages = Math.ceil(totalOrder / 5) || 1;

  res.status(StatusCodes.OK).json({
    statisticData,
    origOrderList,
    orderList,
    totalOrder: totalOrder,
    numOfPages: numOfPages,
    success: true,
  });
};

const deleteOrder = async (req, res) => {
  const { _id: storeId } = req.user;
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);
  let statisticData = await Statistic.findOne({ storeId });

  let tempPaideOrders = statisticData.paidOrders;
  let tempProducts = statisticData.products;
  let tempAllData = statisticData.allData;
  const matchDate = tempPaideOrders.findIndex(
    (o) => o._id.toString() === orderId
  );

  if (!order || !statisticData) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "查無訂單", success: false });
  }

  if (order.storeId.toString() !== storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "查無訂單", success: false });
  }

  if (matchDate >= 0) {
    const { payment, productList, total } = tempPaideOrders[matchDate];

    productList.forEach((p1) => {
      tempProducts.forEach((p2) => {
        if (p1._id.toString() === p2.productId) {
          p2.amount -= Number(p1.amount);
          p2.total -= Number(p1.amount * p1.price);
        }
      });
      tempAllData[tempAllData.length - 1].products.forEach((p2) => {
        if (p1._id.toString() === p2.productId) {
          p2.amount -= Number(p1.amount);
          p2.total -= Number(p1.amount * p1.price);
        }
      });
    });

    if (payment === "cash") {
      tempAllData[tempAllData.length - 1].payment.cash -= Number(total);
    } else {
      tempAllData[tempAllData.length - 1].payment.credit -= Number(total);
    }
  }
  tempPaideOrders = tempPaideOrders.filter((o) => o._id.toString() !== orderId);
  statisticData = await Statistic.findOneAndUpdate(
    { storeId },
    {
      paidOrders: tempPaideOrders,
      products: tempProducts,
      allData: tempAllData,
    },
    {
      new: true,
    }
  );

  await order.delete();

  res.status(StatusCodes.OK).json({ success: true, statisticData });
};

const completedOrder = async (req, res) => {
  const { orderId } = req.body;
  const { _id: storeId } = req.user;

  const order = await Order.findById(orderId);
  const statisticData = await Statistic.findOne({ storeId });
  if (!order || !statisticData) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "查無訂單", success: false });
  }

  if (order.storeId.toString() !== storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "查無訂單", success: false });
  }

  let tempPaideOrders = statisticData.paidOrders;
  tempPaideOrders.forEach((o) => {
    if (o._id.toString() === orderId) {
      o.completed = true;
    }
  });

  await Statistic.findOneAndUpdate(
    { storeId },
    {
      paidOrders: tempPaideOrders,
    },
    {
      new: true,
    }
  );
  order.completed = true;
  await order.save();

  res.status(StatusCodes.OK).json({ order, success: true, statisticData });
};

const postingOrder = async (req, res) => {
  const { _id: storeId } = req.user;

  await Order.deleteMany({ storeId, paid: true, completed: true });
  const statisticData = await Statistic.findOne({ storeId });
  let tempProducts = statisticData.products;
  tempProducts.forEach((p) => {
    p.amount = 0;
    p.total = 0;
  });
  await Statistic.findOneAndUpdate(
    { storeId },
    {
      paidOrders: [],
      products: tempProducts,
    },
    {
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({ statisticData });
};

const paidOrder = async (req, res) => {
  const { orderId } = req.body;
  const { _id: storeId } = req.user;

  const date = new Date().toISOString().slice(0, 7);
  const order = await Order.findById(orderId);
  const statisticData = await Statistic.findOne({ storeId });

  if (order.storeId.toString() !== storeId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "認證錯誤", success: false });
  }
  const tempPaideOrders = statisticData.paidOrders;
  const tempAllData = statisticData.allData;
  const tempProducts = statisticData.products;
  const matchDate = tempAllData.findIndex((d) => {
    return d.date === date;
  });

  order.productList.forEach((p1) => {
    tempProducts.forEach((p2) => {
      if (p1._id.toString() === p2.productId) {
        p2.amount += p1.amount;
        p2.total += p1.amount * p1.price;
      }
    });
  });

  if (matchDate >= 0) {
    // 有此筆資料
    tempAllData.forEach((d) => {
      if (d.date === date) {
        setPaidData(d, order);
      }
    });
  } else if (matchDate < 0) {
    // 無此筆資料
    const newData = {
      date: date,
      products: tempProducts,
      payment: {
        credit: 0,
        cash: 0,
      },
      orderNum: 0,
    };
    const orderPayment = order.payment;
    const total = order.total;
    if (orderPayment === "cash") {
      newData.payment.cash += Number(total);
    } else {
      newData.payment.credit += Number(total);
    }
    tempAllData.push(newData);
  }
  tempPaideOrders.push(order);

  order.paid = true;
  order.paidTime = new Date();

  await Statistic.findOneAndUpdate(
    { storeId },
    {
      products: tempProducts,
      paidOrders: tempPaideOrders,
      allData: tempAllData,
    },
    {
      new: true,
    }
  );
  await order.save();

  res.status(StatusCodes.OK).json({ order, statisticData, success: true });
};
function setPaidData(origObj, order) {
  if (order.payment === "cash") {
    origObj.payment.cash += Number(order.total);
  } else {
    origObj.payment.credit += Number(order.total);
  }
  origObj.orderNum += 1;

  order.productList.forEach((p1) => {
    origObj.products.forEach((p2) => {
      if (p1._id.toString() === p2.productId) {
        p2.amount += p1.amount;
        p2.total += p1.amount * p1.price;
      }
    });
  });
  return origObj;
}

module.exports = {
  createOrder,
  getOrderList,
  deleteOrder,
  completedOrder,
  paidOrder,
  firstGetLise,
  postingOrder,
};
