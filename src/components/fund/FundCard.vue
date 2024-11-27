<template>
  <div class="mb-1 mx-auto h-26 pt-1 w-80 rounded-sm bg-white dark:bg-stone-800">
    <div class="px-2 flex justify-between">
      <ArchiveBoxIcon class="rounded-full w-7 h-7 p-1 bg-stone-200 dark:bg-stone-900 text-stone-500 dark:text-stone-400" />
      <strong class="text-lg font-light">{{ amountFormatted(fund.balance) }}</strong>
    </div>
    <dt class="px-2 text-sm">{{ fund.name }}</dt>
    <dd class="px-2 text-xs text-stone-500 dark:text-stone-400">{{ fund.description }}</dd>

    <div class="flex justify-evenly">
      <button
      class="w-1/2 py-0.5 hover:bg-stone-100 dark:hover:bg-stone-700 focus:bg-stone-100 dark:focus:bg-stone-700 focus:outline-none transition-colors"
      @click="$emit('editFund')"
      >
        <PencilSquareIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
      <button
      class="w-1/2 py-0.5 text-red-400 hover:bg-red-100 dark:hover:bg-red-900 focus:bg-red-100 dark:focus:bg-red-900 focus:outline-none transition-colors disabled:text-stone-400 disabled:hover:bg-stone-100 dark:disabled:hover:bg-stone-800"
      @click="$emit('validateDeletion')"
      :disabled="fund.isDefault"
      >
        <TrashIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ArchiveBoxIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps(['fund']);
const emit = defineEmits(['edit-fund', 'validate-deletion']);

function amountFormatted(amount = 0) {
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
