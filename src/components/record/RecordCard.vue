<template>
  <div class="dark:bg-stone-800 dark:text-white font-sans rounded-md md:w-3/6 lg:w-2/6 mt-5">
    <!-- date -->
    <div class="flex justify-between">
      <p class="ml-2 text-stone-300">{{ record.date }}</p>
      <span class="flex items-center justify-center bg-stone-700 h-6 w-16 text-xl rounded-sm" :title="record.type">
        {{ record.type === 'Credit' ? '+' : '-' }}
      </span>
    </div>
    <div class="justify-end flex items-baseline first-letter:text-2xl my-2">
      $<span class="text-3xl">{{ record.amount }}</span>
    </div>
    <p class="ml-2 text-md">{{ record.note }}</p>
    <div class="flex mt-4">
      <button
      class="bg-stone-800 w-1/2 py-1 hover:bg-stone-700 text-yellow-500 active:bg-stone-800 transition-colors"
      @click="formIsOpen = true"
      >
        <PencilSquareIcon class="w-6 mx-auto" aria-hidden="true" />
      </button>
      <button
      class="bg-stone-800 w-1/2 py-1 hover:bg-red-900 text-red-500 active:bg-stone-800 transition-colors"
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
  <RecordForm :formIsOpen="formIsOpen" @close-form="formIsOpen = false" :editing-record="record" v-if="formIsOpen" />
</template>

<script setup>
import { defineProps, ref, defineAsyncComponent } from 'vue';
import { PencilSquareIcon, TrashIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useRecordStore } from '../../stores/recordStore';
const RecordForm = defineAsyncComponent(() => import('./RecordForm.vue'))

const props = defineProps(['record'])
const recordStore = useRecordStore()
let formIsOpen = ref(false)
const markedToDelete = ref(false)

function confirmDelete() {
  markedToDelete.value = true
  const deleteIsConfirmed = confirm('Please confirm only if you want to delete the selected record, this action is irreversible.')
  if(!deleteIsConfirmed) return
  const queryStatus = recordStore.deleteRecord(props.record._id)
  alert(queryStatus.feedback)
}
</script>
