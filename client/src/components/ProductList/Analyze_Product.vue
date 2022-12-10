<template>
  <transition>
    <base-card class="chart chart_2" v-if="open">
      <template #title>商品統計</template>

      <template #tabs>
        <select v-model="optionMonth">
          <option v-for="m in optionMonthArr" :value="m" :key="m">
            {{ m }} 月
          </option>
        </select></template
      >
      <template #default>
        <div class="options flex-row">
          <span
            @click="toggleOption('sales')"
            :class="{ active: options === 'sales' }"
            >銷售額 /
          </span>
          <span
            @click="toggleOption('quantity')"
            :class="{ active: options !== 'sales' }"
          >
            銷售量</span
          >
        </div>

        <BarChart :chart-data="chartData" />
      </template>
    </base-card>
  </transition>
</template>

<script>
import { watch, computed, ref } from "vue";
import { useStore } from "vuex";
import BarChart from "../Chart/Bar.vue";

export default {
  components: {
    BarChart,
  },
  props: ["origOrderList", "open"],
  setup(props) {
    const store = useStore();
    const data = computed(() => {
      return store.getters["order/statisticData"];
    });
    const nowMonth = new Date().getMonth() + 1;
    const options = ref("sales");
    const optionMonth = ref(nowMonth);
    const optionMonthArr = ref([1, 2, 3, 4, 5, 6]);
    const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const chartData = ref({});

    function toggleOption(value) {
      options.value = value;
    }

    function getData(list) {
      const { allData } = list;
      const dataMontbArr = [];
      let result;
      let dataArr;
      allData.forEach((p) => {
        const dataMonth = Number(p.date.slice(-2));
        const m = Number(dataMonth - 1);
        dataMontbArr.push(monthArr[m]);
        if (optionMonth.value === dataMonth) {
          result = p.products;
        }
      });

      optionMonthArr.value = dataMontbArr.sort((a, b) => b - a);

      if (options.value === "sales") {
        result.sort((a, b) => {
          return b.total - a.total;
        });
        dataArr = result.map((p) => p.total);
      } else {
        result.sort((a, b) => {
          return b.amount - a.amount;
        });
        dataArr = result.map((p) => p.amount);
      }
      const chartLabels = result.map((p) => p.productName);

      chartData.value = {
        labels: chartLabels,
        datasets: [
          {
            backgroundColor: "#b388ff",
            data: dataArr,
            barThickness: 15,
            borderRadius: 20,
          },
        ],
      };
    }

    watch([data, options, optionMonth], () => {
      if (data.value.allData.length > 0) {
        getData(data.value);
      }
    });

    return {
      options,
      chartData,
      optionMonth,
      optionMonthArr,
      toggleOption,
    };
  },
};
</script>

<style scoped>
.chart_2 {
  width: 100%;
}

.chart {
  width: 100%;
}
.options {
  width: 100%;
  justify-content: center;
  transform: translateY(1em);
}
select {
  outline: none;
}

span {
  font-size: var(--font-medium);
  font-weight: 600;
  cursor: pointer;
  color: var(--grey-100);
}
span.active {
  color: var(--primary-3);
}
.v-enter-from {
  transform: translateY(5em);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

@media screen and (max-width: 1100px) {
  .chart {
    width: 100%;
  }
}
</style>
