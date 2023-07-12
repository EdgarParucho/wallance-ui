<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <form @submit.prevent="save(record)">
      <div class="p-4 w-80">

        <div class="h-1/3">
          <label for="source" class="text-xs font-semibold">Source</label>
          <select id="source" name="source"
            class="px-2 text-stone-50 mb-2 bg-transparent w-full rounded-md border-stone-400 focus:outline-0 active:outline-0"
            required v-model="record.fundID">
            <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="fund in fundStore.funds"
              :key="fund.id" :value="fund.id">
              {{ fund.name }}
            </option>
          </select>
          <div class="flex justify-end space-x-2" v-if="record.fundID !== ''">
            <small>Balance on date:</small>
            <span class="bg-stone-600 text-sm font-bold rounded-sm px-1">{{ formatToCurrency(fundBalanceOnDate) }}</span>
          </div>
        </div>

        <div class="h-1/3">
          <label for="target" class="text-xs font-semibold">Target</label>
          <select id="target" name="target"
            class="px-2 text-stone-50 mb-2 bg-transparent w-full rounded-md border-stone-400 disabled:border-stone-700 focus:outline-0 active:outline-0"
            required :disabled="record.fundID === ''" v-model="record.otherFundID">
            <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="fund in fundStore.funds"
              :key="fund.id" :value="fund.id" :disabled="fund.id === record.fundID">
              {{ fund.name }}
            </option>
          </select>
        </div>

        <div class="grid-flow-col p-2 bg-stone-800 flex-wrap">
          <ChartPieIcon class="w-5 h-5 text-yellow-500 mx-auto" aria-hidden="true" />
          <button v-for="picker, i in amountPickers" :key="i"
            class="text-xs font-bold rounded-xl w-20 m-1 py-1 transition-colors disabled:text-opacity-50"
            :class="divisorIsApplied(picker) ? 'bg-yellow-500 hover:bg-yellow-400 text-stone-900' : 'bg-stone-900 text-white hover:bg-stone-700'"
            @click="divideAmount(picker.divisor)" type="button" :disabled="record.fundID === ''"  
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
              placeholder="0.00" v-model.number="record.amount" required :disabled="record.fundID  === null || record.otherFundID === null"
              :max="0">
          </div>
        </div>

        <div class="my-4">
          <div class="w-full text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
            <label for="date">
              Date
            </label>
          </div>
          <div class="flex items-center">
            <input
            type="date"
            name="date"
            id="date"
            class="w-1/2 bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white"
            required
            v-model="formDate"
            >
            <input
            type="time"
            name="time"
            id="time"
            class="w-1/2 bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white"
            required
            v-model="formTime"
            >
          </div>
        </div>
                
        <div class="my-4 px-1">
          <div>
            <label for="tag" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
              Tag
            </label>
          </div>
          <div class="flex justify-between">
            <select
            id="tag"
            name="tag"
            class="w-6/12 bg-transparent border-transparent border-b-stone-300 text-stone-700 dark:text-stone-300 border-stone-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            required
            v-model="tagFields.option"
            >
              <option class="text-white font-bold italic bg-stone-800 disabled:text-opacity-50">
                <span>Add new</span>
              </option>
              <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="tag, i in tags" :key="i">
                {{ tag }}
              </option>
            </select>
            <input
              type="text"
              :disabled="tagFields.option !== 'Add new'"
              class="w-5/12 bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-white disabled:text-stone-600 disabled:border-b-stone-600"
              placeholder="New tag"
              required
              v-model="tagFields.input"
            >
          </div>
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
import { ref, reactive, computed, watch } from 'vue'
import { useFundStore } from '../../stores/fundStore';
import { ChartPieIcon } from '@heroicons/vue/24/outline'
import Dialog from '../helper/Dialog.vue';
import { useRecordStore } from '../../stores/recordStore';

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
});
const emit = defineEmits(['close-form']);
const recordStore = useRecordStore();
const fundStore = useFundStore();

const loading = ref(false);
const amountPickers = [
  { name: 'All', divisor: 1 },
  { name: '1/2', divisor: 2 },
  { name: '1/3', divisor: 3 }
];

const formDate = (props.editing)
  ? ref(props.originalRecord.date.slice(0, 10))
  : ref(new Date().toISOString().slice(0, 10));
const formTime = (props.editing)
  ? ref(new Date(props.originalRecord.date).toTimeString().slice(0, 5))
  : ref(new Date().toTimeString().slice(0, 5));

const datetime = computed(() => `${formDate.value}T${formTime.value}:01`);

const tagFields = reactive({
  option: props.editing ? props.originalRecord.tag : "Add new",
  input: null
});

const tags = new Set(recordStore.records.map(record => record.tag));
const newRecord = {
  amount: 0,
  date: null,
  note: null,
  tag: null,
  fundID: '',
  otherFundID: '',
  type: 0,
};
const record = reactive(props.editing ? { ...props.originalRecord } : newRecord);

const someFieldIsRequired = computed(() => {
  return record.fundID === '' || record.otherFundID === ''
});

const fundBalanceOnDate = computed(() => {
  const fundRecordsUntilDate = recordStore.records.filter(r => r.date < datetime.value && r.fundID === record.fundID);
  const fundBalanceOnDate = fundRecordsUntilDate.reduce((balance, record) => balance + record.amount, 0);
  return fundBalanceOnDate;
});

function formatToCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    roundingIncrement: 5,
  }).format(amount)
}
function divisorIsApplied({ divisor }) {
  if (record.fundID === "") return false
  const divisorIsApplied = record.amount === -Math.floor(fundBalanceOnDate.value / divisor);
  return divisorIsApplied;
}

function divideAmount(divisor) {
  console.log(fundBalanceOnDate.value);
  record.amount = -Math.floor(Number(fundBalanceOnDate.value) / divisor)
}

function onSave(record, editing) {
  loading.value = true;
  const action = (editing) ? recordStore.updateRecord : recordStore.createRecord;
  const body = defineBody(record, editing);
  action(body)
    .then((message) => {
      alert(message);
      emit('close-form');
    })
    .catch((message) => {
      alert(message);
      loading.value = false;
    })
}

function defineBody(record, editing) {
  record.date = new Date(datetime.value).toISOString();
  if (record.note === null) delete record.note;
  if (tagFields.option === "Add new" && tagFields.input === null) delete record.tag;
  else record.tag = tagFields.input || tagFields.option;
  if (!editing) return { body: record };

  const keys = Object.keys(record);
  const entries = [];
  const valueUpdated = (key) => record[key] !== props.originalRecord[key]
  for (const key of keys) if (valueUpdated(key)) entries.push([key, record[key]])
  const body = Object.fromEntries(entries);
  const { id } = props.originalRecord;
  return { id, body };
}

watch(
  () => tagFields.option,
  (tagOption) => {
    if (tagOption !== "Add new") tagFields.input = null;
  }
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
