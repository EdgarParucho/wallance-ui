<template>
  <div class="mt-8">
    <div class="md:flex rounded-lg bg-stone-800 w-full md:w-1/2">
      <img
      class="h-64 w-full md:w-2/6 object-cover rounded-none md:rounded-l-lg"
      :src="fund.picture"
      alt=""
      >
      <div class="w-full md:w-4/6 p-4">
        <div class="h-1/3 w-full">
          <h5 class="text-xl font-bold text-stone-50 mb-2">
            {{ fund.name }}
          </h5>
          <p class="text-stone-200 text-sm">
            {{ fund.description }}
          </p>
        </div>
        <div class="h-1/3 w-full text-end item">
          <span class="text-3xl font-bold text-white">
            ${{ fund.savings }}
          </span>
          <p class="text-xs text-stone-500 dark:text-stone-300">
            {{ fund.lastUpdated }}
          </p>
        </div>
        <div class="h-1/3 w-full flex items-center justify-end mt-2">
          <button
          class="text-yellow-400 bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold w-12 h-10 rounded-md"
          @click="$emit('open-modal')"
          >
            <PencilSquareIcon class="w-5 h-5 text-yellow-500 mx-auto" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { defineEmits } from 'vue'

const emit = defineEmits(['open-modal'])
const props = defineProps(['fund'])
</script>