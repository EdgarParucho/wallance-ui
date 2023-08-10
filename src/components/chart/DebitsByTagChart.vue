<template>
  <div class="xl:pr-12">
    <Pie id="debits-tags-chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs'
import { useRecordStore } from '../../stores/recordStore';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { storeToRefs } from 'pinia';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const recordStore = useRecordStore();
const colors = [
  "#d9ed92", "#a9edb2", "#99d98c", "#76c893", "#52b69a", "#34a0a4", "#168aad", "#1a759f", "#184e77",
  "#156064", "#00c49a", "#f8e16c", "#ffc2b4", "#fb8f67",
];

const { records } = storeToRefs(recordStore);
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
        position: "left",
        labels: { color: "#fff" }
      },
      title: {
        display: true,
        text: "Debit by tag",
        color: "#fff",
      }
    }
  }
});
</script>
