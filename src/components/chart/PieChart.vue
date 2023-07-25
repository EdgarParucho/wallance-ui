<template>
  <div class="p-3 hover:shadow-md hover:shadow-teal-600 transition-shadow rounded-md bg-stone-900 flex justify-center">
    <Pie
      :id="id"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const coolors =[
  // "#780000", "#c1121f", "#fdf0d5", "#003049", "#669bbc",
  // "#97d4b7", "#b7e4c7", "#95d5b2", "#74c69d", "#52b788", "#40916c", "#2d6a4f", "#1b4332", "#081c15"
  // "#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"
  // "#d9ed92", "#99d98c", "#76c893", "#52b69a", "#34a0a4", "#168aad", "#1a759f", "#184e77"
  "#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef", "#ade8f4", "#caf0f8",
  // "#231942", "#5e548e", "#9f86c0", "#be95c4", "#e0b1cb"
]

const props = defineProps({
  dataLabel: {
    type: String,
    required: true
  },
  dataValues: {
    type: Array,
    required: true,
    default: []
  },
  labels: {
    type: Array,
    required: false,
    default: []
  },
  id: {
    type: String,
    required: true,
    default: "pie-chart"
  }
});
const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: [
    {
      label: props.dataLabel,
      data: props.dataValues,
      backgroundColor: coolors
    },
    ],
  }
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: "left"
      }
    }
  }
});

</script>
