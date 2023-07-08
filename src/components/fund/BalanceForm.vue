<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <form @submit.prevent="save(record)">
      <div class="p-4 w-80">

        <div class="h-1/3">
          <label for="source" class="text-xs font-semibold">Source</label>
          <select id="source" name="source"
            class="px-2 text-stone-50 mb-2 bg-transparent w-full rounded-md border-stone-400 focus:outline-0 active:outline-0"
            required v-model="record.sourceID">
            <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="fund in fundStore.funds"
              :key="fund._id" :value="fund._id" :disabled="fund.balance < 1">
              {{ fund.name }} (${{ fund.balance }})
            </option>
          </select>
        </div>

        <div class="h-1/3">
          <label for="target" class="text-xs font-semibold">Target</label>
          <select id="target" name="target"
            class="px-2 text-stone-50 mb-2 bg-transparent w-full rounded-md border-stone-400 disabled:border-stone-700 focus:outline-0 active:outline-0"
            required :disabled="record.sourceID === ''" v-model="record.targetID">
            <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="fund in fundStore.funds"
              :key="fund._id" :value="fund._id" :disabled="fund._id === record.sourceID">
              {{ fund.name }} (${{ fund.balance }})
            </option>
          </select>
        </div>

        <div class="grid-flow-col p-2 bg-stone-800 flex-wrap">
          <ChartPieIcon class="w-5 h-5 text-yellow-500 mx-auto" aria-hidden="true" />
          <button v-for="picker, i in amountPickers" :key="i"
            class="text-xs font-bold rounded-xl w-20 m-1 py-1 transition-colors disabled:text-opacity-50"
            :class="pickerIsApplied(picker) ? 'bg-yellow-500 hover:bg-yellow-400 text-stone-900' : 'bg-stone-900 text-white hover:bg-stone-700'"
            @click="useAmountPicker(picker.divisor)" type="button" :disabled="record.sourceID === ''"  
          >
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
              :max="sourceFund?.balance">
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
            placeholder="A creative description" maxlength="80" v-model="record.note" required />
        </div>

        <div class="h-1/3 flex items-center justify-end my-4 space-x-2">
          <button
            class="text-white bg-transparent hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 rounded-md text-sm w-1/3 py-2 transition-colors"
            type="button" @click="$emit('close-form')">
            Cancel
          </button>
          <button
            class="text-yellow-400 bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold rounded-md text-sm w-1/3 py-2 transition-colors disabled:text-stone-300 disabled:bg-stone-700"
            type="submit" @click.prevent="onSave(record, editing)"
            :disabled="loading || someFieldIsRequired">
            Save
          </button>
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFundStore } from '../../stores/fundStore';
import { ChartPieIcon } from '@heroicons/vue/24/outline'
import Dialog from '../helper/Dialog.vue';
import { useRecordStore } from '../../stores/recordStore';
import { useAccountStore } from '../../stores/accountStore';

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    required: true,
    default: false
  },
  originalRecord: {
    type: Object,
    required: false,
  },
  editing: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['close-form'])
const recordStore = useRecordStore()
const fundStore = useFundStore()
const accountStore = useAccountStore()

const userID = accountStore.userID;
const loading = ref(false)
const amountPickers = [
  { name: 'All', divisor: 1 },
  { name: '1/2', divisor: 2 },
  { name: '1/3', divisor: 3 }
]

const newRecord = {
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  note: '',
  sourceID: '',
  targetID: '',
  type: 0,
  user: userID
}
const record = reactive(props.editing ? { ...props.originalRecord } : newRecord)

const sourceFund = computed(() => findFundByID(record.sourceID))
const someFieldIsRequired = computed(() => {
  return record.amount <= 0 || record.note === '' || record.sourceFund === '' || record.targetID === ''
})

function pickerIsApplied({ divisor }) {
  if (sourceFund.value === undefined) return false
  const pickerIsApplied = (record.amount === (sourceFund.value.balance / divisor))
  return pickerIsApplied
}

function findFundByID(fundID) {
  return fundStore.funds.find(fund => fund._id === fundID)
}

function useAmountPicker(divisor) {
  record.amount = (sourceFund.value.balance / divisor)
}

function onSave(record, editing) {
  loading.value = true;
  const actions = defineActions(record, editing);
  const unbalancedFund = actions.onFund.find(action => action.data.body.balance < 0);
  if (unbalancedFund !== undefined) return alert('Cannot update. A fund would result in a negative balance.');
  const makePromises = (actions) => Array.from(actions, ({ action, data }) => action(data));
  Promise.all(makePromises([...actions.onRecord, ...actions.onFund]))
    .then((responses) => {
      const message = responses.join('\n');
      alert(message);
      emit('close-form');
    })
    .catch((response) => {
      alert(response);
      loading.value = false;
    })
}

function defineActions(record, editing) {
  const actions = { onRecord: [], onFund: [] };

  actions.onRecord.push({
    action: (editing) ? recordStore.updateRecord : recordStore.createRecord,
    data: (editing) ? { userID, _id: record._id, body: updatesInRecord() } : record 
  });

  const fundsToUpdate = defineFundsToUpdate(record, editing)
  for (const fundToUpdate of fundsToUpdate) {
    const { _id, balance } = fundToUpdate;
    actions.onFund.push({ action: fundStore.updateFund, data: { userID, _id, body: { balance } } })
  }
  return actions
}

function defineFundsToUpdate(record, editing) {
  const fundsToUpdate = editing ? reversedFunds() : [];
  const sourceFund = findFundByID(record.sourceID);
  const targetFund = findFundByID(record.targetID);
  
  const notAlreadyIncluded = ({ _id }) => fundsToUpdate.find(fundToUpdate => fundToUpdate._id === _id) === undefined;
  if (notAlreadyIncluded(sourceFund)) fundsToUpdate.push({ ...sourceFund });
  if (notAlreadyIncluded(targetFund)) fundsToUpdate.push({ ...targetFund });

  fundsToUpdate.forEach(applyNewRecordEffect);
  return fundsToUpdate
}

const applyNewRecordEffect = (fundToUpdate) => {
  if (record.sourceID === fundToUpdate._id) fundToUpdate.balance -= record.amount
  if (record.targetID === fundToUpdate._id) fundToUpdate.balance += record.amount
}

const reversedFunds = () => {
  const originalSource = findFundByID(props.originalRecord.sourceID)
  const originalTarget = findFundByID(props.originalRecord.targetID)
  const reversedSource = { ...originalSource, balance: originalSource.balance + props.originalRecord.amount }
  const reversedTarget = { ...originalTarget, balance: originalTarget.balance - props.originalRecord.amount }
  return [reversedSource, reversedTarget]
}

function updatesInRecord() {
  const keys = Object.keys(record);
  const entries = [];
  for (const key of keys) if (props.originalRecord[key] !== record[key]) entries.push([key, record[key]])
  const updates = Object.fromEntries(entries);
  return updates
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
