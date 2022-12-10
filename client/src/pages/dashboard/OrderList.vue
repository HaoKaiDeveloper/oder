<template>
  <section>
    <main class="blocks">
      <block-orders
        :origOrderList="origOrderList"
        :open="isLoading"
      ></block-orders>

      <block-payment
        :origOrderList="origOrderList"
        :open="isLoading"
      ></block-payment>

      <block-delivery
        :origOrderList="origOrderList"
        :open="isLoading"
      ></block-delivery>
    </main>

    <transition name="list">
      <filter-order @reset-filter="resetFilter" v-if="isLoading"></filter-order>
    </transition>

    <transition name="list">
      <main class="list_container" v-if="isLoading">
        <select-orders
          :numOfpages="numOfpages"
          :statisticData="statisticData"
          :origOrderList="origOrderList"
        ></select-orders>

        <order-list-item :showOrders="orderList" @show-info="toggleInfo">
        </order-list-item>

        <order-detail
          :show="showOrderInfo.show"
          :orderInfo="showOrderInfo.info"
          @close-info="toggleInfo"
        ></order-detail>

        <div v-if="numOfpages > 1">
          <pages :numOfpages="numOfpages"></pages>
        </div>
      </main>
    </transition>

    <analyze-orders
      :origOrderList="origOrderList"
      :show="isLoading"
    ></analyze-orders>

    <check-popup
      v-if="popupInfo.show"
      :info="popupInfo"
      @close-popup="closePopup"
    ></check-popup>
  </section>
</template>

<script>
import { BlockOrders } from "../../components/home/index.js";
import {
  BlockDelivery,
  BlockPayment,
  FilterOrder,
  Pages,
  SelectOrders,
  AnalyzeOrders,
  OrderListItem,
  OrderDetail,
} from "../../components/OrderList/index.js";
import CheckPopup from "../../components/ProductList/Check_Popup.vue";
import Loading from "../../components/UI/Loading.vue";
import { ref, computed, reactive } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    OrderListItem,
    OrderDetail,
    BlockOrders,
    BlockDelivery,
    BlockPayment,
    FilterOrder,
    Pages,
    SelectOrders,
    AnalyzeOrders,
    Loading,
    CheckPopup,
  },
  setup() {
    const store = useStore();
    const isLoading = ref(false);
    const reset = ref(false);
    const showOrderInfo = reactive({
      show: false,
      info: "",
    });

    getList();
    async function getList() {
      await store.dispatch("order/firstGetLise");
      isLoading.value = true;
    }

    function toggleInfo(info) {
      showOrderInfo.show = info[0];
      showOrderInfo.info = info[1];
    }

    const statisticData = computed(() => {
      return store.getters["order/statisticData"];
    });

    const origOrderList = computed(() => {
      return store.getters["order/origOrderList"];
    });
    const orderList = computed(() => {
      return store.state.order.orderList;
    });

    const numOfpages = computed(() => {
      return store.state.order.numOfpages;
    });

    function resetFilter() {
      store.commit("order/reSetFilter");
      reset.value = true;
    }

    const popupInfo = ref({
      show: false,
      title: "",
      info: "",
      funName: "",
    });
    function showPopup(info, title, funName) {
      popupInfo.value = {
        show: true,
        title: title,
        info: info,
        funName: funName,
      };
    }
    function closePopup(value) {
      popupInfo.value = {
        show: false,
        ...value,
      };
    }

    return {
      isLoading,
      orderList,
      numOfpages,
      resetFilter,
      reset,
      showOrderInfo,
      toggleInfo,
      origOrderList,
      popupInfo,
      showPopup,
      closePopup,
      statisticData,
    };
  },
};
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 16em 10em 1fr;
  gap: 2em;
  position: relative;
  overflow: hidden;
}
.detail {
  width: 0;
  height: 0;
}

.blocks {
  grid-column: 1/-1;
  grid-row: 1/2;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2em;
}

.block {
  width: 100%;
  height: 100%;
  flex: 1 1 28em;
}

.filter_container {
  grid-column: 1/4;
  grid-row: 2/3;

  background: var(--grey-0);
}

.list_container {
  grid-column: 1/4;
  grid-row: 3/4;

  background-color: var(--grey-0);
  padding: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.clearOrder {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.chart_container {
  grid-column: 4/5;
  grid-row: 2/-1;
}

.blocks-enter-from {
  transform: translateY(-4em);
  opacity: 0;
}
.blocks-enter-active {
  transition: all 1s ease-out;
}
.blocks-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

.list-enter-from {
  transform: translateY(5em);
  opacity: 0;
}
.list-enter-active {
  transition: all 1.5s ease-out;
}
.list-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

@media screen and (max-width: 1180px) {
  section {
    grid-template-rows: max-content min-content 1fr;
  }

  .blocks {
    flex-wrap: wrap;
  }

  .block {
    height: 17em;
  }

  .filter_container {
    grid-column: 1/-1;
    grid-row: 2/3;
  }
  .list_container {
    grid-column: 1/-1;
    grid-row: 3/4;
  }
  .chart_container {
    max-width: 100%;
    grid-column: 1/-1;
    grid-row: 4/5;
  }
}
@media screen and (max-width: 500px) {
  section {
    grid-template-rows: max-content min-content 1fr;
  }

  .blocks {
    flex-wrap: wrap;
  }

  .block {
    width: 100%;
    max-height: 17em;
    min-height: 15em;
  }

  .list_container {
    grid-column: 1/-1;
    grid-row: 3/4;
    padding: 1em;
  }
  .chart_container {
    max-width: 100%;
    grid-column: 1/-1;
    grid-row: 4/5;
  }
}
</style>
