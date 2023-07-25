<template>
  <div class="p-3 hover:shadow-md hover:shadow-teal-600 transition-shadow rounded-md bg-stone-900 flex justify-center">
    <Line
      :id="id"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend } from 'chart.js'

  ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

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
    default: "line-chart"
  }
});

const datasets = [
  {
    label: props.dataLabel,
    backgroundColor: '#2d6a4f',
    borderColor: "#d8f3dc",
    data: props.dataValues
  },
  ]
// const labels = Utils.months({count: 7});
const data = {
  labels: props.labels,
  datasets
};

const chartData = computed(() => {
  return data
});
const chartOptions = computed(() => {
  return { responsive: true, }
});

</script>
