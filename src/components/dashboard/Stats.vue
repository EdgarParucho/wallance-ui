<template>
  <div>
    <dl class="md:flex items-center justify-center gap-1">
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
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRecordStore } from '../../stores/recordStore';

const props = defineProps(['records']);
const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

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
  { id: 1, name: 'Your savings from this year', value: yearSavings.value.toFixed() + '%'},
  { id: 2, name: 'Saved on average monthly', value: '$' + averageMonthSaving.value },
  { id: 3, name: 'The full year estimated savings', value: '$' + (averageMonthSaving.value * 12).toFixed() },
]);

</script>
