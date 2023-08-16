<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2 bg-stone-700 text-yellow-400">
      <PencilSquareIcon v-if="editing" class="h-6 w-6" aria-hidden="true" />
      <DocumentPlusIcon v-else class="h-6 w-6-400" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium text-white text-center mt-4">
      Record Form
    </h3>
    <p class="text-sm text-white text-center">
      You are <span class="p-1 bg-stone-700 rounded-md">{{ editing ? 'editing' : 'creating' }}</span> a record
    </p>
    <div aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-white" />
      </div>
    </div>

    <form @submit.prevent="save(record)">
      <div class="p-4 w-96">

        <div class="my-4">
          <div class="w-full text-md font-medium text-white italic font-serif">
            <label for="date">
              Date
            </label>
          </div>
          <div class="flex items-center">
            <input
            type="date"
            name="date"
            id="date"
            class="w-1/2 bg-transparent border-transparent border-b-stone-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-md text-white"
            required
            v-model="formDate"
            >
            <input
            type="time"
            name="time"
            id="time"
            class="w-1/2 bg-transparent border-transparent border-b-stone-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-md text-white"
            required
            v-model="formTime"
            >
          </div>
        </div>
        
        <div class="h-1/3">
          <label for="source" class="text-xs font-semibold">Source</label>
          <select id="source" name="source"
            class="px-2 text-white mb-2 bg-transparent w-full rounded-md focus:border-transparent focus:border-yellow-300 focus:ring-0 border-white focus:bg-stone-700 transition-colors"
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
            class="px-2 text-white mb-2 bg-transparent w-full rounded-md border-stone-400 disabled:border-stone-700 focus:outline-0 active:outline-0"
            required :disabled="record.fundID === ''" v-model="record.otherFundID">
            <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="fund in fundStore.funds"
              :key="fund.id" :value="fund.id" :disabled="fund.id === record.fundID">
              {{ fund.name }}
            </option>
          </select>
        </div>

        <div class="grid-flow-col p-2 flex-wrap text-center">
          <ChartPieIcon class="w-5 h-5 text-yellow-500 mx-auto" aria-hidden="true" />
          <button
          v-for="picker, i in amountPickers" :key="i"
          class="text-xs font-bold rounded-xl w-20 m-1 py-1 transition-colors disabled:bg-stone-800 disabled:text-stone-600"
          :class="divisorIsApplied(picker) ? 'bg-yellow-500 hover:bg-yellow-400 text-stone-900' : 'bg-stone-800 text-white hover:bg-stone-700'"
          @click="divideAmount(picker.divisor)"
          type="button"
          :disabled="record.fundID === '' || fundBalanceOnDate === 0"
          >
            {{ picker.name }}
          </button>
        </div>

        <div class="my-4 flex items-center">
          <label for="amount" class="w-1/2 text-md font-medium text-white italic font-serif">
            Amount
          </label>
          <div class="relative rounded-md w-1/2">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 space-x-2">
              <div class="text-white bg-stone-700 p-1 rounded-full">
                <ArrowsRightLeftIcon class="h-4 w-4" />
              </div>
              <span class="text-white sm:text-md">$</span>
            </div>
            <input
            type="number" name="amount" id="amount"
            class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-md text-white pl-6 text-right disabled:text-stone-400"
            placeholder="0.00"
            v-model.number="amount"
            required
            :disabled="record.fundID  === '' || record.otherFundID === ''"
            :min="0">
          </div>
        </div>

        <div class="my-4 px-1">
          <div>
            <label for="tag" class="w-1/2 text-md font-medium text-white italic font-serif">
              Tag
            </label>
          </div>
          <div class="flex justify-between">
            <select
            id="tag"
            name="tag"
            class="w-6/12 bg-transparent border-transparent border-b-stone-300 text-white border-stone-300 py-2 px-3 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
            required
            v-model="tagFields.option"
            >
              <option class="text-white font-bold italic bg-stone-800 disabled:text-opacity-50">
                <span>Add new</span>
              </option>
              <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="tag, i in tagOptions" :key="i">
                {{ tag }}
              </option>
            </select>
            <input
              type="text"
              :disabled="tagFields.option !== 'Add new'"
              class="w-5/12 bg-transparent border-transparent border-b-stone-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-md text-white disabled:text-stone-600 disabled:border-b-stone-600"
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
            class="mt-3 inline-flex w-full justify-center rounded-md text-white bg-stone-800 hover:bg-stone-700 px-4 py-2 text-base font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            type="button" @click="$emit('close-form')">
            Cancel
          </button>
          <button
          class="mt-3 inline-flex w-full justify-center rounded-md bg-yellow-400 text-black px-4 py-2 text-base font-bold shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-stone-800 disabled:text-stone-500"
          type="submit" @click.prevent="onSave(record, editing)"
          :disabled="loading || !formIsValid"
          >
            <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading" class="mx-auto">Processing...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, inject } from 'vue'
