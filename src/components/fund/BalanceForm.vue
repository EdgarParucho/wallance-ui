<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <form @submit.prevent="handleSubmit(record)">
      <div class="p-4">

        <div class="h-1/3">
          <label for="source" class="text-xs font-semibold">Source</label>
          <select id="source" name="source"
            class="px-2 text-stone-50 mb-2 bg-transparent w-full rounded-md border-stone-400 focus:outline-0 active:outline-0"
            required v-model="record.sourceID">
            <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="fund in fundStore.funds"
              :key="fund._id" :value="fund._id" :disabled="fund.savings < 1">
              {{ fund.name }} (${{ fund.savings }})
            </option>
          </select>
        </div>

        <div class="h-1/3">
          <label for="target" class="text-xs font-semibold">Target</label>
          <select id="target" name="target"
            class="px-2 text-stone-50 mb-2 bg-transparent w-full rounded-md border-stone-400 disabled:border-stone-700 focus:outline-0 active:outline-0"
            required :disabled="record.sourceID === null" v-model="record.targetID">
            <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="fund in fundStore.funds"
              :key="fund._id" :value="fund._id" :disabled="fund._id === record.sourceID">
              {{ fund.name }} (${{ fund.savings }})
            </option>
          </select>
        </div>

        <div class="grid-flow-col p-2 bg-stone-800 flex-wrap">
          <ChartPieIcon class="w-5 h-5 text-yellow-500 mx-auto" aria-hidden="true" />
          <button v-for="picker, i in amountPickers" :key="i"
            class="text-xs font-bold rounded-xl w-20 m-1 py-1 transition-colors disabled:text-opacity-50"
            :class="pickerIsApplied(picker) ? 'bg-yellow-500 hover:bg-yellow-400 text-stone-900' : 'bg-stone-900 text-white hover:bg-stone-700'"
            @click="useAmountPicker(picker.divisor)" type="button" :disabled="record.sourceID === null">
            {{ picker.name }}
          </button>
        </div>

        <div class="my-4 flex items-center">
          <label for="amount" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
            Amount
          </label>
          <div class="relative rounded-md w-1/2">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span class="text-stone-500 dark:text-white sm:text-md">$</span>
            </div>
            <input type="number" name="amount" id="amount"
              class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white pl-6 text-right"
              placeholder="0.00" v-model.number="record.amount" required :min="1" :disabled="record.sourceID === null"
              :max="sourceFund.savings">
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

        <div class="h-1/3">
          <label for="note" class="text-xs font-semibold">Note</label>
          <textarea id="note"
            class="text-sm text-stone-200 bg-transparent w-full border-0 border-b focus:outline-0 active:outline-0 focus:ring-0 active:ring-0"
            placeholder="A creative description" maxlength="80" v-model="record.note" />
        </div>

        <div class="h-1/3 flex items-center justify-end my-4 space-x-2">
          <button
            class="text-white bg-transparent hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 rounded-md text-sm w-1/3 py-2 transition-colors"
            type="button" @click="$emit('close-form')">
            Cancel
          </button>
          <button
            class="text-yellow-400 bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold rounded-md text-sm w-1/3 py-2 transition-colors disabled:text-stone-300 disabled:bg-stone-700"
            type="submit" @click.prevent="handleSubmit(record)">
            Save
          </button>
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFundStore } from '../../stores/fundStore';
import { ChartPieIcon } from '@heroicons/vue/24/outline'
import Dialog from '../helper/Dialog.vue';
import { useRecordStore } from '../../stores/recordStore';

const fundStore = useFundStore()
const emit = defineEmits(['close-form'])
const props = defineProps(['form-is-open'])
const recordStore = useRecordStore()

const queryInProgress = ref(false)
const sourceFund = ref({})
const record = ref({
  amount: 1,
  date: new Date().toISOString().slice(0, 10),
  note: '',
  sourceID: null,
  targetID: null,
  type: 0
})

const amountPickers = [
  { name: 'All', divisor: 1 },
  { name: '1/2', divisor: 2 },
  { name: '1/3', divisor: 3 }
]

function useAmountPicker(divisor) {
  record.value.amount = (sourceFund.value.savings / divisor)
}

function pickerIsApplied({ divisor }) {
  const pickerIsApplied = (record.value.amount === (sourceFund.value.savings / divisor))
  return pickerIsApplied
}

function handleSubmit(record) {
  queryInProgress.value = true
  const queryStatus = recordStore.createRecord(record)
  alert(queryStatus.message)
  queryInProgress.value = false
  if(queryStatus.succeed) emit('close-form')
}

function fixFormIncoherences(sourceID) {
  if (record.value.targetID === sourceID) record.value.targetID = null
  sourceFund.value = fundStore.funds.find(f => f._id === sourceID)
  record.value.amount = 1
}

watch(
  () => record.value.sourceID,
  (sourceID) => fixFormIncoherences(sourceID)
)
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
