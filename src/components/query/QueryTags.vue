<template>
  <div>
    <div class="flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <component
        :class="[iconStyles[type], ' bg-opacity-20 flex p-0.5 rounded-full h-5 w-5']"
        :is="icon[type]"></component>
        <select class="font-bold flex my-4 mx-auto text-lg border-none bg-transparent shadow-sm rounded-full focus:shadow-violet-200 focus:ring-0 focus:outline-none" v-model="type">
          <option class="bg-stone-700 text-white" :value="2">Debits</option>
          <option class="bg-stone-700 text-white" :value="1">Credits</option>
        </select>
      </div>
    </div>
    <div class="flex justify-start text-xs font-bold">
      <div class="w-1/12"></div>
      <div class="w-5/12">Tag</div>
      <div class="w-2/12">Sum</div>
      <div class="w-2/12">% Equivalent</div>
    </div>
    <dl>
      <div v-for="tag, i in tagList" :key="i" class="my-1 rounded-md shadow-md bg-white dark:bg-stone-800 flex items-center">
        <div class="w-1/12">
          <TagIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        </div>
        <dt class="w-5/12 text-sm">{{ tag.tagName }}</dt>
        <dd class="w-2/12 flex items-baseline my-2 mr-3 text-sm">
          {{ getAmountFormatted(tag.tagSum) }}
        </dd>
        <span class="w-2/12 text-center text-stone-500 dark:text-stone-300">{{ tagPercentage(tag.tagSum) }} %</span>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { TagIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline';
import { useRecordStore } from '../../stores/recordStore.js';

const props = defineProps({
  tagData: {
    type: Object,
    required: true,
  }
});

const recordStore = useRecordStore();

const type = ref(2);
const tagList = computed(() => props.tagData[type.value]);

const icon = {
  2: MinusIcon,
  1: PlusIcon,
};
const iconStyles = {
  2: 'text-red-500 bg-red-600',
  1: 'text-green-500 bg-green-600',
};

const sumByType = ref({
  2: 0,
  1: 0,
});

const tagPercentage = (tagSum) => {
  return ((tagSum / sumByType.value[type.value]) * 100).toFixed(1)
};

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

watch(recordStore.records, (records) => {
  if (recordStore.records.length > 0) records.forEach((record) => {
    if (record.type == 2) sumByType.value[2] += record.amount;
    else if (record.type == 1) sumByType.value[1] += record.amount;
  })
}, { immediate: true })

defineExpose({ type, tagList });

</script>
