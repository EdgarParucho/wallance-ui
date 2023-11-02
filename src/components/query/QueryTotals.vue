<template>
  <div>
    <h2 class="text-4xl font-bold text-center">Overall Results</h2>
    <h4 class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">The balance of your query</h4>
    <dl class="md:flex md:items-center mx-auto w-full 2xl:w-2/3">
      <dd
      v-for="stat in stats" :key="stat.id"
      class="flex items-center justify-between shadow-md bg-white dark:bg-stone-800 h-12 px-4 space-x-4 mx-auto my-2"
      >
        <component
        :class="[stat.styles, 'bg-opacity-20 flex p-0.5 rounded-full h-5 w-5']"
        :is="stat.icon" />
          <span class="text-xl md:text-2xl font-semibold text-stone-900 dark:text-stone-100 sm:text-2xl mx-auto">
            {{ stat.value }}
          </span>
      </dd>
    </dl>
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useRecordStore } from '../../stores/recordStore';
import { MinusIcon, PlusIcon, Bars2Icon } from '@heroicons/vue/24/outline';

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

let creditsSum = 0;
let debitsSum = 0;

function getAmountFormatted(amount) {
  const integer = Math.floor(amount);
  const fractions = amount
    .toString()
    .split('.')[1] || "0";
  const recomposed = [integer, fractions.slice(0, 2)].join(".")
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(recomposed)
}

const stats = computed(() => [
  { id: 1, value: getAmountFormatted(creditsSum), icon: PlusIcon, styles: 'text-green-500 bg-green-600' },
  { id: 3, value: getAmountFormatted(debitsSum), icon: MinusIcon, styles: 'text-red-500 bg-red-600' },
  { id: 2, value: getAmountFormatted(creditsSum + debitsSum), icon: Bars2Icon, styles: 'dark:text-white text-stone-800 bg-stone-400' },
]);

watchEffect(() => {
  creditsSum = 0;
  debitsSum = 0;
  const creditsAndDebits = records.value.filter(record => record.type === 1 || record.type === 2);
  creditsAndDebits.forEach(record => record.type === 1 ? creditsSum += record.amount : debitsSum += record.amount);
})

</script>
