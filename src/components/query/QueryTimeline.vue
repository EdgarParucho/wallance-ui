<template>
  <Line id="timeline-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
ChartJS.defaults = { responsive: true };

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  },
  chartOptions: {
    type: Object,
    default: () => ({
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#777' }
        },
        title: {
          display: true,
          text: 'Balance Timeline',
          color: '#777',
          font: { size: 18, weight: 'normal' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#888' },
          grid: { color: '#eee' }
        },
        y: {
          ticks: { color: '#888' },
          grid: { color: '#eee' }
        }
      }
    })
  }
});

function getMonthLabel(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short', year: '2-digit' });
}

const chartData = computed(() => {

  const creditsByMonth = {};
  const debitsByMonth = {};
  const allMonthsSet = new Set();

  props.records.forEach(record => {
    const label = getMonthLabel(record.date);
    allMonthsSet.add(label);
    if (record.type === 1) {
      creditsByMonth[label] = (creditsByMonth[label] || 0) + Number(record.amount);
    } else if (record.type === 2) {
      debitsByMonth[label] = (debitsByMonth[label] || 0) + Number(record.amount);
    }
  });

  const months = Array.from(allMonthsSet);
  months.sort((a, b) => {
    const [am, ay] = a.split(' ');
    const [bm, by] = b.split(' ');
    const ad = new Date(`20${ay}`, new Date(Date.parse(am + ' 1, 2000')).getMonth());
    const bd = new Date(`20${by}`, new Date(Date.parse(bm + ' 1, 2000')).getMonth());
    return ad - bd;
  });

  const data = [];

  for (let i in months) {
    const previousMonthBalance = data[i - 1] || 0;
    const currentMonthBalance = (creditsByMonth[months[i]] || 0) + (debitsByMonth[months[i]] || 0);
    const nextBalance = previousMonthBalance + currentMonthBalance;
    data.push(nextBalance)
  }

  return {
    labels: months,
    datasets: [
      {
        label: 'Balance',
        data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        fill: true,
        tension: 0.4,
      }
    ]
  };
});
</script>
