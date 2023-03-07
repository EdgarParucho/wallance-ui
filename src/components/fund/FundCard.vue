<template>
  <div class="rounded-lg bg-stone-800 w-full md:w-1/3 p-2 md:inline-block h-56 m-2">
    <div class="h-1/3 w-full">
      <h5 class="text-xl font-bold text-stone-50 mb-2">
        {{ fund.name }}
      </h5>
      <p class="text-stone-200 text-sm">
        {{ fund.description }}
      </p>
    </div>
    <div class="h-1/3 w-full text-end first-letter:mr-1 mt-2">
      <span class="text-3xl text-white">
        ${{ fund.savings }}
      </span>
      <p class="text-xs text-stone-300">
        {{ fund.lastUpdated }}
      </p>
    </div>
    <div class="h-1/3 w-full flex items-center justify-end mt-2">
      <button
      class="text-yellow-400 bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold w-10 h-8 rounded-md"
      @click="$emit('open-modal', fund)"
      >
        <PencilSquareIcon class="w-5 h-5 text-yellow-500 mx-auto" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { PencilSquareIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['open-modal'])
const props = defineProps(['fund'])
</script>