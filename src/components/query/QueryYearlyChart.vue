<template>
  <Line id="monthly-balance-chart" :data="chartData" />
</template>

<script setup>
import { useDateFormat } from '@vueuse/shared';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';

const props = defineProps({
  records: {
    type: Array,
    required:  true,
  }
})

const monthsData = [
  { balance: 0, name: 'January' },
  { balance: 0, name: 'February' },
  { balance: 0, name: 'March' },
  { balance: 0, name: 'April' },
  { balance: 0, name: 'May' },
  { balance: 0, name: 'June' },
  { balance: 0, name: 'July' },
  { balance: 0, name: 'August' },
  { balance: 0, name: 'September' },
  { balance: 0, name: 'October' },
  { balance: 0, name: 'November' },
  { balance: 0, name: 'December' },
];

const chartData = computed(() => {
  monthsData.forEach((month) => month.balance = 0);
  const sampleRecords = props.records.filter(record => record.type !== 0);
  sampleRecords.forEach(({ date, amount }) => {
    const recordMonth = useDateFormat(new Date(date), "MM").value;
    monthsData[recordMonth - 1].balance += amount;
  })  
  return {
    labels: monthsData.map(month => month.name),
    datasets: [
      {
        label: "Balance",
        backgroundColor: '#7c3aed',
        borderColor: "#c4b5fd",
        data: monthsData.map(month => month.balance),
      },
    ],
  }
});
</script>
