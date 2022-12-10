<template>
  <transition>
    <base-card class="chart chart_1" v-if="open">
      <template #default>
        <div class="info">
          <p>類別排行</p>
          <Line :chartOptions="chartOptions" :chartData="chartData" />
        </div>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import Line from "../Chart/Line.vue";
export default {
  components: {
    Line,
  },
  props: ["open"],
  setup(props) {
    const store = useStore();
    const data = computed(() => {
      return store.getters["order/statisticData"];
    });
    const categories = computed(() => {
      return store.getters["product/categories"];
    });
    const rankSort = ref([]);
    const chartData = ref({
      labels: ["No.5", "No.4", "No.3", "No.2", "No.1"],
      datasets: [
        {
          borderColor: "rgba(224, 224, 224,0.4)",
          data: [2, 3, 6, 7, 10],
          backgroundColor: "rgba(224, 224, 224,0.4)",
          fill: true,
        },
      ],
    });
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      tension: 0.4,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: { color: "#e0e0e0" },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: { color: "#e0e0e0" },
        },
      },
    });

    function getRank(data) {
      const monthDate = new Date().toISOString().slice(0, 7);
      const { allData } = data.value;
      const tempCategory = [...categories.value].filter((c) => c !== "全部");
      const tempObj = {};
      tempCategory.forEach((key) => {
        tempObj[key] = 0;
      });

      allData.forEach((item) => {
        if (item.date === monthDate) {
          item.products.forEach((p) => {
            tempObj[p.category] += p.total;
          });
        }
      });

      return tempObj;
    }
    watch([data, categories], () => {
      const { allData, paidOrders } = data.value;
      if (allData.length > 0 || paidOrders.length > 0) {
        const tempObj = getRank(data);

        const sortArr = Object.entries(tempObj).sort((a, b) => {
          return a[1] - b[1];
        });
        rankSort.value = sortArr.slice(0, 5);

        const tempchartlabels = rankSort.value.map((c) => c[0]);
        const tempchartData = rankSort.value.map((c) => c[1]);
        chartData.value = {
          labels: tempchartlabels,
          datasets: [
            {
              borderColor: "rgba(224, 224, 224,0.4)",
              data: tempchartData,
              backgroundColor: "rgba(224, 224, 224,0.4)",
              fill: true,
            },
          ],
        };
      }
    });

    return {
      chartData,
      chartOptions,
    };
  },
};
</script>

<style scoped>
.info {
  width: 100%;
  height: 90%;
}
p {
  text-align: center;
  transform: translateY(0.5em);
  font-size: var(--font-medium);
  letter-spacing: 1px;
  color: #f5f5f5;
}
.chart_1 {
  width: 100%;
}
.chart {
  height: 100%;
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
