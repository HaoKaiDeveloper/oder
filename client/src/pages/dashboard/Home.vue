<template>
  <section>
    <main class="blocks">
      <block-revenu
        :origOrderList="origOrderList"
        :open="isLoading"
      ></block-revenu>

      <block-payment
        :open="isLoading"
        :origOrderList="origOrderList"
      ></block-payment>

      <block-orders
        :origOrderList="origOrderList"
        :open="isLoading"
      ></block-orders>
    </main>

    <analyze-product :open="isLoading"></analyze-product>

    <order-list
      :orderList="origOrderList"
      @show-info="toggleInfo"
      :open="isLoading"
    ></order-list>

    <order-detail
      :show="showOrderInfo.show"
      :orderInfo="showOrderInfo.info"
      @close-info="toggleInfo"
    ></order-detail>

    <analyze-sales
      :origOrderList="origOrderList"
      :open="isLoading"
    ></analyze-sales>

    <product-list
      :productList="origProductList"
      :open="isLoading"
    ></product-list>
  </section>
</template>

<script>
import { reactive, computed, ref } from "vue";
import { useStore } from "vuex";
import {
  AnalyzeProduct,
  AnalyzeSales,
  BlockOrders,
  BlockRevenu,
  BlockPayment,
} from "../../components/home/index.js";
import {
  OrderList,
  OrderListItem,
  OrderDetail,
} from "../../components/OrderList/index.js";
import { ProductList } from "../../components/ProductList/index.js";

export default {
  components: {
    BlockRevenu,
    BlockOrders,
    BlockPayment,
    AnalyzeSales,
    AnalyzeProduct,
    OrderList,
    OrderDetail,
    OrderListItem,
    ProductList,
  },
  setup() {
    const store = useStore();
    const storeId = store.getters["storeUser/storeId"];
    const showOrderInfo = reactive({
      show: false,
      info: "",
    });
    const isLoading = ref(false);
    const origOrderList = computed(() => {
      return store.getters["order/origOrderList"];
    });
    const origProductList = computed(() => {
      return store.getters["product/origProductList"];
    });
    getData();
    async function getData() {
      await Promise.all([
        store.dispatch("order/firstGetLise"),
        store.dispatch("product/firstGetList", storeId),
      ]);
      isLoading.value = true;
    }

    function toggleInfo(info) {
      showOrderInfo.show = info[0];
      showOrderInfo.info = info[1];
    }

    function closeInfo() {
      showOrderInfo.show = false;
      showOrderInfo.info = {};
    }

    return {
      origOrderList,
      origProductList,
      showOrderInfo,
      toggleInfo,
      closeInfo,
      isLoading,
    };
  },
};
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 16rem 37rem minmax(37rem, 1fr);
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  overflow: hidden;
}
.detail {
  width: 0;
  height: 0;
}

.blocks {
  grid-column: 1/4;
  grid-row: 1/2;
  display: flex;
  justify-content: space-between;
  gap: 2em;
}

.product-analyze {
  grid-column: 4/5;
  grid-row: 1/3;
}

.overview {
  grid-column: 1/4;
  grid-row: 2/3;
}

.order_list {
  grid-column: 1/3;
  grid-row: 3/4;
}

.product_list {
  grid-column: 3/-1;
  grid-row: 3/4;
}

.detail-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
.detail-enter-active {
  transition: all 2s ease;
}
.detail-enter-to,
.detail-leave-from {
  transform: translateY(0em);
  opacity: 1;
}

.detail-leave-active {
  transition: all 2s ease;
}
.detail-leave-to {
  transform: translateY(-2em);
  opacity: 0;
}

@media screen and (max-width: 1180px) {
  .blocks {
    grid-column: 1/-1;
    grid-row: 1/2;
  }

  .product-analyze {
    grid-column: 3/-1;
    grid-row: 2/3;
  }

  .overview {
    grid-column: 1/3;
    grid-row: 2/3;
  }

  .order_list {
    grid-column: 1/3;
    grid-row: 3/4;
  }

  .product_list {
    grid-column: 3/-1;
    grid-row: 3/4;
  }
}
@media screen and (max-width: 1000px) {
  section {
    grid-template-rows:
      min-content min-content max-content
      max-content;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5em;
  }
  .blocks {
    grid-column: 1/3;
    grid-row: 1/2;
    flex-direction: column;
    justify-content: space-between;
    gap: 1em;
  }

  .block {
    max-height: 17em;
    min-height: 15em;
  }

  .product-analyze {
    grid-column: 3/-1;
    grid-row: 1/2;
  }

  .overview {
    grid-column: 1/-1;
    grid-row: 2/3;
  }

  .order_list {
    grid-column: 1/-1;
    grid-row: 3/4;
  }

  .product_list {
    grid-column: 1/-1;
    grid-row: 4/5;
  }
}
@media screen and (max-width: 500px) {
  section {
    grid-template-rows: repeat(auto-fit, 1fr);
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .blocks {
    grid-column: 1/-1;
    grid-row: 1/2;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
  }
  .product-analyze {
    grid-column: 1/-1;
    grid-row: 2/3;
  }

  .overview {
    grid-column: 1/-1;
    grid-row: 3/4;
  }

  .order_list {
    grid-column: 1/-1;
    grid-row: 4/5;
  }

  .product_list {
    grid-column: 1/-1;
    grid-row: 5/6;
  }
}
</style>
