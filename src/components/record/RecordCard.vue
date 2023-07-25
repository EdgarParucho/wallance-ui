<template>
  <div class="bg-stone-800 text-white font-sans rounded-md lg:block h-32 my-4 lg:w-2/3 mx-auto">
    <div class="flex justify-between">
      <p class="ml-2 text-stone-300">{{ recordDate }}</p>
      <span :class="[recordType(record.type).textClass, 'flex items-center justify-center h-6 w-16 text-sm rounded-sm']">
        {{ recordType(record.type).name }}
      </span>
    </div>
    <div class="justify-end flex items-baseline my-2 mr-3">
      <span class="text-3xl">{{ recordAmount }}</span>
    </div>
    <p class="ml-2 text-md h-10">{{ record.note }}</p>
    <div class="flex align-bottom">
      <button
      class="w-1/2 py-1 text-yellow-500 bg-stone-800 active:bg-stone-800 hover:bg-stone-700 focus:bg-stone-700 focus:outline-none transition-colors"
      @click="$emit('edit-record', record)"
      >
        <PencilSquareIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
      <button
      class="w-1/2 py-1 text-red-500 bg-stone-800 active:bg-red-800 hover:bg-red-900 focus:bg-red-900 focus:outline-none transition-colors"
      @click="confirmDeletion(record)"
      >
        <TrashIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue';
import swal from "sweetalert";

const props = defineProps(['record'])
const emit = defineEmits(['edit-record', 'delete-record'])

const recordDate = computed(() => new Date(props.record.date).toDateString());
const recordAmount = computed(() => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  roundingIncrement: 5,
}).format(props.record.amount));
// bind the class
function recordType(recordType) {
  switch (recordType) {
    case 1:
      return { name: 'Credit', textClass: 'text-green-400 bg-green-900' }
      break;
    case 2:
      return { name: 'Debit', textClass: 'text-red-400 bg-red-900' }
      break;
    default:
      return { name: 'Balance', textClass: 'text-white bg-stone-700' }
      break;
  }
}
async function confirmDeletion(record) {
  const deletionIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: 'Please confirm if you want to delete the record. The action is irreversible.',
    buttons: true,
    timer: null,
  });
  if (deletionIsConfirmed) emit('delete-record', record)
}
</script>
