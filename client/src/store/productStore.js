import {
  getProductListRoute,
  createProductRoute,
  updataProductRoute,
  deleteProductRoute,
  uploadImgRoute,
  deleteImgRoute,
  updateProductImageRoute,
  deleteProductImgRoute,
  soldOutProduceRoute,
  firstGetListRoute,
} from "../utils/RouteApi";
import axios from "axios";
import useAuthAxios from "../utils/useAuthAxios";

export default {
  namespaced: true,
  state() {
    return {
      origProductList: [],
      productList: [],
      uploadProductImg: JSON.parse(localStorage.getItem("imgs")) || [],
      filter: {
        category: "全部",
        search: "",
      },
      categories: [],
    };
  },
  mutations: {
    addNewProduct(state, payload) {
      state.productList.unshift(payload);
    },
    updataNewProduct(state, payload) {
      state.productList = state.productList.map((p) => {
        if (p._id === payload._id) {
          return payload;
        } else {
          return p;
        }
      });
    },
    deleteProduct(state, payload) {
      state.productList = state.productList.filter((p) => p._id !== payload);
    },
    getCategories(state, payload) {
      let categorySet = [...new Set(payload.map((c) => c.category))].filter(
        (c) => c !== "其他"
      );
      categorySet = ["全部", ...categorySet, "其他"];
      state.categories = categorySet;
    },
    setFilter(state, payload) {
      state.filter = payload;
    },
  },
  getters: {
    origProductList(state) {
      return state.origProductList;
    },
    productList(state) {
      return state.productList;
    },
    uploadProductImg(state) {
      return state.uploadProductImg;
    },
    categories(state) {
      return state.categories;
    },
  },
  actions: {
    async firstGetList(context, payload) {
      let url = `${firstGetListRoute}/${payload}`;
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          const { productList } = response.data;
          context.state.origProductList = productList;
          context.state.productList = productList;
          context.commit("getCategories", productList);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getProductList(context, payload) {
      const { category, search } = context.state.filter;
      let url = `${getProductListRoute}/${payload}?category=${category}`;
      if (search) {
        url = `${url}&search=${search}`;
      }
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          const { productList } = response.data;
          context.state.productList = productList;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async createProduct(context, payload) {
      const imgs = context.state.uploadProductImg;
      if (!payload.category) {
        payload.category = "其他";
      }
      try {
        const response = await useAuthAxios().post(createProductRoute, {
          ...payload,
          imgs,
        });
        if (response.status === 200) {
          const { product } = response.data;
          context.commit("addNewProduct", product);
          context.commit("getCategories", context.state.productList);
          context.state.uploadProductImg = [];
          localStorage.setItem("imgs", JSON.stringify([]));
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
    async updataProduct(context, payload) {
      const { _id } = payload;
      if (!payload.category) {
        payload.category = "其他";
      }
      try {
        const response = await useAuthAxios().patch(
          `${updataProductRoute}/${_id}`,
          payload
        );
        if (response.status === 200) {
          context.commit("updataNewProduct", response.data.newPrduct);
          context.commit("getCategories", context.state.productList);
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
    async soldOutProduct(context, payload) {
      try {
        const response = await useAuthAxios().post(
          `${soldOutProduceRoute}/${payload}`
        );
        if (response.status === 200) {
          context.commit("updataNewProduct", response.data.product);
          return response.data.success;
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
    async deleteProduct(context, payload) {
      try {
        const response = await useAuthAxios().delete(
          `${deleteProductRoute}/${payload}`
        );
        if (response.status === 200) {
          context.commit("deleteProduct", payload);
          context.commit("getCategories", context.state.productList);
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
    async updateProductImage(context, payload) {
      const { _id } = payload;
      let formData = new FormData();
      formData.append("file", payload.img);
      try {
        const response = await useAuthAxios().post(
          `${updateProductImageRoute}/${_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          const { product } = response.data;
          context.commit("updataNewProduct", product);
          return product.imgs;
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },

    async deleteProductImg(context, payload) {
      const { url, _id } = payload;
      try {
        const response = await useAuthAxios().post(
          `${deleteProductImgRoute}/${_id}`,
          {
            url: url,
          }
        );
        if (response.status === 200) {
          const { product } = response.data;
          context.commit("updataNewProduct", product);
          return product.imgs;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async uploadImg(context, payload) {
      let formData = new FormData();
      formData.append("file", payload);
      try {
        const response = await useAuthAxios().post(uploadImgRoute, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          const { url } = response.data;
          let tempImages = JSON.parse(localStorage.getItem("imgs")) || [];
          tempImages.unshift(url);
          localStorage.setItem("imgs", JSON.stringify(tempImages));
          context.state.uploadProductImg = tempImages;
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
    async deleteImg(context, payload) {
      try {
        const response = await useAuthAxios().post(deleteImgRoute, {
          url: payload,
        });
        if (response.status === 200) {
          let tempImages = JSON.parse(localStorage.getItem("imgs"));
          tempImages = tempImages.filter((path) => path !== payload);
          localStorage.setItem("imgs", JSON.stringify(tempImages));
          context.state.uploadProductImg = tempImages;
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
  },
};
