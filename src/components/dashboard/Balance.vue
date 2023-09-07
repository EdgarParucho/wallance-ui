<script setup>
import { ScaleIcon } from '@heroicons/vue/24/outline';
const props = defineProps(['balance']);
</script>

<template>
  <div class="mt-4 md:w-1/2 lg:w-1/3 xl:w-1/4 my-6 mx-auto px-16 py-6 rounded-xl shadow-md bg-white dark:bg-stone-800">
    <ScaleIcon class="w-12 mx-auto p-2.5 rounded-full shadow-sm shadow-stone-400 text-stone-500 dark:text-stone-400 dark:shadow-black bg-stone-100 dark:bg-stone-800" />
    <div class="my-8 flex justify-center items-center">
      <h2 class="text-5xl text-center">
        {{ balance }}
      </h2>
    </div>
  </div>
</template>