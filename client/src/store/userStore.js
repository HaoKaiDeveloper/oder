import {
  authRoute,
  getStoreDataRoute,
  updataStoreInfo,
  uploadHeaderImgRoute,
} from "../utils/RouteApi";
import axios from "axios";
import useAuthAxios from "../utils/useAuthAxios";

export default {
  namespaced: true,
  state() {
    return {
      storeId: "",
      storeName: "",
      storeEmail: "",
      storeToken: "",
      storeaddress: "",
      storePhone: "",
      storeHeaderImg: "",
    };
  },
  mutations: {
    setBasicData(state) {
      if (localStorage.getItem("storeUser")) {
        const { _id, storeName, email, headerImg, phoneNumber, address } =
          JSON.parse(localStorage.getItem("storeUser"));
        const token = JSON.parse(localStorage.getItem("token"));
        state.storeId = _id;
        state.storeName = storeName;
        state.storeEmail = email;
        state.storeToken = token;
        state.storeaddress = address || "";
        state.storePhone = phoneNumber || "";
        state.storeHeaderImg = headerImg || "";
      }
    },
    logout(state) {
      for (const value in state) {
        state[value] = "";
      }
      localStorage.clear();
    },
  },
  getters: {
    storeId(state) {
      return state.storeId;
    },
    storeHeaderImg(state) {
      return state.storeHeaderImg;
    },
    storeName(state) {
      return state.storeName;
    },
  },
  actions: {
    async auth(context, payload) {
      const { action } = payload;
      let url;
      if (action === "login") {
        url = `${authRoute}/login`;
      } else {
        url = `${authRoute}/register`;
      }
      try {
        const response = await axios.post(url, payload);
        const { token, user } = response.data;
        if (response.status === 200) {
          const { storeName, email, _id } = user;
          context.state.storeId = _id;
          context.state.storeName = storeName;
          context.state.storeEmail = email;
          context.state.storeToken = token;

          if (action === "login") {
            const { headerImg, phoneNumber, address } = user;
            context.state.storeaddress = address;
            context.state.storePhone = phoneNumber;
            context.state.storeHeaderImg = headerImg;
          }
          localStorage.setItem("storeUser", JSON.stringify(user));
          localStorage.setItem("token", JSON.stringify(token));
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
    async getStoreData(context, payload) {
      try {
        const response = await axios.get(`${getStoreDataRoute}/${payload}`);
        if (response.status === 200) {
          return response.data.user;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async uploadHeaderImg(context, payload) {
      let formData = new FormData();
      formData.append("file", payload);
      try {
        const response = await useAuthAxios().post(
          uploadHeaderImgRoute,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          const { store } = response.data;
          localStorage.setItem("storeUser", JSON.stringify(store));
          context.commit("setBasicData");
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },

    async updateStoreInfo(context, payload) {
      try {
        const response = await useAuthAxios().patch(updataStoreInfo, payload);
        if (response.status === 200) {
          const { newStore } = response.data;
          localStorage.setItem("storeUser", JSON.stringify(newStore));
          context.commit("setBasicData");
          return response.data;
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
  },
};
