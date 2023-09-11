<script setup>
import { TagIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['tags', 'title', 'showAllTags', 'icon']);
const emit = defineEmits(['alternateLimit']);

function amountFormatted(amount) {
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

</script>

<template>
  <dl class="md:w-1/2 lg:w-1/3 mx-auto">
    
    <div class="flex items-center justify-between my-4">
      <div class="flex items-center gap-1">
        <component
        :class="[title === 'Credits' ? 'text-green-500 bg-green-600' : 'text-red-500 bg-red-600', ' bg-opacity-20 flex p-0.5 rounded-full h-5 w-5']"
        :is="icon"></component>
        <h4 class="text-center text-xl font-bold">{{ title }}</h4>
      </div>
      <span class="text-sm">Showing: {{ tags.data.length }} / {{ tags.totalTags }}</span>
      <small>
        <button
        class="text-stone-500 border border-stone-600 rounded-full px-2 hover:text-black dark:hover:text-white hover:disabled:text-stone-500 dark:hover:disabled:text-stone-500 disabled:text-stone-500"
        :disabled="tags.totalTags < 5"
        @click="$emit('alternateLimit')"
        >
          Show {{ showAllTags ? 'top 5' : 'All' }}
        </button>
      </small>
    </div>
    <div v-for="tag, i in tags.data" :key="i" class="my-1 rounded-md shadow-md bg-white dark:bg-stone-800 flex justify-between items-center">
      <dt class="flex items-center gap-4 p-3">
        <TagIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        {{ tag.name }}
      </dt>
      <dd class="justify-end flex items-baseline my-2 mr-3">
        <span class="text-stone-500 dark:text-stone-300">{{ amountFormatted(tag.balance) }}</span>
        <strong class="bg-stone-100 dark:bg-stone-900 rounded-sm px-2 w-16 text-center mx-4">{{ tag.percentage }}%</strong>
      </dd>
    </div>
  </dl>
</template>