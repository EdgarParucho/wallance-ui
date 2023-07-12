<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div
    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2"
    :class="editing ? 'bg-stone-700' : 'bg-stone-100 dark:bg-indigo-500'"
    >
      <PencilSquareIcon v-if="editing" class="h-6 w-6 text-stone-900 dark:text-yellow-500" aria-hidden="true" />
      <DocumentPlusIcon v-else class="h-6 w-6 text-stone-900 dark:text-white" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium leading-6 text-stone-900 dark:text-white pl-2">
      {{ editing ? 'You are editing an exisiting record' : 'Add a new record' }}
    </h3>
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
              :value="1"
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
              :value="2"
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
                  
        <div class="mt-4 mb-1 flex items-center">
          <label for="fundID" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
            Fund
          </label>
          <select
          id="fundID"
          name="fundID"
          class="w-1/2 bg-transparent border-transparent border-b-stone-300 text-stone-700 dark:text-stone-300 border-stone-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          required
          :disabled="recordIsCredit"
          v-model="record.fundID"
          >
            <option
            class="text-white bg-stone-800 disabled:text-opacity-50"
            v-for="fund in fundStore.funds" :key="fund.id"
            :value="fund.id"
            >
              <span>{{ fund.name }}</span>
            </option>
          </select>
          
        </div>

        <div class="flex justify-end space-x-2" v-if="record.fundID !== ''">
          <small>Balance on date:</small>
          <span class="bg-stone-600 text-sm font-bold rounded-sm px-1">{{ fundBalanceOnDate }}</span>
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
              :disabled="!recordIsCredit && record.fundID === ''"
              :min="recordIsCredit ? 0 : false"
              :max="(recordIsCredit) ? false : 0"
              name="amount"
              id="amount"
              class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-white dark:disabled:text-stone-400 pl-6 text-right"
              placeholder="0.0"
              required
              v-model.number="record.amount"
            >
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

        <div class="my-4">
          <label for="note" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
            Note
          </label>
          <textarea
            type="text"
            name="note"
            id="note"
            class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white"
            maxlength="40"
            placeholder="Car fuel"
            required
            v-model="record.note"
          ></textarea>
        </div>

      </fieldset>

      <div class="bg-stone-50 dark:bg-stone-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
        type="button"
        class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-500 text-white 00 px-4 py-2 text-base font-medium shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        @click="onSave(record, editing)"
        :disabled="loading"
        >
          Save
        </button>
        <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-stone-700 dark:text-white px-4 py-2 text-base font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="$emit('close-form')"
        ref="cancelButtonRef"
        :disabled="loading"
        >
          Cancel
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed, reactive } from 'vue';
import { DocumentPlusIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';
import Dialog from '../helper/Dialog.vue';

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    required: true,
    default: false
  },
  originalRecord: {
    type: Object,
    required: false,
    default: undefined
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

const record = (props.editing)
  ? reactive({ ...props.originalRecord })
  : reactive({
    amount: 0,
    date: null,
    note: null,
    tag: null,
    fundID: null,
    type: 2,
  });

const loading = ref(false);
const recordIsCredit = computed(() => record.type === 1);

const fundBalanceOnDate = computed(() => {
  const fundRecordsUntilDate = recordStore.records.filter(r => r.date < datetime.value && r.fundID === record.fundID);
  const fundBalanceOnDate = fundRecordsUntilDate.reduce((balance, record) => balance + record.amount, 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    roundingIncrement: 5,
  }).format(fundBalanceOnDate);
});

function onSave(record, editing) {
  loading.value = true;
  const action = editing ? recordStore.updateRecord : recordStore.createRecord;
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
};

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
  () => record.type,
  (recordType) => {
    record.fundID = recordType === 1 ? fundStore.defaultFund.id : "";
    record.amount = 0
  }
)
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
  appearance: inherit;
}
</style>
