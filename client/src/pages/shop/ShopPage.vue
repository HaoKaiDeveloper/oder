<template>
  <transition>
    <section class="shopPage_container" v-if="isLoading">
      <section class="store_Info" v-if="storeInfo._id">
        <shop-info :storeInfo="storeInfo"></shop-info>
      </section>

      <Filter :categories="categories" @select-option="selectOption"></Filter>

      <section class="product_list" v-if="productList.length > 0">
        <!-- 所有產品 -->
        <product-list
          :productList="productList"
          @add_to_cart="addTocard"
          @show-product-info="showProductInfo"
        ></product-list>
      </section>

      <!-- 詳細資訊 -->

      <product-info
        :show="showInfo"
        :info="porductInfo"
        @close-info="closeInfo"
        @add_to_cart="addTocard"
      ></product-info>

      <cart-nav
        :cart="cart"
        :total="total"
        :storeId="storeId"
        @delete-cart-item="deleteCartItem"
        @change-amount="changeAmount"
      ></cart-nav>
    </section>
  </transition>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  ProductList,
  ProductInfo,
  ShopInfo,
  CartNav,
  Filter,
} from "../../components/Shop/index.js";
export default {
  components: {
    ProductList,
    ShopInfo,
    CartNav,
    Filter,
    ProductInfo,
  },
  props: ["storeId"],
  setup() {
    const route = useRoute();
    const store = useStore();
    const storeId = route.params.storeId;
    const storeInfo = ref({});
    const productList = ref([]);
    const cart = ref([]);
    const total = ref(0);
    const showInfo = ref(false);
    const porductInfo = ref({});
    const isLoading = ref(false);

    const categories = computed(() => {
      return store.getters["product/categories"];
    });

    async function getList() {
      const [info, _] = await Promise.all([
        store.dispatch("storeUser/getStoreData", storeId),
        store.dispatch("product/firstGetList", storeId),
      ]);
      storeInfo.value = info;
      productList.value = store.getters["product/productList"];
      const localCard = localStorage.getItem("cart");
      if (localCard) {
        cart.value = JSON.parse(localCard);
        countTotal(cart.value);
      }
      isLoading.value = true;
      document.title = info.storeName;
    }
    getList();

    function selectOption(value) {
      const OrigArr = store.getters["product/productList"];
      if (value == "全部") return (productList.value = OrigArr);
      productList.value = OrigArr.filter((p) => p.category === value);
    }

    function showProductInfo(id) {
      const p = productList.value.find((p) => p._id === id);
      showInfo.value = true;
      porductInfo.value = p;
    }

    function closeInfo() {
      showInfo.value = false;
      porductInfo.value = {};
    }

    function addTocard(id) {
      let product = productList.value.find((p) => p._id === id);
      const cartProduct = cart.value.find((p) => p._id === id);
      if (cartProduct) {
        return;
      } else {
        product.amount = 1;
        cart.value.unshift(product);
        localStorage.setItem("cart", JSON.stringify(cart.value));
        countTotal(cart.value);
      }
    }
    function changeAmount(data) {
      const { id, methods } = data;
      let tempCart = JSON.parse(localStorage.getItem("cart"));

      let product = tempCart.find((p) => p._id === id);
      const index = tempCart.indexOf(product);
      tempCart[index] = product;
      if (methods === "plus") {
        product.amount++;
      }
      if (methods === "minus") {
        if (product.amount <= 1) return;
        product.amount--;
      }
      localStorage.setItem("cart", JSON.stringify(tempCart));
      countTotal(tempCart);
      cart.value = tempCart;
    }

    function deleteCartItem(id) {
      cart.value = cart.value.filter((p) => p._id !== id);
      localStorage.setItem("cart", JSON.stringify(cart.value));
      countTotal(cart.value);
    }

    function countTotal(list) {
      const count = list.reduce((acc, prev) => {
        return (acc += prev.amount * prev.price);
      }, 0);
      total.value = count;
    }

    return {
      cart,
      addTocard,
      productList,
      categories,
      deleteCartItem,
      countTotal,
      total,
      storeInfo,
      changeAmount,
      storeId,
      selectOption,
      showProductInfo,
      porductInfo,
      showInfo,
      closeInfo,
      isLoading,
    };
  },
};
</script>

<style scoped>
.shopPage_container {
  width: 100%;
  min-height: 100vh;
  max-width: 2000px;
  margin: 0 auto;
  padding: 3em 5em;
  display: flex;
  flex-direction: column;
  gap: 2em;
  position: relative;
  overflow: hidden;
}

.v-enter-active {
  animation: page 0.8s ease;
}

@keyframes page {
  from {
    transform: translateY(5em);
    opacity: 0;
  }
  to {
    transform: translateY(0em);
    opacity: 1;
  }
}
@media screen and (max-width: 680px) {
  .shopPage_container {
    padding: 3em 2em;
  }
}
@media screen and (max-width: 570px) {
  .shopPage_container {
    padding: 2em 0em;
    gap: 1em;
  }
}
</style>
