<template>
  <div class="p-3 shadow-md shadow-black transition-shadow rounded-md bg-stone-800 flex justify-center">
    <Pie id="funds-balances-chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { storeToRefs } from 'pinia';
import { useFundStore } from '../../stores/fundStore';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const colors =[
  "#d9ed92", "#a9edb2", "#99d98c", "#76c893", "#52b69a", "#34a0a4", "#168aad", "#1a759f", "#184e77",
  "#156064", "#00c49a", "#f8e16c", "#ffc2b4", "#fb8f67",
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
          color: "#fff"
        }
      },
      title: {
        display: true,
        text: "Balance by Fund",
        color: "#fff",
      }
    }
  }
});

</script>
