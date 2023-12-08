<template>
  <div>
    <Line id="line-chart" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { useNow, useDateFormat } from '@vueuse/core';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement);

const props = defineProps({
  datasets: {
    type: Object,
    required:  true,
  },
  currentYear: {
    type: String,
    required: true,
  },
});

const labels = [];


for (let month = 1; month <= 12; month++) labels.push(useDateFormat(`${props.currentYear}/${month}`, "MMM, YYYY").value);

const chartData = computed(() => {
  return {
    labels,
    datasets: Object.values(props.datasets),
  }
});

const chartOptions = {
  borderColor: [
    "#ddd6fe",
    "#38bdf8",
    "#a78bfa",
    "#2dd4bf",
    "#f472b6",
    "#8b5cf6",
    "#c084fc",
    "#6366f1",
    "#60a5fa",
    "#a855f7",
    "#e879f9",
    "#d946ef",
    "#fb7185",
    "#fecaca",
  ],
}
</script>
