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

const fundNames = funds.value.map(fund => fund.name);

const chartData = computed(() => {

  return {
    labels: fundNames,
    datasets: [
    {
        label: "Credit",
        data: Object.values(props.typeSum[1].byFund),
        backgroundColor: '#69a060',
      },
      {
        label: "Debit",
        data: Object.values(props.typeSum[2].byFund),
        backgroundColor: '#da6960',
      },
      {
        label: "Assignment",
        data: Object.values(props.typeSum[0].byFund),
        backgroundColor: '#60b0b0',
      },
    ],
  }
});
const chartOptions = {
  indexAxis: 'x',
  plugins: {
    legend: {
      display: false
    }
  }
};

</script>
