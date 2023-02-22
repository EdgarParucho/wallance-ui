<template>
  <div class="dark:bg-stone-800 dark:text-white rounded-md md:w-2/4 p-2 mt-5">
    <div class="flex justify-between">
      <div class="flex">
        <span class="text-3xl first-letter:text-lg">${{ record.amount }}</span>
      </div>
      <span
      class="bg-stone-900 text-white font-bold h-6 w-16 text-center px-2 rounded-sm"
      :class="record.type === 'Debit' ? 'bg-stone-700' : 'bg-cyan-500'"
      >
        {{ record.type }}
      </span> 
    </div>
    <p class="py-5">Here goes the note{{ record.note }}</p>
    <div class="flex justify-between space-x-1">
      <span class="dark:text-stone-300">{{ record.date }}</span>
      <button class="bg-stone-800 rounded-full p-2 hover:bg-stone-700 text-yellow-500 active:bg-stone-800 transition-colors">
        <PencilSquareIcon class="w-6" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline'

const props = defineProps(['record'])
</script>
