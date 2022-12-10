<template>
  <main class="order_item">
    <div class="model flex-row">
      <span>名稱</span>
      <span class="phone">電話</span>
      <span class="price">價格</span>
      <span>狀態</span>
      <span>管理</span>
    </div>
    <div class="orders_container scroll-box">
      <div v-if="showOrders.length > 0">
        <div
          class="order flex-row"
          :class="{ completed: order.completed }"
          v-for="order in showOrders"
          :key="order._id"
        >
          <p>{{ order.clientName }}</p>
          <p class="phone">{{ order.clientPhone }}</p>
          <p class="price">{{ order.total }}</p>
          <p v-if="order.paid"><span class="paid"></span> 已付款</p>
          <p v-else><span class="unpaid"></span> 未付款</p>
          <p class="detaile_Btn" @click="showOrderInfo(order)">詳細資訊</p>
        </div>
      </div>
      <p v-else>尚無訂單</p>
    </div>
  </main>
</template>

<script>
export default {
  props: ["showOrders"],
  emits: ["show-info"],
  setup(props, context) {
    function showOrderInfo(info) {
      context.emit("show-info", [true, info]);
    }
    return {
      showOrderInfo,
    };
  },
};
</script>

<style scoped>
main {
  color: var(--grey-200);
  width: 100%;
}
.model {
  justify-content: space-between;
  border-bottom: var(--border-1);
  color: var(--grey-200);
  font-size: var(--font-medium);
  font-weight: 600;
  padding-bottom: 0.5em;
  margin: 2em 0 1em 0;
}

.orders_container {
  max-height: 25em;
}
.completed {
  opacity: 0.5;
}
.model span,
.order p {
  width: 20%;
  word-break: break-all;
}

.order {
  justify-content: space-between;
  font-size: var(--font-small);
  gap: 0.5em;
  padding: 1.2em 0;
  border-bottom: var(--border-2);
}

.order p {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.unpaid,
.paid {
  min-width: 0.8em;
  min-height: 0.8em;
  border-radius: 50%;
}
.unpaid {
  background-color: #ec407a;
  box-shadow: 0 0 3px #ec407a;
}
.paid {
  background-color: var(--primary-3);
  box-shadow: 0 0 3px var(--primary-3);
}

.detaile_Btn {
  cursor: pointer;
}

@media screen and (max-width: 500px) {
  main {
    overflow-x: scroll;
  }
  .model {
    width: 40rem;
  }
  .orders_container {
    width: 40rem;
  }
}
</style>
