<template>
  <Bar :chart-options="chartOptions" :chart-data="data" css-classes="chart" />
</template>

<script>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
export default {
  components: {
    Bar,
  },
  props: ["chartData"],
  setup(props) {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      maxBarThickness: 20,
      scales: {
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#8b8b8b",
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#8b8b8b",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    const data = computed(() => {
      if (!props.chartData.hasOwnProperty("labels")) {
        return {
          labels: ["一月", "二月", "三月", "四月", "五月", "六月"],
          datasets: [
            {
              backgroundColor: "#b388ff",
              data: [40, 20, 12, 39, 10, 40],
              barThickness: 15,
              borderRadius: 20,
            },
          ],
        };
      } else {
        return props.chartData;
      }
    });

    return {
      chartOptions,
      data,
    };
  },
};
</script>

<style></style>
