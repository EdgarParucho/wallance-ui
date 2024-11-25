<template>
  <div>
    <h2 class="text-4xl font-bold text-center">Records</h2>
    <p class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">
      {{ queryCompleted ? 'Query Results' : 'Current Month' }}
    </p>
    <button
    class="my-8 mx-auto text-white hover:bg-violet-600 bg-violet-500 rounded-md w-32 flex items-center justify-center gap-1"
    @click="queryPanelIsOpen = true">
      <MagnifyingGlassIcon class="w-4" />
      <span>Make a Query</span>
    </button>
    <dl class="md:flex md:items-center mx-auto w-full 2xl:w-2/3">
      <dd
      v-for="stat in stats" :key="stat.id"
      class="flex items-center justify-between shadow-md bg-white dark:bg-stone-800 h-8 px-4 space-x-4 mx-auto my-2"
      >
        <component
        :class="[stat.styles, 'bg-opacity-20 flex p-0.5 rounded-full h-5 w-5']"
        :is="stat.icon" />
          <span class="text-stone-900 dark:text-stone-100 mx-auto">
            {{ stat.value }}
          </span>
      </dd>
    </dl>
    <QueryPanel
    v-if="queryPanelIsOpen"
    @close-form="queryPanelIsOpen = false"
    @confirm-query-completion="queryCompleted = true"
    :form-is-open="queryPanelIsOpen"
    />    
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRecordStore } from '../../stores/recordStore';
import { MinusIcon, PlusIcon, Bars2Icon } from '@heroicons/vue/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import QueryPanel from './QueryPanel.vue';


const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

let creditsSum = ref(0);
let debitsSum = ref(0);
const queryCompleted = ref(false);

const queryPanelIsOpen = ref(false);

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
  { id: 1, value: getAmountFormatted(creditsSum.value), icon: PlusIcon, styles: 'text-green-500 bg-green-600' },
  { id: 3, value: getAmountFormatted(debitsSum.value), icon: MinusIcon, styles: 'text-red-500 bg-red-600' },
  { id: 2, value: getAmountFormatted(creditsSum.value + debitsSum.value), icon: Bars2Icon, styles: 'dark:text-white text-stone-800 bg-stone-400' },
]);

watch(() => records.value, (updateRecords) => {
  creditsSum.value = 0;
  debitsSum.value = 0;
  const creditsAndDebits = updateRecords.filter(record => record.type === 1 || record.type === 2);
  creditsAndDebits.forEach(record => record.type === 1 ? creditsSum.value += Number(record.amount) : debitsSum.value += Number(record.amount));
}, { immediate: true })

</script>
