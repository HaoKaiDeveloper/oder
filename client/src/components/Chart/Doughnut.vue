<template>
  <Doughnut
    :chart-options="chartOptions"
    :chart-data="data"
    css-classes="chart"
  />
</template>

<script>
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
export default {
  components: {
    Doughnut,
  },
  props: ["data", "chartOptions"],
};
</script>

<style></style>
