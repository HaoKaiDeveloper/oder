import { createWebHistory, createRouter } from "vue-router";

import AuthPage from "./pages/AuthPage.vue";
import ShopPage from "./pages/shop/ShopPage.vue";
import CheckoutPage from "./pages/shop/CheckoutPage.vue";
import DashboardLayout from "./pages/dashboard/Layout.vue";
import DashboardHome from "./pages/dashboard/Home.vue";
import DashboardProductList from "./pages/dashboard/ProductList.vue";
import DashboardOrderList from "./pages/dashboard/OrderList.vue";
import DashboardMyStoreInfo from "./pages/dashboard/MyStoreInfo.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/auth" },
    { name: "auth", path: "/auth", component: AuthPage },
    { path: "/shop/:storeId", component: ShopPage, props: true },
    { path: "/shop/checkout/:storeId", component: CheckoutPage, props: true },
    { path: "/dashboard", redirect: "/dashboard/home" },
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [
        { path: "home", component: DashboardHome, meta: { auth: true } },
        {
          path: "orderList",
          component: DashboardOrderList,
          meta: { auth: true },
        },
        {
          path: "productList",
          component: DashboardProductList,
          meta: { auth: true },
        },
        {
          path: "myStore",
          component: DashboardMyStoreInfo,
          meta: { auth: true },
        },
      ],
    },
    { path: "/:notFound(.*)", component: null },
  ],
});

function auth() {
  const auth = JSON.parse(localStorage.getItem("storeUser")) || "";
  const token = JSON.parse(localStorage.getItem("token")) || "";
  if (auth) {
    const { email } = auth;
    if (!email || !token) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.auth === true) {
    const result = await auth();
    if (result) {
      return next();
    } else {
      return next("/auth");
    }
  } else if (to.path === "/auth") {
    const result = await auth();
    if (result) {
      return next("/dashboard/home");
    } else {
      return next();
    }
  } else {
    next();
  }
});

export default router;
