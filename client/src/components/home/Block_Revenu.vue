<template>
  <transition>
    <base-card class="block_1 block" v-if="open">
      <template #title> 銷售狀態 </template>
      <template #tabs>今日</template>

      <template #default>
        <div class="num_container">
          <div class="today">
            <p>營業額</p>
            <span>{{ todayRevenue }}</span>
          </div>

          <div class="month">
            <p>本月累計</p>
            <span>{{ monthRevenue }}</span>
          </div>

          <div class="icon grid-center">
            <font-awesome-icon icon="fa-solid fa-arrow-trend-up" class="i" />
          </div>

          <div class="orders">
            <p>訂單價值</p>
            <span>{{ ordersValue }}</span>
          </div>
        </div>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";

import { numAnimation } from "../../utils/animatFunction";
export default {
  props: ["origOrderList", "open"],
  setup(props) {
    const store = useStore();
    const todayRevenue = ref(0);
    const ordersValue = ref(0);
    const monthRevenue = ref(0);
    const data = computed(() => {
      return store.getters["order/statisticData"];
    });

    function getRevenu(data, orders) {
      const dd = new Date();
      const today = dd.toISOString().slice(0, 10);
      const month = dd.toISOString().slice(0, 7);
      let todaySum = 0;
      let monthSum = 0;
      let ordersSum = 0;

      const { allData, paidOrders } = data;
      paidOrders.forEach((o) => {
        const paidTime = new Date(o.paidTime).toISOString().slice(0, 10);
        if (paidTime === today) {
          todaySum += Number(o.total);
        }
      });
      allData.forEach((d) => {
        if (d.date === month) {
          monthSum += Number(d.payment.credit + d.payment.cash);
        }
      });
      orders.forEach((o) => {
        ordersSum += Number(o.total);
      });

      let range = Math.ceil(todaySum / 50);

      numAnimation(todaySum, todayRevenue, range);

      monthRevenue.value = monthSum;
      ordersValue.value = ordersSum;
    }

    watch([data, props], () => {
      getRevenu(data.value, props.origOrderList);
    });

    return {
      todayRevenue,
      ordersValue,
      monthRevenue,
    };
  },
};
</script>

<style scoped>
.num_container {
  width: 100%;
  height: 90%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: max-content 1fr;
  margin-top: 1.2em;
  color: var(--grey-200);
}
.num_container p {
  font-size: var(--font-small);
  margin-bottom: 0.3em;
  color: var(--grey-100);
}
.num_container span {
  font-size: var(--font-medium);
  letter-spacing: 1px;
}
.today span {
  font-size: var(--font-xlarge);
  font-weight: 500;
}
.today {
  grid-column: 1/2;
  grid-row: 1/-1;
}
.month {
  grid-column: 1/2;
  grid-row: 2/3;
}
.icon {
  grid-column: 2/3;
  grid-row: 1/2;
  justify-self: end;
  width: 4em;
  height: 4em;
}
.i {
  font-size: 3rem;
  color: var(--primary-3);
}

.orders {
  grid-column: 2/3;
  grid-row: 2/3;
  justify-self: end;
}

.v-enter-from {
  transform: translateY(-2em);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

@media screen and (max-width: 1000px) {
  .v-enter-from {
    transform: translateX(-2em);
    opacity: 0;
  }
  .v-enter-active {
    transition: all 0.5s ease-out;
  }
  .v-enter-to {
    transform: translateX(0em);
    opacity: 1;
  }
}
</style>
