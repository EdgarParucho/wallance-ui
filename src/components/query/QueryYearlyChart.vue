<template>
  <Line id="monthly-balance-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend } from 'chart.js';
import { useRecordStore } from '../../stores/recordStore';
import { storeToRefs } from 'pinia';

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
);

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const monthsBalance = computed(() => {
  const result = [];
  months.forEach(month => {
    const monthMatch = (date) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(date)) === month;
    const yearMatch = (date) => new Date(date).getFullYear() === new Date().getFullYear();
    const monthRecords = records.value.filter(({ date, type }) => monthMatch(date) && yearMatch(date) && type !== 0);
    const monthBalance = monthRecords.reduce((acc, record) => acc + record.amount, 0);
    result.push(monthBalance);
  });
  return result;
});

const monthsCredits = computed(() => {
  const result = [];
  months.forEach(month => {
    const monthMatch = (date) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(date)) === month;
    const yearMatch = (date) => new Date(date).getFullYear() === new Date().getFullYear();
    const monthRecords = records.value.filter(({ date, type }) => monthMatch(date) && yearMatch(date) && type === 1);
    const monthBalance = monthRecords.reduce((acc, record) => acc + record.amount, 0);
    result.push(monthBalance);
  });
  return result;
});

const monthsDebits = computed(() => {
  const result = [];
  months.forEach(month => {
    const monthMatch = (date) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(date)) === month;
    const yearMatch = (date) => new Date(date).getFullYear() === new Date().getFullYear();
    const monthRecords = records.value.filter(({ date, type }) => monthMatch(date) && yearMatch(date) && type === 2);
    const monthBalance = monthRecords.reduce((acc, record) => acc - record.amount, 0);
    result.push(monthBalance);
  });
  return result;
});

const chartData = computed(() => {
  return {
    labels: months,
    datasets: [
      {
        label: "Credits",
        backgroundColor: '#22c55e',
        borderColor: "#bbf7d0",
        data: monthsCredits.value
      },
      {
        label: "Debits",
        backgroundColor: '#dc2626',
        borderColor: "#fecaca",
        data: monthsDebits.value
      },
      {
        label: "Balance",
        backgroundColor: '#7c3aed',
        borderColor: "#c4b5fd",
        data: monthsBalance.value
      }
    ]
  }
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    // indexAxis: 'y',
    plugins: {
      // legend: { display: false }
    },
  }
});
</script>
