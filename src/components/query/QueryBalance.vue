<template>
  <div class="my-4 w-11/12 xl:w-2/3 mx-auto">
    <h3 class="mt-16 mb-4 text-center font-bold text-xl">Query Balance</h3>
    <dl class="md:flex gap-1 md:items-center justify-between">
      <dd
      v-for="typeBalance in typeBalances" :key="typeBalance.recordType"
      class="w-full flex items-center justify-between shadow-md bg-white dark:bg-stone-800 h-8 px-4 space-x-4 mx-auto my-2"
      >
        <RecordIcon :recordType="typeBalance.recordType" />
        <span>${{ typeBalance.value }}</span>
      </dd>
    </dl>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRecordStore } from '../../stores/recordStore';
import { MinusIcon, PlusIcon, Bars2Icon } from '@heroicons/vue/24/outline';
import RecordIcon from '../layout/RecordIcon.vue';

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

let creditsSum = ref(0);
let debitsSum = ref(0);

function getAmountFormatted(amount) {
  return (amount < 0) ? String(Number(-amount).toFixed(2)) : String(Number(amount).toFixed(2));
}

const typeBalances = computed(() => [
  { recordType: 1, value: getAmountFormatted(creditsSum.value), icon: PlusIcon, styles: 'text-green-500 bg-green-600' },
  { recordType: 2, value: getAmountFormatted(debitsSum.value), icon: MinusIcon, styles: 'text-red-500 bg-red-600' },
  { recordType: 0, value: getAmountFormatted(creditsSum.value + debitsSum.value), icon: Bars2Icon, styles: 'dark:text-white text-stone-800 bg-stone-400' },
]);

watch(() => records.value, (updateRecords) => {
  creditsSum.value = 0;
  debitsSum.value = 0;
  const creditsAndDebits = updateRecords.filter(record => record.type === 1 || record.type === 2);
  creditsAndDebits.forEach(record => record.type === 1 ? creditsSum.value += Number(record.amount) : debitsSum.value += Number(record.amount));
}, { immediate: true })

</script>
