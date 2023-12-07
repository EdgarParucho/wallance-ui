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
  },
  typeSum: {
    type: Object,
    required: true,
  }
})

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const fundNames = computed(() => {
  const fundNames = [];
  Object.keys(props.typeSum[1].byFund).forEach(id => fundNames.push(funds.value.find(fund => fund.id === id).name))
  return fundNames;
})

const chartData = computed(() => {

  return {
    labels: fundNames.value,
    datasets: [
    {
        label: "Credit",
        data: Object.values(props.typeSum[1].byFund),
        backgroundColor: '#69a060',
        borderColor: 'black',
      },
      {
        label: "Debit",
        data: Object.values(props.typeSum[2].byFund),
        backgroundColor: '#da6960',
      },
    ],
  }
});
const chartOptions = {
  indexAxis: 'x',
  plugins: {
    legend: {
      display: false
    },
  },
  scales: {
    y: {
      max: props.typeSum[1].total,
    },
  }
};

</script>
