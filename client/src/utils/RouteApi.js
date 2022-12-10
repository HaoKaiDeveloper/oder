export const host = "http://localhost:5000";
// export const host = "https://odappvuedemo.herokuapp.com";

// auth
export const authRoute = `${host}/auth`;
export const getStoreDataRoute = `${host}/auth/getStoreData`;
export const updataStoreInfo = `${host}/auth/updataStore`;
export const uploadHeaderImgRoute = `${host}/auth/uploadHeaderImg`;

// product
export const getProductListRoute = `${host}/product/getProductList`;
export const firstGetListRoute = `${host}/product/firstGetProductList`;
export const createProductRoute = `${host}/product/createProduct`;
export const updataProductRoute = `${host}/product/updateProduct`;
export const soldOutProduceRoute = `${host}/product/soldOutProduce`;
export const deleteProductRoute = `${host}/product/deleteProduct`;
export const updateProductImageRoute = `${host}/product/updateProductImage`;
export const deleteProductImgRoute = `${host}/product/deleteProductImg`;
// order
export const createOrderRoute = `${host}/order/createOrder`;
export const getOrderListRoute = `${host}/order/getOrderList`;
export const deleteOrderRoute = `${host}/order/deleteOrder`;
export const completedOrderRoute = `${host}/order/completedOrder`;
export const paidOrderRoute = `${host}/order/paidOrder`;
export const firstGetLiseRoute = `${host}/order/firstGetLise`;
export const postingOrderRoute = `${host}/order/postingOrder`;
// image
export const uploadImgRoute = `${host}/img/uploadImg`;
export const deleteImgRoute = `${host}/img/deleteImg`;
