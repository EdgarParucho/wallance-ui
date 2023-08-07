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

    <form class="p-5 text-white">
      <fieldset>
        <legend class="mx-auto text-lg">Record Data</legend>

        <div class="my-4 flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <input
              id="credit"
              name="credit"
              type="radio"
              class="text-yellow-300 focus:ring-yellow-300 p-2"
              :value="1"
              v-model="record.type"
              required
            >
            <label
              for="credit"
              class="text-md font-medium italic font-serif"
            >
              Credit
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              id="debit"
              name="debit"
              type="radio"
              class="text-yellow-300 focus:ring-yellow-300 p-2"
              :value="2"
              v-model="record.type"
              required
            >
            <label
              for="debit"
              class="text-md font-medium italic font-serif"
            >
              Debit
            </label>
          </div>
        </div>
                  
        <div class="my-4">
          <div class="w-full text-md font-medium italic font-serif">
            <label for="date">
              Date
            </label>
          </div>
          <div class="flex items-center">
            <input
            type="date"
            name="date"
            id="date"
            class="w-1/2 bg-transparent text-white focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
            required
            v-model="formDate"
            >
            <input
            type="time"
            name="time"
            id="time"
            class="w-1/2 bg-transparent text-white focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
            required
            v-model="formTime"
            >
          </div>
        </div>
                
        <div class="mt-4 mb-1 flex items-center">
          <label for="fundID" class="w-1/2 text-md font-medium italic font-serif">
            Fund
          </label>
          <select
          id="fundID"
          name="fundID"
          class="w-1/2 bg-transparent text-white focus:border-transparent focus:border-yellow-300 focus:ring-0 border-white focus:bg-stone-700 transition-colors rounded-sm"
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

        <div class="flex justify-end space-x-2">
          <small>Balance on date:</small>
          <span class="bg-stone-600 text-sm font-bold rounded-sm px-1">{{ formatToCurrency(fundBalanceOnDate) }}</span>
        </div>

        <div class="my-4 flex items-center">
          <label for="amount" class="w-1/2 text-md font-medium italic font-serif">
            Amount
          </label>

          <div class="relative rounded-md w-1/2">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 space-x-2">
              <div :class="[typeStyles, 'p-1 rounded-full']">
                <component class="h-4 w-4" :is="typeIcon" />
              </div>
              <span class="text-white sm:text-md">$</span>
            </div>
            <input
              type="number"
              :disabled="!recordIsCredit && record.fundID === ''"
              :min="0"
              name="amount"
              id="amount"
              class="w-full bg-transparent text-white focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm pl-6 text-right"
              placeholder="0.0"
              required
              v-model.number="amount"
            >
          </div>
        </div>

        <div class="my-4 px-1">
          <div>
            <label for="tag" class="w-1/2 text-md font-medium italic font-serif">
              Tag
            </label>
          </div>
          <div class="flex justify-between">
            <select
            id="tag"
            name="tag"
            class="w-1/2 bg-transparent text-white focus:border-transparent focus:border-yellow-300 focus:ring-0 border-white focus:bg-stone-700 transition-colors rounded-sm"
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
              class="w-5/12 bg-transparent text-white focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
              placeholder="New tag"
              required
              v-model="tagFields.input"
            >
          </div>
        </div>

        <div class="my-4">
          <label for="note" class="w-1/2 text-md font-medium italic font-serif">
            Note
          </label>
          <textarea
            type="text"
            name="note"
            id="note"
            class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-md text-white disabled:text-stone-600 disabled:border-b-stone-600"
            maxlength="100"
            placeholder="Car fuel"
            required
            v-model="record.note"
          ></textarea>
        </div>

      </fieldset>

      <div class="py-3 flex justify-end">
        <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-stone-800 text-white px-4 py-2 text-base font-bold shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="$emit('close-form')"
        ref="cancelButtonRef"
        :disabled="loading"
        >
        Cancel
      </button>
      <button
      type="button"
      class="mt-3 inline-flex w-full justify-center rounded-md bg-yellow-400 text-black px-4 py-2 text-base font-bold shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-stone-700"
      @click="onSave(record, editing)"
      :disabled="loading || formHasErrors"
      >
        Save
      </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed, reactive, inject } from 'vue';
import { DocumentPlusIcon, PencilSquareIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';
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
    default: undefined
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

const formDate = (props.editing)
  ? ref(props.originalRecord.date.slice(0, 10))
  : ref(new Intl.DateTimeFormat("en-UK").format(new Date()).split("/").reverse().join("-"));
const formTime = (props.editing)
  ? ref(new Date(props.originalRecord.date).toTimeString().slice(0, 5))
  : ref(new Date().toTimeString().slice(0, 5));

const tagFields = reactive({
  option: props.editing ? props.originalRecord.tag : "Add new",
  input: null
});
const tags = new Set(recordStore.records.map(record => record.tag));
const amount = (props.editing)
  ? (props.originalRecord.amount < 0) ? ref(-props.originalRecord.amount) : ref(props.originalRecord.amount)
  : ref(1);

  const record = (props.editing)
  ? reactive({ ...props.originalRecord })
  : reactive({
    amount: -1,
    date: null,
    note: null,
    tag: null,
    fundID: null,
    type: 2,
  });

const loading = ref(false);
const recordIsCredit = computed(() => record.type === 1);
const datetime = computed(() => `${formDate.value}T${formTime.value}:01`);

const fundBalanceOnDate = computed(() => {
  if (!record.fundID) return 0.00
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

const typeIcon = computed(() => {
  if (record.type === 1) return PlusIcon
  else return MinusIcon
});

const typeStyles = computed(() => {
  if (record.type === 1) return 'text-green-400 bg-green-900'
  else return 'text-red-400 bg-red-900'
});

const formHasErrors = computed(() => {
  const invalidDate = new Date(datetime.value).toString() === "Invalid Date";
  const invalidAmount = record.amount === 0 || record.amount === "";
  const invalidFundID = record.fundID === "";
  return invalidDate || invalidAmount || invalidFundID;
});
function onSave(record, editing) {
  loading.value = true;
  const action = editing ? recordStore.updateRecord : recordStore.createRecord;
  const body = defineBody(record, editing);
  action(body)
    .then((message) => {
      displayAlert({ title: "Done", type: "success", text: message });
      emit('close-form');
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
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
watch(
  () => amount.value,
  (amountValue) => {
    const multiplier = (record.type === 1) ? 1 : -1;
    record.amount = amountValue * multiplier;
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
