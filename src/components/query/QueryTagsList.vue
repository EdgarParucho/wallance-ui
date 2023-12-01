<template>
  <div>
    <dl>
      <div class="flex items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <component
          :class="[iconStyles[type], ' bg-opacity-20 flex p-0.5 rounded-full h-5 w-5']"
          :is="icon[type]"></component>
          <select class="font-bold flex my-4 mx-auto text-lg border-none bg-transparent shadow-sm rounded-full focus:shadow-violet-200 focus:ring-0 focus:outline-none" v-model="type">
            <option class="bg-stone-700 text-white" :value="2">Debits</option>
            <option class="bg-stone-700 text-white" :value="1">Credits</option>
            <option class="bg-stone-700 text-white" :value="0">Assignments</option>
          </select>
        </div>
      </div>
      <div v-for="tag, i in tagList" :key="i" class="my-1 rounded-md shadow-md bg-white dark:bg-stone-800 flex justify-between items-center">
        <dt class="flex items-center gap-4 p-3">
          <TagIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          <span class="text-sm">{{ tag.tagName }}</span>
        </dt>
        <dd class="justify-end flex items-baseline my-2 mr-3 text-sm">
          <span class="text-stone-500 dark:text-stone-300">{{ getAmountFormatted(tag.tagSum) }}</span>
          <strong class="shadow-sm dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800 rounded-sm px-0.5 w-16 text-center mx-4">
            {{ tagPercentage(tag.tagSum) }} %
          </strong>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { TagIcon, PlusIcon, MinusIcon, ArrowsRightLeftIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';

const props = defineProps({
  tagData: {
    type: Object,
    required: true,
  },
  typeSum: {
    type: Object,
    required: true,
  }
});

const type = ref(2);
const tagList = computed(() => props.tagData[type.value]);

const icon = {
  2: MinusIcon,
  1: PlusIcon,
  0: ArrowsRightLeftIcon,
};
const iconStyles = {
  2: 'text-red-500 bg-red-600',
  1: 'text-green-500 bg-green-600',
  0: 'text-stone-500 bg-stone-600',
};

const tagPercentage = (tagSum) => {
  return ((tagSum / props.typeSum[type.value].total) * 100).toFixed(1)
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

defineExpose({ type, tagList });

</script>
