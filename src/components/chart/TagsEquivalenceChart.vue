<template>
  <Doughnut id="debits-tags-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useRecordStore } from '../../stores/recordStore';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

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

const recordsTags = computed(() => Array.from(new Set([...records.value
  .filter(record => record.type === 2)
  .map(record => record.tag)
])));

const debitsBalance = computed(() => records.value
  .filter(record => record.type === 2)
  .reduce((totalCredits, { amount }) => totalCredits + Number(amount), 0)
);

const debitsByTag = computed(() => {
  const tagsTotal = [];
  const debitRecords = records.value.filter(record => record.type === 2);
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
    labels: recordsTags.value,
    datasets: [
      { label: " %", data: debitsByTag.value, backgroundColor: colors },
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
