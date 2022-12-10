import {
  getOrderListRoute,
  createOrderRoute,
  paidOrderRoute,
  completedOrderRoute,
  deleteOrderRoute,
  firstGetLiseRoute,
  postingOrderRoute,
} from "../utils/RouteApi";
import axios from "axios";
import useAuthAxios from "../utils/useAuthAxios";

export default {
  namespaced: true,
  state() {
    return {
      origOrderList: [],
      orderList: [],
      numOfpages: 1,
      totalOrder: 0,
      filter: {
        search: "",
        limit: 5,
        page: 1,
        paid: null,
        completed: "all",
        delivery: [],
      },
      statisticData: {
        allData: [],
        city: [],
        products: [],
        paidOrders: [],
      },
    };
  },
  mutations: {
    deleteOrder(state, payload) {
      state.orderList = state.orderList.filter((p) => p._id !== payload);
      state.origOrderList = state.origOrderList.filter(
        (p) => p._id !== payload
      );
    },
    addNewOrder(state, payload) {
      state.origOrderList = [payload, ...state.origOrderList];
    },
    setFilter(state, payload) {
      const tempFilter = { ...state.filter, ...payload };
      tempFilter.page = 1;
      state.filter = tempFilter;
    },
    setPage(state, payload) {
      state.filter.page = payload;
    },
    reSetFilter(state) {
      state.filter = {
        search: "",
        limit: 5,
        page: 1,
        paid: null,
        completed: "all",
        delivery: [],
      };
    },
    updateOrder(state, payload) {
      state.origOrderList = state.origOrderList.map((o) => {
        if (o._id === payload._id) {
          return (o = payload);
        } else {
          return o;
        }
      });
      state.orderList = state.orderList.map((o) => {
        if (o._id === payload._id) {
          return (o = payload);
        } else {
          return o;
        }
      });
    },
  },
  getters: {
    orderList(state) {
      return state.orderList;
    },
    origOrderList(state) {
      return state.origOrderList;
    },
    numOfpages(state) {
      return state.numOfpages;
    },
    filterPage(state) {
      return state.filter.page;
    },
    statisticData(state) {
      return state.statisticData;
    },
  },
  actions: {
    async createNewOrder(context, payload) {
      try {
        const response = await axios.post(createOrderRoute, payload);
        if (response.status === 200) {
          const { order } = response.data;
          return order;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getOrderList(context, payload) {
      const { search, completed, paid, delivery, limit, page } =
        context.state.filter;
      let url = `${getOrderListRoute}?completed=${completed}&paid=${paid}&limit=${limit}&page=${page}`;
      if (delivery.length > 0) {
        url = `${url}&delivery=${delivery[0]}`;
      }
      if (search) {
        url = `${url}&search=${search}`;
      }

      try {
        const response = await useAuthAxios().get(url);
        if (response.status === 200) {
          const { orderList, numOfPages, totalOrder } = response.data;
          context.state.orderList = orderList;
          context.state.numOfpages = numOfPages;
          context.state.totalOrder = totalOrder;
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
    async firstGetLise(context) {
      try {
        const response = await useAuthAxios().get(firstGetLiseRoute);
        if (response.status === 200) {
          const {
            origOrderList,
            orderList,
            numOfPages,
            totalOrder,
            statisticData,
          } = response.data;
          context.state.statisticData = statisticData;
          context.state.origOrderList = origOrderList;
          context.state.orderList = orderList;
          context.state.numOfpages = numOfPages;
          context.state.totalOrder = totalOrder;
        } else {
          throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
        }
      } catch (err) {
        throw new Error(err.response.data.msg || "錯誤! 請稍後再試");
      }
    },
    async completeOrder(context, payload) {
      try {
        const response = await useAuthAxios().post(completedOrderRoute, {
          orderId: payload,
        });
        if (response.status === 200) {
          const { order, statisticData } = response.data;
          context.state.statisticData = statisticData;
          context.commit("updateOrder", order);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async postingOrder(context) {
      try {
        await useAuthAxios().get(postingOrderRoute);
      } catch (err) {
        console.log(err);
      }
    },
    async paidOrder(context, payload) {
      try {
        const response = await useAuthAxios().post(paidOrderRoute, {
          orderId: payload,
        });
        if (response.status == 200) {
          const { order, statisticData } = response.data;
          context.commit("updateOrder", order);
          context.state.statisticData = statisticData;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteOrder(context, payload) {
      try {
        const response = await useAuthAxios().delete(
          `${deleteOrderRoute}/${payload}`
        );
        if (response.status === 200) {
          const { statisticData } = response.data;
          context.state.statisticData = statisticData;
          context.commit("deleteOrder", payload);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
