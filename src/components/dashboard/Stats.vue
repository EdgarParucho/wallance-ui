<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
        <div v-for="stat in stats" :key="stat.id" class="mx-auto flex max-w-xs flex-col gap-y-4">
          <dt class="text-base leading-7 text-gray-600">{{ stat.name }}</dt>
          <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{{ stat.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['records']);

const yearRecords = computed(() => {
  const isFromCurrentYear = (date) => new Date(date).getFullYear() === new Date().getFullYear();
  const filteredRecords = props.records.filter(({ date, type }) => isFromCurrentYear(date) && type !== 0)
  return filteredRecords;
});
const currentMonth = Number(new Intl.DateTimeFormat('en-US', { month: '2-digit' }).format(new Date()));

const yearCredits = computed(() => yearRecords.value.filter((record) => record.type === 1));
const yearDebits = computed(() => yearRecords.value.filter((record) => record.type === 2));
const creditsBalance = computed(() => yearCredits.value.reduce((balance, record) => (balance + record.amount), 0));
const debitsBalance = computed(() => yearDebits.value.reduce((balance, record) => (balance + record.amount), 0));
const yearBalance = computed(() => creditsBalance.value + debitsBalance.value);

const yearSavings = computed(() => ((yearBalance.value / creditsBalance.value) * 100).toFixed());

const averageMonthSaving = computed(() => (yearBalance.value / currentMonth).toFixed());

const stats = [
  { id: 1, name: 'You have saved this year', value: yearSavings.value + '%'},
  { id: 2, name: 'You are saving on average monthly', value: '$' + averageMonthSaving.value },
  { id: 3, name: 'This year estimated savings', value: '$' + averageMonthSaving.value * 12 },
];

</script>