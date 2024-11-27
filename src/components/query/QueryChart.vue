<template>
  <Doughnut id="debits-tags-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement);
ChartJS.defaults = { responsive: true };

const props = defineProps({
  taglistRef: {
    type: Object,
    default: {},
  },
  tagNames: {
    type: Object,
    default: {},
  }
})

const colors = [
  // violet
  "#ddd6fe",
  "#a78bfa",
  "#8b5cf6",
  // purple
  "#c084fc",
  "#a855f7",
  // fuchsia
  "#e879f9",
  "#d946ef",
  // indigo
  "#6366f1",
  // blue
  "#60a5fa",
  // sky
  "#38bdf8",
  // pink
  "#f472b6",
  // rose
  "#fb7185",
  "#fecaca",
  // red
  "#2dd4bf",
];

const chartData = computed(() => {
  return {
    labels: props.tagNames[props.taglistRef.type],
    datasets: [
      {
        label: " $",
        data: props.taglistRef.tagList.map(tag => tag.tagSum),
        backgroundColor: colors
      },
    ],
  }
});
const chartOptions = {
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#777" }
    }
  }
};

</script>
