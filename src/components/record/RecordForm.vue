<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="$emit('closeForm')">
      <TransitionChild
      as="template"
      enter="ease-out duration-300"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="ease-in duration-200"
      leave-from="opacity-100"
      leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-stone-500 dark:bg-stone-900 bg-opacity-25 transition-opacity"></div>
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg- dark:bg-stone-800 text-left shadow-xl transition-all sm:my-8 p-2">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 dark:bg-indigo-500 sm:mx-0 sm:h-10 sm:w-10 mb-2">
                <DocumentPlusIcon class="h-6 w-6 text-stone-900 dark:text-white" aria-hidden="true" />
              </div>
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-stone-900 dark:text-white pl-2">
                Add a new record
              </DialogTitle>
              <p class="text-sm text-stone-500 dark:text-stone-300 pl-2">
                It's safe to consider records as financial movements.
              </p>
              <div aria-hidden="true">
                <div class="py-5">
                  <div class="border-t border-stone-400" />
                </div>
              </div>
              <form class="p-5">
                <fieldset>
                  <legend class="mx-auto text-stone-700 dark:text-stone-300 text-lg">Record Data</legend>

                  <div class="my-4 flex items-center space-x-6">
                    <div class="flex items-center space-x-2">
                      <input
                        id="credit"
                        name="credit"
                        type="radio"
                        class="border-stone-300 text-indigo-600 focus:ring-indigo-500 p-2"
                        value="Credit"
                        v-model="record.type"
                        required
                      >
                      <label
                        for="credit"
                        class="text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif"
                      >
                        Credit
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input
                        id="debit"
                        name="debit"
                        type="radio"
                        class="border-stone-300 text-indigo-600 focus:ring-indigo-500 p-2"
                        value="Debit"
                        v-model="record.type"
                        required
                      >
                      <label
                        for="debit"
                        class="text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif"
                      >
                        Debit
                      </label>
                    </div>
                  </div>
                  
                  <div class="my-4 flex items-center">
                    <label for="amount" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
                      Amount
                    </label>
                    <div class="relative rounded-md w-1/2">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span class="text-stone-500 dark:text-white sm:text-md">$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        name="amount"
                        id="amount"
                        class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white pl-6 text-right"
                        placeholder="0.00"
                        v-model.number="record.amount"
                        required
                      >
                    </div>
                  </div>

                  <div class="my-4 flex items-center">
                    <label for="date" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      class="w-1/2 bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white"
                      v-model="record.date"
                      required
                    >
                  </div>
                
                  <div class="my-4 flex items-center">
                    <label for="note" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
                      Note (Optional)
                    </label>
                    <input
                      type="text"
                      name="note"
                      id="note"
                      class="w-1/2 bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white"
                      maxlength="30"
                      placeholder="Car fuel"
                      v-model="record.note"
                    >
                  </div>
                
                  <div class="my-4 flex items-center">
                    <label for="sourceID" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
                      Source
                    </label>
                    <select
                      id="sourceID"
                      name="sourceID"
                      class="w-1/2 bg-transparent border-transparent border-b-stone-300 text-stone-700 dark:text-stone-300 border-stone-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      v-model="record.sourceID"
                      required
                    >
                      <option
                      class="text-stone-600"
                      v-for="source in sourceOptions"
                      :key="source.id"
                      :value="source.id"
                      >
                        {{ source.name }}
                      </option>
                    </select>
                  </div>
                </fieldset>
                <div class="bg-stone-50 dark:bg-stone-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-500 text-white 00 px-4 py-2 text-base font-medium shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="handleSubmit"
                  :disabled="queryInProgress"
                  >
                    Save
                  </button>
                  <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-stone-700 dark:text-white px-4 py-2 text-base font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="$emit('closeForm')"
                  ref="cancelButtonRef"
                  :disabled="queryInProgress"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { useRecordStore } from '../../stores/recordStore';
import { DocumentPlusIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({ open: Boolean })
const recordStore = useRecordStore()
const emit = defineEmits(['closeForm'])

let queryInProgress = ref(false)
let record = ref({
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  note: '',
  sourceID: '1',
  type: 'Credit'
})
const sourceOptions = [
  { id: '1', name: 'Main' },
  { id: '2', name: 'Secondary' },
  { id: '3', name: 'Occassional' },
]

function resetForm() {
  record.value = {
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    note: '',
    sourceID: '1',
    type: 'Credit'
  }
}
function handleSubmit() {
  queryInProgress.value = true
  const queryStatus = recordStore.addRecord(record.value)
  alert(queryStatus.feedback)
  queryInProgress.value = false
  resetForm()
  if(queryStatus.succeed) emit('closeForm')
}
</script>

<style scoped>
/* Remove the default arrows from input number fields */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

/* Invert the default white color from input date fields icon */
::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>
