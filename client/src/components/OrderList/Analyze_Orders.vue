<template>
  <transition>
    <base-card class="chart_container flex-column" v-if="show">
      <template #title>訂單統計</template>
      <template #tabs>
        <base-button
          class="salesFigures"
          @click="toggleTabs('sales')"
          :data="options"
          target="sales"
          >銷售額</base-button
        >
        <base-button
          class="quantity"
          @click="toggleTabs('quantity')"
          target="quantity"
          :data="options"
          >銷售量</base-button
        >
      </template>
      <BarChart :chartData="salesData" />
    </base-card>
  </transition>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import BarChart from "../Chart/Bar.vue";

export default {
  components: {
    BarChart,
  },
  props: ["origOrderList", "show"],
  setup(props) {
    const store = useStore();
    const data = computed(() => {
      return store.getters["order/statisticData"];
    });
    //  orders
    const options = ref("sales");
    const totalSales = ref([]);
    const totalOrders = ref([]);
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

    function toggleTabs(value) {
      options.value = value;
    }

    const salesData = ref({});

    function getData(list) {
      totalSales.value = [];
      totalOrders.value = [];
      const dataMonthArr = [];
      let result = [];
      if (options.value === "sales") {
        list.forEach((o) => {
          const { cash, credit } = o.payment;
          const month = Number(o.date.slice(-2)) - 1;
          dataMonthArr.push(monthArr[month]);
          totalSales.value.push(Number(cash + credit));
        });
        result = totalSales.value;
        totalOrders.value = [];
      } else {
        list.forEach((o) => {
          const month = Number(o.date.slice(-2)) - 1;
          dataMonthArr.push(monthArr[month]);
          totalOrders.value.push(Number(o.orderNum));
        });
        result = totalOrders.value;
        totalSales.value = [];
      }

      salesData.value = {
        labels: dataMonthArr,
        datasets: [
          {
            backgroundColor: "#b388ff",
            data: result,
            barThickness: 15,
            borderRadius: 20,
          },
        ],
      };
    }

    watch([data, options, props], () => {
      if (data.value.allData.length > 0) {
        getData(data.value.allData);
      }
    });

    return { salesData, options, toggleTabs };
  },
};
</script>

<style scoped>
main {
  width: 100%;
  max-width: 25vw;
  align-items: flex-start;
}

.chart {
  width: 100%;
  height: 100%;
}

.v-enter-from {
  transform: translateY(5em);
  opacity: 0;
}
.v-enter-active {
  transition: all 1.5s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}
</style>
