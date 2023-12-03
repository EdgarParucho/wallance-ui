<template>
  <dl class="md:flex items-center justify-center gap-4">
    <div
    v-for="stat, i in stats" :key="i"
    class="flex items-center justify-center shadow-md bg-white dark:bg-stone-800 h-36 sm:h-56 w-full lg:w-4/12 xl:w-3/12 2xl:w-2/12"
    >
      <div class="grid">
        <dd class="text-3xl font-semibold text-center text-stone-900 dark:text-stone-100 sm:text-5xl">{{ stat.value }}</dd>
        <dt class="leading-7 text-stone-600 dark:text-stone-400 text-center">{{ stat.name }}</dt>
      </div>
    </div>
  </dl>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  datasets: {
    type: Array,
    default: [],
  }
});

const stats = computed(() => {
  const annualBalance = props.datasets.reduce((balance, fundDataset) => balance + fundDataset.sum, 0).toFixed();
  const avgMonthlySavings = props.datasets.reduce((acc, { monthlyAvg }) => acc + monthlyAvg, 0).toFixed();
  const projectedAnnualSavings = (avgMonthlySavings * 12).toFixed();
  const savingsPercentage = ((projectedAnnualSavings / annualBalance) * 100).toFixed();
  
  return [
    { name: 'Of total income is saved', value: savingsPercentage + '%' },
    { name: 'Saved monthly', value: '$' + avgMonthlySavings },
    { name: 'Projected by the end of the year', value: '$' + projectedAnnualSavings },
  ];
});

</script>
