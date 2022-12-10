<template>
  <transition>
    <base-card class="block_3 block" v-if="open">
      <template #title> 付款狀態 </template>
      <template #tabs>今日</template>

      <template #default>
        <div class="info flex-row">
          <PieChart :data="chartData" />

          <div class="text">
            <div class="cash">
              <div class="cash_color color"></div>
              <p>現金</p>
              <span>{{ cashNum }}</span>
            </div>

            <div class="credit">
              <div class="credit_color color"></div>
              <p>信用卡</p>
              <span>{{ creditNum }}</span>
            </div>
          </div>
        </div>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import PieChart from "../Chart/Pie.vue";

export default {
  components: { PieChart },
  props: ["open"],
  setup(props) {
    const store = useStore();
    const data = computed(() => {
      return store.getters["order/statisticData"];
    });
    const chartData = ref({
      datasets: [
        {
          backgroundColor: ["#7c4dff"],
          data: [1],
        },
      ],
    });

    const cashNum = ref(0);
    const creditNum = ref(0);

    function getData(data) {
      cashNum.value = 0;
      creditNum.value = 0;
      const { paidOrders } = data;
      paidOrders.forEach((o) => {
        if (o.payment === "cash") {
          cashNum.value += Number(o.total);
        } else {
          creditNum.value += Number(o.total);
        }
      });
      chartData.value = {
        datasets: [
          {
            backgroundColor: ["#ffc400", "#7c4dff"],
            data: [cashNum.value, creditNum.value],
          },
        ],
      };
      if (cashNum.value === 0 && creditNum.value === 0) {
        chartData.value = {
          datasets: [
            {
              backgroundColor: ["#7c4dff"],
              data: [1],
            },
          ],
        };
      }
    }

    watch(data, () => {
      getData(data.value);
    });
    return {
      cashNum,
      creditNum,
      chartData,
    };
  },
};
</script>

<style scoped>
.info {
  width: 100%;
  height: 90%;
  gap: 2em;
  font-size: var(--font-small);
  color: var(--grey-200);
}
.info p {
  font-size: var(--font-small);
  font-weight: 500;
  letter-spacing: 1px;
  color: var(--grey-100);
}

.chart {
  width: 9em;
  height: 9em;
  transform: translateY(-0.4em);
}

.text {
  flex: 1;
  word-break: break-all;
}
.text .color {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background-color: #ffc400;
  margin-right: 0.5em;
}
.text .credit_color {
  background-color: #7c4dff;
}

.cash,
.credit {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  word-break: break-all;
}
.cash span,
.credit span {
  width: 100%;
  font-size: var(--font-large);
}
.v-enter-from {
  transform: translateY(-3em);
  opacity: 0;
}
.v-enter-active {
  transition: all 1s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

@media screen and (max-width: 1000px) {
  .v-enter-from {
    transform: translateX(-3em);
    opacity: 0;
  }
  .v-enter-active {
    transition: all 1s ease-out;
  }
  .v-enter-to {
    transform: translateX(0em);
    opacity: 1;
  }
}

@media screen and (max-width: 500px) {
  .text {
    text-align: end;
  }
  .cash,
  .credit {
    justify-content: flex-end;
  }
}
</style>
