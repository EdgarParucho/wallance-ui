<template>
  <div class="bg-stone-800 text-white font-sans rounded-md md:w-3/6 lg:w-2/6 mt-5">
    <div class="flex justify-between">
      <p class="ml-2 text-stone-300">{{ record.date }}</p>
      <span :class="[recordType(record.type).textClass, 'flex items-center justify-center h-6 w-16 text-sm rounded-sm']">
        {{ recordType(record.type).name }}
      </span>
    </div>
    <div class="justify-end flex items-baseline first-letter:text-2xl my-2 mr-3">
      $<span class="text-3xl">{{ record.amount }}</span>
    </div>
    <p class="ml-2 text-md">{{ record.note }}</p>
    <div class="flex mt-4">
      <button
      class="w-1/2 py-1 text-yellow-500 bg-stone-800 active:bg-stone-800 hover:bg-stone-700 focus:bg-stone-700 focus:outline-none transition-colors"
      @click="formIsOpen = true"
      >
        <PencilSquareIcon class="w-6 mx-auto" aria-hidden="true" />
      </button>
      <button
      class="w-1/2 py-1 text-red-500 bg-stone-800 active:bg-red-800 hover:bg-red-900 focus:bg-red-900 focus:outline-none transition-colors"
      @click="confirmDelete"
      >
        <TrashIcon class="w-6 mx-auto" aria-hidden="true" />
      </button>
    </div>
    <div v-if="markedToDelete" class="flex justify-center space-x-2 text-sm items-center bg-stone-700 text-red-500">
      <InformationCircleIcon class="w-6" aria-hidden="true" />
      <p>This record is being deleted</p>
    </div>
  </div>
  <RecordForm v-if="formIsOpen" :formIsOpen="formIsOpen" @close-form="formIsOpen = false" :editing-record="record" />
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { PencilSquareIcon, TrashIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useRecordStore } from '../../stores/recordStore';
const RecordForm = defineAsyncComponent(() => import('./RecordForm.vue'))

const props = defineProps(['record'])
const recordStore = useRecordStore()
let formIsOpen = ref(false)
const markedToDelete = ref(false)

function confirmDelete() {
  const deleteIsConfirmed = confirm('Please confirm only if you want to delete the selected record, this action is irreversible.')
  if(!deleteIsConfirmed) return
  markedToDelete.value = true
  const queryStatus = recordStore.deleteRecord(props.record._id)
  alert(queryStatus.feedback)
  markedToDelete.value = false
}

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
</script>
