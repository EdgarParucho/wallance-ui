<template>
  <Doughnut id="debits-tags-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs'

const props = defineProps({
  tagsData: {
    type: Array,
    default: [],
  },
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

const tagsNames = computed(() => props.tagsData.map(tag => tag.name));
const tagsBalance = computed(() => props.tagsData.map(tag => tag.balance));

const chartData = computed(() => {
  return {
    labels: tagsNames.value,
    datasets: [
      { label: " %", data: tagsBalance.value, backgroundColor: colors },
    ],
  }
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#5d5d5d" }
      }
    }
  }
});

</script>
