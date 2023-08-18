<template>
  <div>
    <Line id="monthly-balance-chart" :options="chartOptions" :data="chartData" />
  </div>
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
  Legend } from 'chart.js'

  ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const props = defineProps(['filteredRecords']);
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
    const monthRecords = props.filteredRecords.filter(({ date, type }) => monthMatch(date) && yearMatch(date) && type !== 0);
    const monthBalance = monthRecords.reduce((acc, record) => acc + record.amount, 0);
    result.push(monthBalance);
  });
  return result;
});

const chartData = computed(() => {
  return {
    labels: months,
    datasets: [
      {
        label: "Balance ($)",
        backgroundColor: '#8b5cf6',
        borderColor: "#ddd6fe",
        data: monthsBalance.value
      },
    ]
  }
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#878787" }
      },
      title: {
        display: true,
        text: "Balance by month",
        color: "#878787",
      },
    },
    scales: {
      x: {
        ticks: { color: '#878787' }
      },
      y: {
        ticks: { color: '#878787' }
      }
    }
  }
});
</script>
