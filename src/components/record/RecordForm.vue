<template>
  <Dialog
  @close-form="$emit('close-form')"
  :form-is-open="formIsOpen"
  :icon="editing ? PencilSquareIcon : DocumentPlusIcon"
  title="Record Form"
  :subtitle="`You are ${editing ? 'editing' : 'creating'} a record`"
  >
    <form class="p-5 w-full">
      <fieldset>
        <div class="my-4 space-y-2 text-left px-1">
          <div class="w-full">
            <label for="date" class="text-xs font-semibold">
              Date
            </label>
          </div>
          <div class="flex items-center">
            <input
            type="date"
            name="date"
            id="date"
            class="w-1/2 bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-stone-600 dark:border-b-white transition-colors rounded-sm"
            required
            v-model="formDate"
            >
            <input
            type="time"
            name="time"
            id="time"
            class="w-1/2 bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-stone-600 dark:border-b-white transition-colors rounded-sm"
            required
            v-model="formTime"
            >
          </div>
        </div>

        <div class="my-4 flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <input
              id="credit"
              name="credit"
              type="radio"
              class=" text-violet-500 focus:ring-violet-500 p-2"
              :value="1"
              v-model="record.type"
              required
            >
            <label for="credit" class="text-xs font-semibold">
              Credit
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              id="debit"
              name="debit"
              type="radio"
              class=" text-violet-500 focus:ring-violet-500 p-2"
              :value="2"
              v-model="record.type"
              required
            >
            <label for="debit" class="text-xs font-semibold">
              Debit
            </label>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <label for="fundID" class="text-left w-1/3 text-xs font-semibold">
            Fund
          </label>
          <select
          id="fundID"
          name="fundID"
          class="w-2/3 bg-transparent focus:border-transparent focus:ring-0 rounded-sm border-stone-500 dark:border-white focus:border-violet-500"
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

        <div class="flex items-center justify-end space-x-2 mt-2">
          <small class="text-left w-1/3 text-xs font-semibold">Balance on date:</small>
          <span class="text-white bg-stone-600 text-sm font-bold rounded-sm px-1">{{ amountFormatted(fundBalanceOnDate) }}</span>
        </div>

        <div class="my-4 flex items-center">
          <label for="amount" class="text-left w-1/3 text-xs font-semibold">
            Amount
          </label>

          <div class="relative rounded-md w-2/3">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 space-x-2">
              <div :class="[typeStyles, 'p-1 rounded-full']">
                <component class="h-4 w-4" :is="typeIcon" />
              </div>
              <span class="sm:text-md">$</span>
            </div>
            <input
              type="number"
              :disabled="!recordIsCredit && record.fundID === ''"
              :min="0"
              id="amount"
              class="w-full bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-stone-600 dark:border-b-white transition-colors rounded-sm pl-6 text-right"
              placeholder="0.0"
              required
              v-model.number.lazy="formAmount"
            >
          </div>
        </div>

        <div class="my-4 space-y-2 text-left px-1">
          <label for="tag" class="text-xs font-semibold">
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
              <option class="text-white bg-stone-600 disabled:text-opacity-50 font-medium">
                <span>Add new</span>
              </option>
              <option class="text-white bg-stone-800 disabled:text-opacity-50" v-for="tag, i in tagOptions" :key="i">
                {{ tag }}
              </option>
            </select>
            <input
              type="text"
              :disabled="tagFields.option !== 'Add new'"
              class="w-5/12 bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-stone-600 dark:border-b-white transition-colors rounded-sm"
              placeholder="New tag"
              required
              v-model="tagFields.input"
            >
          </div>
        </div>

        <div class="my-4 space-y-2 text-left px-1">
          <label for="note" class="text-xs font-semibold">
            Note
          </label>
          <textarea
            type="text"
            name="note"
            id="note"
            class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-violet-500 focus:ring-violet-500 sm:text-md disabled:text-stone-600 disabled:border-b-stone-600"
            maxlength="100"
            placeholder="Car fuel"
            required
            v-model="record.note"
          ></textarea>
        </div>

      </fieldset>

      <div class="h-1/3 flex items-center justify-end my-4 space-x-2">
        <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md px-4 py-2 text-base font-bold shadow-sm bg-stone-300 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="$emit('close-form')"
        ref="cancelButtonRef"
        :disabled="loading"
        >
        Cancel
      </button>
      <button
      type="button"
      class="mt-3 inline-flex w-full justify-center rounded-md px-4 py-2 text-base font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm hover:bg-violet-500 bg-violet-600 text-white disabled:bg-stone-300 dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
      @click="onSave(record, editing)"
      :disabled="loading || formHasErrors"
      >
        <svg
        v-if="loading"
        class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-if="loading" class="mx-auto">Processing...</span>
        <span v-else>Save</span>
      </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed, reactive, inject } from 'vue';
