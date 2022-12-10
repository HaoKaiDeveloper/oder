<template>
  <Pie :chart-options="chartOptions" :chart-data="data" css-classes="chart" />
</template>

<script>
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  Plugin,
} from "chart.js";
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
export default {
  components: {
    Pie,
  },
  props: ["data"],
  setup() {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        arc: {
          borderWidth: 0,
        },
      },
    };

    return {
      chartOptions,
    };
  },
};
</script>

<style></style>
