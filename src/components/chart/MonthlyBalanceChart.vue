<template>
  <div class="p-3 bg-stone-800 shadow-md shadow-black rounded-md flex justify-center">
    <Line id="monthly-balance-chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { useRecordStore } from '../../stores/recordStore';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
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
    const monthRecords = records.value.filter(({ date }) => monthMatch(date) && yearMatch(date));
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
        backgroundColor: '#156064',
        borderColor: "#00c49a",
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
        labels: { color: "#fff" }
      },
      title: {
        display: true,
        text: "Balance by month",
        color: "#fff",
      },
    },
    scales: {
      x: {
        ticks: { color: 'white' }
      },
      y: {
        ticks: { color: 'white' }
      }
    }
  }
});
</script>
