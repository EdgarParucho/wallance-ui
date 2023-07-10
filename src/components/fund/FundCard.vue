<template>
  <div class="bg-stone-800 rounded-lg w-full lg:w-2/3 lg:inline-block xl:w-1/3 p-2 h-56 my-2 xl:mx-2 xl:inline-block">
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
        ${{ fund.balance }}
      </span>
      <p class="text-xs text-stone-300">
        {{ fund.lastUpdated }}
      </p>
    </div>
    <div class="h-1/3 w-full flex items-center justify-end mt-2 space-x-1">
      <button
      class="bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold w-7 h-7 rounded-md"
      @click="$emit('edit-fund', fund)"
      >
        <PencilSquareIcon class="w-5 h-5 mx-auto" aria-hidden="true" />
      </button>
      <button
      class="bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold w-7 h-7 rounded-md"
      @click="validateDeletion(fund)"
      >
        <TrashIcon class="w-5 h-5 mx-auto" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['edit-fund', 'confirm-deletion'])
const props = defineProps(['fund'])

function validateDeletion(fund) {
  if(fund.isDefault) return alert('Cannot delete the default fund.')
  else if(fund.balance > 0) return alert(
    'Cannot delete a fund with positive balance. You can move the balance to another fund, then retry this action.'
  );
  emit('confirm-deletion', fund)
}
</script>