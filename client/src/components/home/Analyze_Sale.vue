<template>
  <transition>
    <base-card class="overview" v-if="open">
      <template #title>銷售分析</template>

      <template #tabs>
        <base-button
          @click="toggleOption('sales')"
          target="sales"
          :data="option"
          >銷售額</base-button
        >
        <base-button
          @click="toggleOption('volume')"
          target="volume"
          :data="option"
          >銷售量</base-button
        >
        <label for="accOption"
          >累計
          <input
            type="checkbox"
            id="accOption"
            :value="false"
            v-model="accOption"
          />
        </label>
      </template>

      <template #default>
        <div class="chart_box" v-if="showChart">
          <Line :chartData="chartData" css-classes="chart" :chartOptions="{}" />
        </div>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { watch, ref, computed } from "vue";
import { useStore } from "vuex";
import Line from "../Chart/Line.vue";

export default {
  components: {
    Line,
  },
  props: ["origOrderList", "open"],
  setup(props) {
    const store = useStore();
    const data = computed(() => {
      return store.getters["order/statisticData"];
    });
    const showChart = ref(false);
    const option = ref("sales");
    const accOption = ref(false);
    const monthArr = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];

    const chartData = ref({});

    function toggleOption(value) {
      option.value = value;
    }

    function getChartData(data) {
      const dataMonthArr = [];
      const revenuArr = [];
      const orderNumArr = [];
      const revenuAccArr = [];
      const orderNumAccArr = [];

      let chartValue;

      data.forEach((d) => {
        const { cash, credit } = d.payment;
        const month = Number(d.date.slice(-2)) - 1;
        dataMonthArr.push(monthArr[month]);
        revenuArr.push(Number(cash + credit));
        orderNumArr.push(d.orderNum);
      });

      if (option.value === "sales") {
        let result = revenuArr;
        if (accOption.value) {
          let sum = 0;
          revenuArr.forEach((re) => {
            sum += re;
            revenuAccArr.push(sum);
          });
          result = revenuAccArr;
        }
        chartValue = {
          labels: dataMonthArr,
          datasets: [
            {
              borderColor: "#7c4dff",
              data: result,
              backgroundColor: "rgba(124, 77, 255,0.1)",
              borderWidth: 1.5,
              fill: true,
            },
          ],
        };
      } else {
        let result = orderNumArr;
        if (accOption.value) {
          let sum = 0;
          orderNumArr.forEach((or) => {
            sum += or;
            orderNumAccArr.push(sum);
          });
          result = orderNumAccArr;
        }
        chartValue = {
          labels: dataMonthArr,
          datasets: [
            {
              borderColor: "#ff9f40",
              data: result,
              backgroundColor: "rgba(255, 159, 64, 0.1)",
              borderWidth: 1.5,
              fill: true,
            },
          ],
        };
      }

      chartData.value = chartValue;
      showChart.value = true;
    }

    watch([props, data, option, accOption], () => {
      const { allData } = data.value;
      if (allData.length > 0) {
        getChartData(allData);
      }
    });
    return {
      chartData,
      toggleOption,
      accOption,
      option,
      showChart,
    };
  },
};
</script>

<style scoped>
.chart_box {
  margin-top: 1em;
  width: 100%;
  height: 90%;
}

.chart {
  width: 100%;
  height: 100%;
}
.v-enter-from {
  transform: translateY(4em);
  opacity: 0;
}
.v-enter-active {
  transition: all 1.5s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}
@media screen and (max-width: 500px) {
  .chart_box {
    margin-top: 2em;
    width: 95%;
    max-height: 20em;
    margin: 0 auto;
  }
}
</style>
