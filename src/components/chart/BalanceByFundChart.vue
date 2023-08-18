<template>
  <Doughnut id="funds-balances-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { storeToRefs } from 'pinia';
import { useFundStore } from '../../stores/fundStore';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

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
  // // blue
  "#60a5fa",
  // // sky
  "#38bdf8",
  // pink
  "#f472b6",
  // rose
  "#fb7185",
  "#fecaca",
  // red
  "#2dd4bf",
];

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const fundsNames = computed(() => funds.value.map(fund => fund.name));
const fundsBalances = computed(() => funds.value.map(fund => fund.balance));

const chartData = computed(() => {
  return {
    labels: fundsNames.value,
    datasets: [
    {
      label: "Balance",
      data: fundsBalances.value,
      backgroundColor: colors
    },
    ],
  }
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: "left",
        labels: {
          color: "#878787"
        }
      }
    }
  }
});

</script>
