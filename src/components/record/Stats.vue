<template>
  <dl class="md:flex items-center justify-center gap-4">
    <div
    v-for="stat in stats" :key="stat.id"
    class="flex items-center justify-center shadow-md bg-white dark:bg-stone-800 h-36 sm:h-56 w-full lg:w-4/12 xl:w-3/12 2xl:w-2/12"
    >
      <div v-if="requestingRecords" class="grid gap-2">
        <div class="bg-stone-300 w-28 animate-pulse h-12 mx-auto"></div>
        <div class="bg-stone-300 w-44 animate-pulse h-6 mx-auto"></div>
      </div>
      <div class="grid" v-else>
        <dd class="text-3xl font-semibold text-center text-stone-900 dark:text-stone-100 sm:text-5xl">{{ stat.value }}</dd>
        <dt class="leading-7 text-stone-600 dark:text-stone-400">{{ stat.name }}</dt>
      </div>
    </div>
  </dl>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRecordStore } from '../../stores/recordStore';

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);
const { requestingRecords } = storeToRefs(recordStore);

const yearRecords = computed(() => {
  const isFromCurrentYear = (date) => new Date(date).getFullYear() === new Date().getFullYear();
  const filteredRecords = records.value.filter(({ date, type }) => isFromCurrentYear(date) && type !== 0)
  return filteredRecords;
});
const currentMonth = Number(new Intl.DateTimeFormat('en-US', { month: '2-digit' }).format(new Date()));

const yearCredits = computed(() => yearRecords.value.filter((record) => record.type === 1));
const yearDebits = computed(() => yearRecords.value.filter((record) => record.type === 2));
const creditsBalance = computed(() => yearCredits.value.reduce((balance, { amount }) => (balance + Number(amount)), 0));
const debitsBalance = computed(() => yearDebits.value.reduce((balance, { amount }) => (balance + Number(amount)), 0));
const yearBalance = computed(() => creditsBalance.value + debitsBalance.value);
const yearSavings = computed(() => (creditsBalance.value > 0) ? (yearBalance.value / creditsBalance.value) * 100 : 0);
const averageMonthSaving = computed(() => (yearBalance.value / (currentMonth - 1)).toFixed());

const stats = computed(() => [
  { id: 1, name: 'Saved until now', value: yearSavings.value.toFixed() + '%'},
  { id: 2, name: 'Saved monthly', value: '$' + averageMonthSaving.value },
  { id: 3, name: 'Estimated savings from this year', value: '$' + (averageMonthSaving.value * 12).toFixed() },
]);

</script>
