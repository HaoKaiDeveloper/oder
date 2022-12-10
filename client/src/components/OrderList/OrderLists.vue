<template>
  <transition>
    <base-card class="order_list" table="table" v-if="open">
      <template #title> 所有訂單 </template>
      <template #tabs>
        <base-button @click="setFilter('all')" :data="filter" target="all"
          >全部</base-button
        >
        <base-button @click="setFilter(false)" :data="filter" :target="false"
          >未完成</base-button
        >
        <base-button @click="setFilter(true)" :data="filter" :target="true"
          >已完成</base-button
        >
      </template>
      <template #default>
        <order-list-item
          @show-info="showOrderInfo"
          :showOrders="showOrders"
        ></order-list-item>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { ref, watch } from "vue";
import OrderListItem from "./OrderListItem.vue";
export default {
  components: { OrderListItem },
  props: ["orderList", "open"],
  emits: ["show-info"],
  setup(props, context) {
    const filter = ref("all");
    const showOrders = ref(props.orderList);
    function setFilter(value) {
      filter.value = value;
    }

    function getOrders(filterValue) {
      let tempOrder;
      if (filterValue === true || filterValue === false) {
        tempOrder = props.orderList.filter((o) => o.completed === filterValue);
      } else {
        tempOrder = props.orderList;
      }
      showOrders.value = tempOrder;
    }

    function showOrderInfo(info) {
      context.emit("show-info", info);
    }

    watch([props, filter], () => {
      getOrders(filter.value);
    });

    return {
      setFilter,
      showOrders,
      filter,
      showOrderInfo,
    };
  },
};
</script>

<style scoped>
.v-enter-from {
  transform: translateY(3em);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s 1s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}
@media screen and (max-width: 500px) {
  main {
    overflow-x: scroll;
  }
}
</style>
