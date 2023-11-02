<template>
  <Bar id="funds-balances-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { useFundStore } from '../../stores/fundStore';
import { useRecordStore } from '../../stores/recordStore';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

const fundsNames = computed(() => funds.value.map(fund => fund.name));

const fundsBalances = computed(() => {
  const totalCreditsByFund = Object.fromEntries(funds.value.map(fund => {
    return [fund.id, 0 ]
  }));
  const totalDebitsByFund = Object.fromEntries(funds.value.map(fund => {
    return [fund.id, 0 ]
  }));

  for (const record of records.value) {
    if (record.type === 1) totalCreditsByFund[record.fundID] += record.amount;
    else if (record.type === 2) totalDebitsByFund[record.fundID] -= record.amount;
    if (record.type === 0) {
      totalCreditsByFund[record.otherFundID] -= record.amount;
      totalDebitsByFund[record.fundID] -= record.amount;
    }
  }
  return { totalCreditsByFund, totalDebitsByFund }
})

const chartData = computed(() => {
  return {
    labels: fundsNames.value,
    datasets: [
      {
        label: "Credit",
        data: Object.values(fundsBalances.value.totalCreditsByFund),
        backgroundColor: '#69a060',
      },
      {
        label: "Debit",
        data: Object.values(fundsBalances.value.totalDebitsByFund),
        backgroundColor: '#da6960',
      }
    ],
  }
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    indexAxis: 'x',
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

</script>