import { DocumentPlusIcon, PencilSquareIcon, ChartPieIcon, ArrowsRightLeftIcon } from '@heroicons/vue/24/outline';
import { useFundStore } from '../../stores/fundStore';
import { useRecordStore } from '../../stores/recordStore';
import { storeToRefs } from "pinia";
import Dialog from '../layout/Dialog.vue';

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
const displayAlert = inject("alert");
const recordStore = useRecordStore();
const fundStore = useFundStore();
const { recordTags } = storeToRefs(recordStore);

const loading = ref(false);
const amountPickers = [
  { name: 'All', divisor: 1 },
  { name: '1/2', divisor: 2 },
  { name: '1/3', divisor: 3 }
];

const formDate = (props.editing)
  ? ref(props.originalRecord.date.slice(0, 10))
  : ref(new Intl.DateTimeFormat("en-UK").format(new Date()).split("/").reverse().join("-"));
const formTime = (props.editing)
  ? ref(new Date(props.originalRecord.date).toTimeString().slice(0, 5))
  : ref(new Date().toTimeString().slice(0, 5));

const datetime = computed(() => `${formDate.value}T${formTime.value}:01`);

const tagFields = reactive({
  option: props.editing ? props.originalRecord.tag : "Add new",
  input: null
});

const tagOptions = computed(() => {
  return recordTags.value[0];
});
const amount = (props.editing)
  ? ref(-props.originalRecord.amount)
  : ref(1);
const newRecord = {
  amount: -1,
  date: null,
  note: null,
  tag: null,
  fundID: '',
  otherFundID: '',
  type: 0,
};
const record = reactive(props.editing ? { ...props.originalRecord } : newRecord);

const formIsValid = computed(() => record.fundID !== '' || record.otherFundID !== '');

const fundBalanceOnDate = computed(() => {
  if (!record.fundID) return 0
  const fundRecordsUntilDate = recordStore.records.filter(r => new Date(r.date) < new Date(datetime.value) && (r.fundID === record.fundID || r.otherFundID === record.fundID));
  const fundBalanceOnDate = fundRecordsUntilDate.reduce((balance, r) => {
    const recordAmount = r.fundID === record.fundID ? r.amount : -r.amount;
    return balance + recordAmount;
  }, 0);
  return fundBalanceOnDate;
});

function formatToCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount)
}

function divisorIsApplied({ divisor }) {
  if (record.fundID === "" || record.amount === 0) return false
  const divisorIsApplied = Number(record.amount) === -(fundBalanceOnDate.value / divisor).toFixed(2);
  return divisorIsApplied;
}

function divideAmount(divisor) {
  amount.value = (fundBalanceOnDate.value / divisor)
}

function onSave(record, editing) {
  loading.value = true;
  const action = (editing) ? recordStore.updateRecord : recordStore.createRecord;
  const body = defineBody(record, editing);
  action(body)
    .then((message) => {
      displayAlert({ title: "Done", type: "success", text: message });
      emit('close-form');
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
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

watch(
  () => amount.value,
  (amountValue) => {
    const multiplier = (record.type === 1) ? 1 : -1;
    amount.value = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
    }).format(amountValue)
    record.amount = (amountValue * multiplier);
  }
)
</script>
