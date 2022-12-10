<template>
  <Line :chart-options="options" :chart-data="data" css-classes="chart" />
</template>

<script>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Plugin,
  Filler,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
);
export default {
  components: {
    Line,
  },
  props: ["chartData", "chartOptions"],
  setup(props) {
    const options = computed(() => {
      if (!props.chartOptions.hasOwnProperty("responsive")) {
        return {
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
              ticks: {
                color: "#8b8b8b",
              },
            },
            y: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#8b8b8b",
              },
            },
          },
        };
      } else {
        return props.chartOptions;
      }
    });
    const data = computed(() => {
      if (!props.chartData.hasOwnProperty("labels")) {
        return {
          labels: ["一月", "二月", "三月", "四月", "五月", "六月"],
          datasets: [
            {
              borderColor: "#7c4dff",

              data: [50, 30, 90, 200, 40, 69],
              backgroundColor: "rgba(124, 77, 255,0.1)",
              borderWidth: 1.5,
              fill: true,
            },
          ],
        };
      } else {
        return props.chartData;
      }
    });

    return {
      options,
      data,
    };
  },
};
</script>

<style></style>
