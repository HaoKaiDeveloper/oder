import { createStore } from "vuex";

import userModule from "./userStore.js";
import productModule from "./productStore.js";
import orderModule from "./orderStore.js";
const stroe = createStore({
  modules: {
    storeUser: userModule,
    product: productModule,
    order: orderModule,
  },
  state() {
    return {};
  },
  mutations: {},
  getters: {},
  actions: {},
});

export default stroe;
