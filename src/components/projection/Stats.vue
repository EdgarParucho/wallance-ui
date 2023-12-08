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
  sampleCredit: {
    type: Number,
    required: true,
  },
  sampleDebit: {
    type: Number,
    required: true,
  },
  monthsPassed: {
    type: Number,
    required: true,
  }
});

const stats = computed(() => {
  const sampleBalance = props.sampleCredit + props.sampleDebit;
  const savingPercentage = ((sampleBalance / props.sampleCredit) * 100).toFixed();
  const avgMonthlySaving = (sampleBalance / props.monthsPassed).toFixed();

  return [
    { name: 'Of total income has been saved', value: savingPercentage + '%' },
    { name: 'Is saved monthly on average', value: '$' + avgMonthlySaving },
    { name: 'Savings projected for 12 months', value: '$' + avgMonthlySaving * 12 },
  ];
});

</script>
