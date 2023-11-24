<template>
  <Bar id="funds-balances-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Bar } from 'vue-chartjs';
import { useFundStore } from '../../stores/fundStore';

const props = defineProps({
  records: {
    type: Array,
    required:  true,
  }
})

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const fundsNames = computed(() => funds.value.map(fund => fund.name));
const fundsBalances = computed(() => {
  const totalCreditsByFund = Object.fromEntries(funds.value.map(fund => [fund.id, 0 ]));
  const totalDebitsByFund = Object.fromEntries(funds.value.map(fund => [fund.id, 0 ]));

  for (const record of props.records) {
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
