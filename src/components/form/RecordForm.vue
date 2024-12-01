<template>
  <Dialog
  @close-form="$emit('close-form')"
  :form-is-open="formIsOpen"
  :icon="editing ? PencilSquareIcon : DocumentPlusIcon"
  :subtitle="`You are ${editing ? 'editing' : 'creating'} a record`"
  title="Record Form"
  >
    <form>
      <fieldset class="px-2">
        <div class="my-2 grid sm:grid-cols-3 gap-1">
          <label for="date" class="grid text-left text-xs font-semibold">
            Date
            <input
            type="date"
            id="date"
            class="font-normal focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            required
            v-model="form.date"
            >
          </label>
          <label for="time" class="grid text-left text-xs font-semibold">
            Time
            <input
            type="time"
            id="time"
            class="font-normal focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            required
            v-model="form.time"
            >
          </label>
          <label for="amount" class="grid text-left text-xs font-semibold justify-self-center">
            Amount
            <div class="flex">
              <div class="flex items-center pl-3 space-x-2">
                <RecordIcon :recordType="form.type" />
                <span class="sm:text-md">$</span>
              </div>
              <input
              type="number"
              :min="0"
              id="amount"
              class="w-24 font-normal bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-stone-400 dark:border-b-stone-700 rounded-sm pl-6 text-right disabled:text-stone-400"
              :class="{ 'border-b-red-400 dark:border-b-red-400': Number(form.amount) <= 0 }"
              placeholder="0"
              required
              v-model.number.lazy="form.amount"
              >
            </div>
          </label>
        </div>

        <div class="my-6 flex justify-around">
          <label for="credit" class="flex items-center gap-2 text-left text-xs font-semibold">
            <input
            id="credit"
            type="radio"
            class="text-violet-500 focus:ring-violet-500"
            required
            v-model="form.type"
            :value="1"
            >
            Credit
          </label>
          <label for="debit" class="flex items-center gap-2 text-left text-xs font-semibold">
            <input
            id="debit"
            type="radio"
            class="text-violet-500 focus:ring-violet-500"
            required
            v-model="form.type"
            :value="2"
            >
            Debit
          </label>
          <label for="assignment" class="flex items-center gap-2 text-left text-xs font-semibold">
            <input
            id="assignment"
            type="radio"
            class="text-violet-500 focus:ring-violet-500 p-2 disabled:bg-stone-300 dark:disabled:bg-stone-700"
            required
            v-model="form.type"
            :disabled="funds.length < 2"
            :value="0"
            >
            Fund to Fund
          </label>
        </div>

        <div class="my-2 grid grid-cols-2 gap-1">
          <label for="fundID" class="grid text-left text-xs font-semibold">
            Main Fund
            <select
            id="fundID"
            class="w-11/12 mt-2 border-transparent font-normal dark:focus:border-1 focus:border-violet-500 dark:focus:border-violet-500 rounded-full bg-transparent focus:ring-0 shadow-sm shadow-stone-400 dark:shadow-black invalid:text-red-400"
            required
            :disabled="isCredit"
            v-model="form.fundID"
            >
              <option
              class="text-white bg-stone-800 disabled:text-opacity-50 text-sm"
              v-for="fund in funds" :key="fund.id"
              :value="fund.id"
              >
                {{ fund.name }}
              </option>
            </select>
          </label>
          <label for="otherFundID" :class="[{ 'text-stone-400': form.type !== 0 || !form.fundID }, 'grid text-left text-xs font-semibold']">
            Correlated Fund
            <select
            id="otherFundID"
            class="w-11/12 mt-2 border-transparent font-normal dark:focus:border-1 focus:border-violet-500 dark:focus:border-violet-500 rounded-full bg-transparent focus:ring-0 shadow-sm shadow-stone-400 dark:shadow-black invalid:text-red-400"
            required
            :disabled="form.type !== 0 || !form.fundID"
            v-model="form.otherFundID"
            >
              <option
              class="text-white bg-stone-800 disabled:text-opacity-50 text-sm hover:bg-opacity-95"
              v-for="fund in funds" :key="fund.id"
              :value="fund.id"
              v-show="fund.id !== form.fundID"
              >
                {{ fund.name }}
              </option>
            </select>
          </label>
        </div>

        <div class="my-6 grid grid-cols-2">
          <label for="tag" class="grid text-left text-xs font-semibold justify-self-center">
            Tag
            <input
            id="tag"
            type="text"
            class="w-11/12 font-normal focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            required
            v-model.trim="form.tag"
            >
          </label>
          <label for="note" class="grid text-left text-xs font-semibold justify-self-center">
            Note
            <input
            type="text"
            id="note"
            maxlength="240"
            required
            v-model.trim="form.note"
            class="w-11/12 font-normal focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            >
          </label>
        </div>
        <div class="mt-2 w-full min-h-4 px-1 flex flex-wrap gap-1">
          <option
          v-for="tag, i in tags"
          :Key="i"
          v-show="tag != ''"
          class="px-2 rounded-sm text-white inline text-xs bg-violet-500 cursor-pointer"
          @click="form.tag = tag, showTags = false"
          >
            {{ tag }}
          </option>
        </div>
      </fieldset>

      <div class="h-1/2 my-6 flex items-center justify-center space-x-2">
        <button
        type="button"
        class="btn-secondary"
        @click="$emit('close-form')"
        ref="cancelButtonRef"
        :disabled="loading"
        >
        Cancel
      </button>
      <button
      type="button"
      class="btn-primary disabled:bg-stone-300 dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
      @click="onSave(form)"
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
import { ref, watch, computed, reactive, inject, onMounted } from 'vue';
import { storeToRefs } from "pinia";
import {
  DocumentPlusIcon,
  PencilSquareIcon,
  MinusIcon,
  PlusIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline';

import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';
import Dialog from '../layout/Dialog.vue';
import RecordIcon from '../layout/RecordIcon.vue';

const showAlert = inject("showAlert");
const showToast = inject("showToast");

const emit = defineEmits(['close-form']);

const props = defineProps({
  editing: { type: Boolean, default: false },
  preset: { type: Object, default: undefined },
  formIsOpen: { type: Boolean, default: false },
});

onMounted(() => setFormattedData())

function setFormattedData() {
  form.date = getDateFormatted();
  form.time = getTimeFormatted();
  form.amount = getAmountFormatted();
}

const getDateFormatted = () => {
  const date = props.editing ? new Date(props.preset.date) : new Date();
  const currentYear = date.getFullYear();
  const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  const currentDate = String(date.getDate()).padStart(2, '0');
  return `${currentYear}-${currentMonth}-${currentDate}`;
};

const getTimeFormatted = () => {
  const date = props.editing ? new Date(props.preset.date) : new Date();
  return date.toTimeString().slice(0, 5);
};

const getAmountFormatted = () => {
  const amount = props.editing ? props.preset.amount : form.amount;
  return (amount < 0) ? String(Number(-amount).toFixed(2)) : String(Number(amount).toFixed(2))
};

const fundStore = useFundStore();
const recordStore = useRecordStore();
const { funds } = storeToRefs(fundStore);
const { tagsByRecordType } = storeToRefs(recordStore);
const defaultFundID = fundStore.funds.find(fund => fund.isDefault).id;

const form = reactive({
  amount: 1,
  date: "",
  time: "",
  note: "",
  tag: "",
  fundID: defaultFundID,
  otherFundID: null,
  type: 2,
  ...props.preset,
});

const loading = ref(false);
const showTags = ref(false);

const isCredit = computed(() => form.type === 1);

const tags = computed(() => {
  const formTag = form.tag?.toLowerCase() || "";
  const filteredTags = tagsByRecordType.value[form.type]
    .filter(tag => tag.toLowerCase().includes(formTag))
    .sort();
  return filteredTags;
});

const recordTypeIcon = computed(() => {
  if (form.type === 0) return { icon: ArrowsRightLeftIcon, class: "text-stone-500 bg-stone-600" };
  else if (form.type === 1) return { icon: PlusIcon, class: "text-green-500 bg-green-600" };
  else return { icon: MinusIcon, class: "text-red-500 bg-red-600" };
});

const formHasErrors = computed(() => {
  const invalidDate = new Date(form.date).toString() === "Invalid Date";
  const invalidAmount = form.amount <= 0 || form.amount === "";
  const invalidFundID = form.fundID === "";
  return invalidDate || invalidAmount || invalidFundID;
});

function onSave(formValues) {
  loading.value = true;
  const save = props.editing ? recordStore.updateRecord : recordStore.createRecord;
  const body = normalizeRecord(formValues);
  save(body)
    .then((message) => showToast(message))
    .then(() => emit('close-form'))
    .catch((message) => showAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
};

function normalizeRecord({ amount, date, time, ...rest }) {
  const normalizedRecord = {
    amount: (!isCredit.value && form.amount > 0) ? -(amount) : amount,
    date: new Date(`${date}T${time}:01`).toISOString(),
    ...rest,
  };
  if (!props.editing) return normalizedRecord;
  else removeUnalteredProperties(normalizedRecord);
  return { id: props.preset.id, body: normalizedRecord };
}

function removeUnalteredProperties(formValues) {
  const keys = Object.keys(formValues);
  for (const key of keys) if (formValues[key] === props.preset[key]) delete formValues[key];
}

watch(() => form.type, (type) => {
  form.fundID = type !== 2 ? defaultFundID : "";
  form.otherFundID = null;
})

</script>