import { DocumentPlusIcon, PencilSquareIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useRecordStore } from '../../stores/recordStore';
import { useAccountStore } from '../../stores/accountStore';
import { useFundStore } from '../../stores/fundStore';
import { storeToRefs } from "pinia";
import Dialog from '../layout/Dialog.vue';

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    required: true,
    default: false
  },
  presetData: {
    type: Object,
    required: false,
    default: undefined
  },
  editing: {
    type: Boolean,
    required: false,
    default: false
  },
  followingStep: {
    type: Number,
    required: false,
    default: null
  }
});
const emit = defineEmits(['close-form']);
const displayAlert = inject("alert");
const recordStore = useRecordStore();
const accountStore = useAccountStore();
const fundStore = useFundStore();
const { recordTags } = storeToRefs(recordStore);
const { preferences } = storeToRefs(accountStore);

const formDate = (props.presetData !== undefined)
  ? ref(props.presetData.date.slice(0, 10))
  : ref(new Intl.DateTimeFormat("en-UK").format(new Date()).split("/").reverse().join("-"));
const formTime = (props.presetData !== undefined)
  ? ref(new Date(props.presetData.date).toTimeString().slice(0, 5))
  : ref(new Date().toTimeString().slice(0, 5));

const tagFields = reactive({
  option: (props.presetData !== undefined && props.followingStep === null) ? props.presetData.tag : "Add new",
  input: (props.followingStep !== null) ? props.presetData.tag : null
});
const tagOptions = computed(() => {
  return recordTags.value[record.type];
});

const formAmount = (props.presetData !== undefined)
  ? (props.presetData.amount < 0) ? ref(-props.presetData.amount) : ref(props.presetData.amount)
  : ref(1);

const record = (props.presetData !== undefined) ? reactive({ ...props.presetData }) : reactive({
  amount: -1,
  date: null,
  note: null,
  tag: null,
  fundID: "",
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

const typeIcon = computed(() => {
  if (record.type === 1) return PlusIcon
  else return MinusIcon
});

const typeStyles = computed(() => {
  if (record.type === 1) return 'text-green-50 bg-green-700'
  else return 'text-red-50 bg-red-700'
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
    })
    .then(() => {
      if (props.followingStep !== null) updateFirstStepsPreferences();
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => {
      loading.value = false
      emit('close-form');
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
  const valueUpdated = (key) => record[key] !== props.presetData[key]
  for (const key of keys) if (valueUpdated(key)) entries.push([key, record[key]])
  const body = Object.fromEntries(entries);
  const { id } = props.presetData;
  return { id, body };
}

async function updateFirstStepsPreferences() {
  if (preferences.value.FirstStepsStatus === undefined) preferences.value.FirstStepsStatus = ["Active", "Active", "Active"];
  preferences.value.FirstStepsStatus[props.followingStep] = "Completed";
  await accountStore.updateAccount({ OTP: null, updateEntries: { preferences: preferences.value } });
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
