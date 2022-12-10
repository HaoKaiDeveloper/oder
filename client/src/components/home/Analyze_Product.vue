<template>
  <transition>
    <base-card class="product-analyze" v-if="open">
      <template #title>商品類別</template>

      <template #tabs>
        <base-button
          @click="toggleOption('today')"
          :data="option"
          target="today"
          >今日</base-button
        >
        <base-button
          @click="toggleOption('month')"
          :data="option"
          target="month"
          >本月</base-button
        >
      </template>

      <template #default>
        <div class="container flex-row">
          <div class="chart_box grid-center">
            <p class="totla absolute-center">
              總計 <span>{{ total }}</span>
            </p>
            <DoughnutChart
              :chartOptions="chartOptions"
              :data="chartData"
              css-classes="chart"
            />
          </div>

          <div class="category">
            <div
              v-for="(cate, index) in rankSort"
              :key="cate[0]"
              class="flex-row"
            >
              <span :class="`cate_${index}`"></span>{{ cate[0] }}
            </div>
          </div>

          <div class="product_container">
            <div class="product_title flex-row">
              <p>排名</p>
              <p class="name">類別</p>
              <p>金額</p>
            </div>
            <div
              class="amount_product flex-row"
              v-for="(cate, index) in rankSort"
              :key="cate[0]"
            >
              <p>No.{{ index + 1 }}</p>
              <p class="name">{{ cate[0] }}</p>
              <p>{{ cate[1] }}</p>
            </div>
          </div>
        </div>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import DoughnutChart from "../Chart/Doughnut.vue";

export default {
  components: {
    DoughnutChart,
  },
  props: ["origOrderList", "open"],
  setup(props) {
    const store = useStore();
    const data = computed(() => {
      return store.getters["order/statisticData"];
    });
    const categories = computed(() => {
      return store.getters["product/categories"];
    });
    const rankSort = ref([]);
    const total = ref(0);
    const option = ref("today");

    const chartData = ref({
      datasets: [
        {
          backgroundColor: ["#ede7f6"],
          data: [0],
        },
      ],
    });
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      cutout: 0,
      elements: {
        arc: {
          borderWidth: 0,
        },
      },
    });
    if (window.innerWidth <= 1180) {
      chartOptions.value.cutout = 60;
    } else if (window.innerWidth > 1180) {
      chartOptions.value.cutout = 70;
    }

    function toggleOption(value) {
      option.value = value;
    }
    function getRank(data) {
      console.log(data.value);
      const monthDate = new Date().toISOString().slice(0, 7);
      const { products, allData, paidOrders } = data.value;
      const tempCategory = [...categories.value].filter((c) => c !== "全部");
      const tempObj = {};
      tempCategory.forEach((key) => {
        tempObj[key] = 0;
      });
      let sumTotal = 0;
      if (option.value === "today") {
        products.forEach((p) => {
          tempObj[p.category] += Number(p.total);
          sumTotal += Number(p.total);
        });
      } else {
        allData.forEach((item) => {
          if (item.date === monthDate) {
            item.products.forEach((p) => {
              tempObj[p.category] += Number(p.total);
            });
            const { cash, credit } = item.payment;
            sumTotal = Number(cash + credit);
          }
        });
      }

      total.value = sumTotal;

      return tempObj;
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1180) {
        chartOptions.value.cutout = 60;
      } else if (window.innerWidth > 1180) {
        chartOptions.value.cutout = 70;
      }
    });

    watch([data, option, categories], () => {
      const { allData, paidOrders } = data.value;
      if (allData.length > 0 || paidOrders.length > 0) {
        const tempObj = getRank(data);
        const sortArr = Object.entries(tempObj).sort((a, b) => {
          return b[1] - a[1];
        });
        rankSort.value = sortArr.slice(0, 5);
        const tempchartData = sortArr.map((c) => c[1]);
        chartData.value = {
          datasets: [
            {
              backgroundColor: [
                "#7c4dff",
                "#ffc400",
                "#ec407a",
                "#26c6da",
                "#ab47bc",
              ],
              data: tempchartData,
              borderRadius: 20,
            },
          ],
        };
      }
    });

    return {
      chartData,
      chartOptions,
      rankSort,
      total,
      toggleOption,
      option,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 90%;
  flex-wrap: wrap;
  gap: 1em;
  overflow: auto;
}

.chart_box {
  width: 100%;
  position: relative;
}

.chart {
  align-self: center;
  width: 18em;
  height: 18em;
}

.totla {
  width: 13em;
  text-align: center;
  font-size: var(--font-medium);
  color: var(--grey-100);
  word-break: break-all;
  letter-spacing: 1px;
}
.totla span {
  display: block;
  font-size: var(--font-large);
  color: var(--grey-200);
  margin-top: 0.1em;
  font-weight: 500;
}

.category {
  width: 100%;
  color: var(--grey-200);
}
.category div {
  width: 100%;
  margin-bottom: 0.2em;
  font-size: var(--font-small);
  word-break: break-all;
}

.category span {
  min-width: 0.8em;
  min-height: 0.8em;
  margin-right: 0.7rem;
  border-radius: 50%;
}

.cate_0 {
  background-color: #7c4dff;
}
.cate_1 {
  background-color: #ffc400;
}
.cate_2 {
  background-color: #ec407a;
}
.cate_3 {
  background-color: #26c6da;
}
.cate_4 {
  background-color: #ab47bc;
}

.product_container {
  flex: 1;
  width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  padding-right: 1rem;
}

.product_title,
.amount_product {
  width: 100%;
  justify-content: space-between;
  gap: 1rem;
  margin: 0.7rem 0;
  font-size: 1.4rem;
  letter-spacing: 1px;
  color: var(--grey-200);
}
.product_title .name,
.amount_product .name {
  flex: 1;
}

.amount_product {
  font-size: 1.3rem;
}
.v-enter-from {
  transform: translateX(3em);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.8s 0.5s ease-out;
}
.v-enter-to {
  transform: translateX(0em);
  opacity: 1;
}

@media screen and (max-width: 1180px) {
  .chart_box {
    width: 50%;
  }
  .chart {
    width: 15em;
    height: 15em;
  }
  .category {
    width: 45%;
  }
}
@media screen and (max-width: 1000px) {
  .chart_box {
    width: 100%;
  }
  .category {
    width: 100%;
  }
}

@media screen and (max-width: 500px) {
  .category {
    display: flex;
    flex-wrap: wrap;
  }
  .category div {
    width: 10em;
  }
}
</style>
