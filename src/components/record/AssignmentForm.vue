<template>
  <Dialog
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  :icon="editing ? PencilSquareIcon : DocumentPlusIcon"
  title="Record Form"
  :subtitle="`You are ${editing ? 'editing' : 'creating'} a record`"
  >
    <form @submit.prevent="save(record)">
      <div class="p-4">

        <div class="my-4 space-y-2 text-left px-1">
          <label for="date" class="text-xs font-semibold">
            Date
          </label>
          <div class="flex items-center">
            <input
            type="date"
            name="date"
            id="date"
            class="w-1/2 bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-white transition-colors rounded-sm"
            required
            v-model="formDate"
            >
            <input
            type="time"
            name="time"
            id="time"
            class="w-1/2 bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-white transition-colors rounded-sm"
            required
            v-model="formTime"
            >
          </div>
        </div>
        
        <div class="my-4 space-y-2 text-left px-1">
          <label for="source" class="text-xs font-semibold">Source</label>
          <select id="source" name="source"
            class="px-2 mb-2 bg-transparent w-full rounded-md focus:border-transparent focus:border-violet-500 focus:ring-0 border-stone-500 dark:border-white transition-colors"
            required v-model="record.fundID">
            <option
            class="text-white bg-stone-800 disabled:text-opacity-50"
            v-for="fund in fundStore.funds"
            :key="fund.id" :value="fund.id">
              {{ fund.name }}
            </option>
          </select>
          <div class="flex items-center justify-end space-x-2" v-if="record.fundID !== ''">
            <small class="text-left w-1/3 text-xs font-semibold">Balance on date:</small>
            <span class="text-white bg-stone-600 text-sm font-bold rounded-sm px-1">{{ amountFormatted(fundBalanceOnDate) }}</span>
          </div>
        </div>

        <div class="my-4 space-y-2 text-left px-1">
          <label for="target" class="text-xs font-semibold">Target</label>
          <select id="target" name="target"
            class="px-2 mb-2 bg-transparent w-full rounded-md focus:border-transparent focus:border-violet-500 focus:ring-0 border-stone-500 dark:border-white transition-colors"
            required :disabled="record.fundID === ''" v-model="record.otherFundID">
            <option
            class="text-white bg-stone-800 disabled:text-opacity-50"
            v-for="fund in fundStore.funds"
            :key="fund.id" :value="fund.id" :disabled="fund.id === record.fundID">
              {{ fund.name }}
            </option>
          </select>
        </div>

        <div class="grid-flow-col p-2 flex-wrap text-center">
          <ChartPieIcon class="w-5 h-5 text-violet-500 mx-auto" aria-hidden="true" />
          <button
          v-for="picker, i in amountPickers" :key="i"
          class="text-xs font-bold rounded-xl w-20 m-1 py-1 transition-colors text-white disabled:bg-stone-300 dark:disabled:bg-stone-800 dark:disabled:text-stone-600 disabled:text-stone-400 focus:border-transparent focus:ring-violet-500 focus:ring-2 focus:outline-0"
          :class="divisorIsApplied(picker) ? 'bg-violet-600 hover:bg-violet-500' : 'bg-stone-800 hover:bg-stone-700'"
          @click="divideAmount(picker.divisor)"
          type="button"
          :disabled="record.fundID === '' || fundBalanceOnDate === 0"
          >
            {{ picker.name }}
          </button>
        </div>

        <div class="my-4 flex text-left items-center">
          <label for="amount" class="w-1/2 text-xs font-semibold">
            Amount
          </label>
          <div class="relative rounded-md w-1/2">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 space-x-2">
              <div class="p-1 text-stone-500 bg-stone-600 bg-opacity-20 rounded-full">
                <ArrowsRightLeftIcon class="h-4 w-4" />
              </div>
              <span class="sm:text-md">$</span>
            </div>
            <input
            type="number" name="amount" id="amount"
            class="w-full bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-white transition-colors rounded-sm pl-6 text-right"
            placeholder="0.00"
            v-model.number.lazy="formAmount"
            required
            :disabled="record.fundID  === '' || record.otherFundID === ''"
            :min="0">
          </div>
        </div>

        <div class="my-4 text-left items-center">
          <label for="tag" class="w-1/2 text-xs font-semibold">
            Tag
          </label>
          <div class="flex justify-between">
            <select
            id="tag"
            name="tag"
            class="w-1/2 bg-transparent focus:border-violet-500 focus:ring-0 border-stone-500 dark:border-white rounded-sm"
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
              class="w-5/12 bg-transparent border-transparent border-b-stone-300 focus:border-transparent focus:border-b-violet-500 focus:ring-0 sm:text-md disabled:text-stone-600 disabled:border-b-stone-600"
              placeholder="New tag"
              required
              v-model="tagFields.input"
            >
          </div>
        </div>

        <div class="my-4 text-left items-center">
          <label for="note" class="text-xs font-semibold">Note</label>
          <textarea id="note"
            class="text-sm bg-transparent w-full border-0 border-b focus:outline-0 active:outline-0 focus:ring-0 active:ring-0"
            placeholder="A creative description" maxlength="80" v-model="record.note" required
          />
        </div>

        <div class="h-1/3 flex items-center justify-end my-4 space-x-2">
          <button
          class="mt-3 inline-flex w-full justify-center rounded-md px-4 py-2 text-base font-bold shadow-sm bg-stone-300 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          type="button" @click="$emit('close-form')">
            Cancel
          </button>
          <button
          class="mt-3 inline-flex space-x-1 w-full justify-center rounded-md px-4 py-2 text-base font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm hover:bg-violet-500 bg-violet-600 text-white disabled:bg-stone-300 dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
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
const formAmount = (props.editing)
  ? ref(-props.originalRecord.amount)
  : ref(1);
const record = reactive(props.editing ? { ...props.originalRecord } : {
  amount: -1,
  date: null,
  note: null,
  tag: null,
  fundID: '',
  otherFundID: '',
  type: 0,
});

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

function amountFormatted(amount) {
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

function divisorIsApplied({ divisor }) {
  if (record.fundID === "" || record.amount === 0) return false
  const divisorIsApplied = Number(record.amount) === -(fundBalanceOnDate.value / divisor).toFixed(2);
  return divisorIsApplied;
}

function divideAmount(divisor) {
  formAmount.value = (fundBalanceOnDate.value / divisor)
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
  () => formAmount.value,
  (amountValue) => {
    const multiplier = (record.type === 1) ? 1 : -1;
    record.amount = (amountValue * multiplier);
    const integer = Math.floor(amountValue);
    const fractions = amountValue
      .toString()
      .split('.')[1] || "0";
    const recomposed = [integer, fractions.slice(0, 2)].join(".")
    formAmount.value = recomposed
  }
)
</script>
