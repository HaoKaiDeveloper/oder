<template>
  <transition>
    <base-card class="block_2 block" v-if="open">
      <template #title>訂單狀態</template>

      <template #tabs>
        <p class="subtitle">
          訂單總數 <span>{{ totalOrderNum }}</span>
        </p>
      </template>

      <template #default>
        <div class="bar_container flex-column">
          <block-orders-item
            title="已完成"
            :barWidth="bar1"
            :itemNum="completedNum"
          ></block-orders-item>
          <block-orders-item
            title="未完成"
            :barWidth="bar2"
            :itemNum="unCompletedNum"
          ></block-orders-item>
          <block-orders-item
            title="付款數"
            :barWidth="bar3"
            :itemNum="paidNum"
          ></block-orders-item>
        </div>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { ref, watch } from "vue";
import BlockOrdersItem from "./Block_OrdersItem.vue";
import { numAnimation } from "../../utils/animatFunction";
export default {
  props: ["origOrderList", "open"],
  components: { BlockOrdersItem },
  setup(props) {
    const bar1 = ref(0);
    const bar2 = ref(0);
    const bar3 = ref(0);

    const totalOrderNum = ref(0);
    const unCompletedNum = ref(0);
    const completedNum = ref(0);
    const paidNum = ref(0);

    function getData(orders) {
      let ordersNum = orders.length;
      let completedSum = 0;
      let unCompletedSum = 0;
      let paidSum = 0;
      orders.forEach((o) => {
        if (o.completed) {
          completedSum++;
        }
        if (o.paid) {
          paidSum++;
        }
      });
      unCompletedSum = ordersNum - completedSum;

      let bar_1_target = `${(completedSum / ordersNum).toFixed(2) * 100}`;
      let bar_2_target = `${(unCompletedSum / ordersNum).toFixed(2) * 100}`;
      let bar_3_target = `${(paidSum / ordersNum).toFixed(2) * 100}`;

      numAnimation(bar_1_target, bar1, 2);
      numAnimation(bar_2_target, bar2, 2);
      numAnimation(bar_3_target, bar3, 2);

      totalOrderNum.value = ordersNum;
      completedNum.value = completedSum;
      unCompletedNum.value = unCompletedSum;
      paidNum.value = paidSum;
    }

    watch(props, () => {
      getData(props.origOrderList);
    });

    return {
      unCompletedNum,
      completedNum,
      paidNum,
      totalOrderNum,
      bar1,
      bar2,
      bar3,
    };
  },
};
</script>

<style scoped>
.bar_container {
  width: 100%;
  height: 70%;
  margin-top: 1.2em;
  align-items: flex-start;
  justify-content: space-between;
  font-size: var(--font-small);
}

.bar_container aside {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
}

.v-enter-from {
  transform: translateY(-4em);
  opacity: 0;
}
.v-enter-active {
  transition: all 1.5s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}
@media screen and (max-width: 1000px) {
  .v-enter-from {
    transform: translateX(-4em);
    opacity: 0;
  }
  .v-enter-active {
    transition: all 1.5s ease-out;
  }
  .v-enter-to {
    transform: translateX(0em);
    opacity: 1;
  }
}
</style>
