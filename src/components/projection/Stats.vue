<template>
  <dl class="md:flex items-center justify-center gap-4">
    <div
    v-for="stat in stats" :key="stat.id"
    class="flex items-center justify-center shadow-md bg-white dark:bg-stone-800 h-36 sm:h-56 w-full lg:w-4/12 xl:w-3/12 2xl:w-2/12"
    >
      <div class="grid">
        <dd class="text-3xl font-semibold text-center text-stone-900 dark:text-stone-100 sm:text-5xl">{{ stat.value }}</dd>
        <dt class="leading-7 text-stone-600 dark:text-stone-400">{{ stat.name }}</dt>
      </div>
    </div>
  </dl>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  sampleRecords: {
    type: Array,
    default: [],
  },
});

const currentMonth = Number(new Intl.DateTimeFormat('en-US', { month: '2-digit' }).format(new Date()));

const yearCredits = computed(() => props.sampleRecords.filter((record) => record.type === 1));
const yearDebits = computed(() => props.sampleRecords.filter((record) => record.type === 2));
const creditsBalance = computed(() => yearCredits.value.reduce((balance, { amount }) => (balance + Number(amount)), 0));
const debitsBalance = computed(() => yearDebits.value.reduce((balance, { amount }) => (balance + Number(amount)), 0));
const yearBalance = computed(() => creditsBalance.value + debitsBalance.value);
const yearSavings = computed(() => (yearBalance.value / creditsBalance.value) * 100);
const averageMonthSaving = computed(() => Number(yearBalance.value / (currentMonth - 1)).toFixed());

const stats = computed(() => [
  { id: 1, name: 'Saved until now', value: yearSavings.value.toFixed() + '%'},
  { id: 2, name: 'Saved monthly', value: '$' + averageMonthSaving.value },
  { id: 3, name: 'Estimated savings from this year', value: '$' + (averageMonthSaving.value * 12).toFixed() },
]);

</script>
