<template>
  <div>
    <Doughnut id="debits-tags-chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const props = defineProps(['filteredRecords']);
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

const recordsTags = computed(() => Array.from(new Set([...props.filteredRecords
  .filter(record => record.type === 2)
  .map(record => record.tag)
])));

const creditsSum = computed(() => {
  const credits = props.filteredRecords.filter(r => r.type === 1);
  return credits.reduce((balance, { amount }) => balance + amount, 0).toFixed(2)
})
const debitsSum = computed(() => {
  const debits = props.filteredRecords.filter(r => r.type === 2);
  return debits.reduce((balance, { amount }) => balance + amount, 0).toFixed(2)
})

const debitsByTag = computed(() => {
  const tagsTotal = [];
  const debitRecords = props.filteredRecords.filter(record => record.type === 2);
  recordsTags.value.forEach(tag => {
    const balance = debitRecords
      .filter(record => record.tag === tag)
      .reduce((balance, { amount }) => balance + amount, 0)
      .toFixed();
    const percentage = (balance / debitsBalance.value * 100).toFixed();
    tagsTotal.push(percentage);
  })
  return tagsTotal;
});

const chartData = computed(() => {
  return {
    labels: ['Credits', 'Debits'],
    datasets: [
      {
        label: "Sum",
        data: [creditsSum.value, debitsSum.value],
        borderColor: ['#22c55e', '#dc2626'], borderWidth: 2, barThickness: 125,
        backgroundColor: ['#bbf7d0', '#fecaca'],
      },
    ],
  }
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#5d5d5d" }
      },
      borderColor: "#fff"
    },
  }
});
</script>
