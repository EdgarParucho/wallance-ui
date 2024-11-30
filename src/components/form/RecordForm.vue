<template>
  <Dialog
  @close-form="$emit('close-form')"
  :form-is-open="formIsOpen"
  :icon="editing ? PencilSquareIcon : DocumentPlusIcon"
  title="Record Form"
  :subtitle="`You are ${editing ? 'editing' : 'creating'} a record`"
  >
    <form>
      <fieldset class="px-2">
        <div class="my-2 grid grid-cols-3 gap-1">
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
          <label for="amount" class="grid text-left text-xs font-semibold">
            Amount
            <div class="flex">
              <div class="flex items-center pl-3 space-x-2">
                <component
                :class="[operationIconStyles, 'bg-opacity-20 p-1 rounded-full h-5 w-5']"
              :is="operationIcon" />
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
            name="credit"
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
            name="debit"
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
            name="assignment"
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
            name="fundID"
            class="mt-2 border-transparent font-normal dark:focus:border-1 focus:border-violet-500 dark:focus:border-violet-500 rounded-full bg-transparent focus:ring-0 shadow-sm shadow-stone-400 dark:shadow-black invalid:text-red-400"
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
            name="otherFundID"
            class="mt-2 border-transparent font-normal dark:focus:border-1 focus:border-violet-500 dark:focus:border-violet-500 rounded-full bg-transparent focus:ring-0 shadow-sm shadow-stone-400 dark:shadow-black invalid:text-red-400"
            :disabled="form.type !== 0 || !form.fundID"
            required
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
          <label for="tag" class="text-left text-xs font-semibold">
            Tag
            <input
            id="tag"
            type="text"
            name="tag"
            class="font-normal focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            required
            v-model.trim="form.tag"
            >
          </label>
          <label for="note" class="text-left text-xs font-semibold">
            Note
            <input
            type="text"
            name="note"
            id="note"
            maxlength="240"
            required
            v-model.trim="form.note"
            class="font-normal focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            >
          </label>
        </div>
        <div class="mt-2 w-full min-h-4 px-1 flex flex-wrap gap-1">
          <option
          v-for="tag, i in tags" :Key="i"
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
import { storeToRefs } from "pinia";
import { ref, watch, computed, reactive, inject, onMounted } from 'vue';
import { DocumentPlusIcon, PencilSquareIcon, MinusIcon, PlusIcon, ArrowsRightLeftIcon } from '@heroicons/vue/24/outline';
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';
import Dialog from '../layout/Dialog.vue';

onMounted(() => setStartingData())

const showAlert = inject("showAlert");
const showToast = inject("showToast");
const emit = defineEmits(['close-form']);

const props = defineProps({
  editing: { type: Boolean, default: false },
  preset: { type: Object, default: undefined },
  formIsOpen: { type: Boolean, default: false, },
});

const fundStore = useFundStore();
const recordStore = useRecordStore();

const { funds } = storeToRefs(fundStore);

const defaultFundID = fundStore.funds.find(fund => fund.isDefault).id;
const form = reactive({
  amount: 1,
  date: new Date(),
  note: "",
  tag: "",
  fundID: defaultFundID,
  otherFundID: null,
  type: 2,
  ...props.preset,
});

const { tagsByType } = storeToRefs(recordStore);

const loading = ref(false);
const showTags = ref(false);

const tags = computed(() => {
  const formTag = form.tag?.toLowerCase() || "";
  const matchingTags = tagsByType.value[form.type]
    .filter(tag => tag.toLowerCase().includes(formTag))
    .sort();
  return matchingTags;
});

const isCredit = computed(() => form.type === 1);
const operationIcon = computed(() => {
  if (form.type === 0) return ArrowsRightLeftIcon
  else if (form.type === 1) return PlusIcon
  else return MinusIcon
});

const operationIconStyles = computed(() => {
  if (form.type === 2) return 'text-red-500 bg-red-600'
  else if (form.type === 1) return 'text-green-500 bg-green-600'
  else return 'text-stone-500 bg-stone-600'
});

const formHasErrors = computed(() => {
  const invalidDate = new Date(form.date).toString() === "Invalid Date";
  const invalidAmount = form.amount <= 0 || form.amount === "";
  const invalidFundID = form.fundID === "";
  return invalidDate || invalidAmount || invalidFundID;
});

function onSave(formValues) {
  loading.value = true;
  const action = props.editing ? recordStore.updateRecord : recordStore.createRecord;
  const body = normalizeRecord(formValues);
  action(body)
    .then((message) => showToast(message))
    .then(() => emit('close-form'))
    .catch((message) => showAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
};

function normalizeRecord({ amount, date, time, ...rest }) {
  const normalized = {
    amount: (!isCredit.value && form.amount > 0) ? -(amount) : amount,
    date: new Date(`${date}T${time}:01`).toISOString(),
    ...rest,
  };
  if (!props.editing) return normalized;
  else removeUnaltered(normalized);
  return { id: props.preset.id, body: normalized };
}

function removeUnaltered(formValues) {
  const keys = Object.keys(formValues);
  for (const key of keys) if (formValues[key] === props.preset[key]) delete formValues[key];
}

function setStartingData() {
  setStartingDate();
  normalizeAmount();
}

function setStartingDate() {
  const dateOnMounted = new Date(form.date);
  const offsetMinutes = dateOnMounted.getTimezoneOffset();
  const currentMinutes = dateOnMounted.getMinutes();
  dateOnMounted.setMinutes(currentMinutes - offsetMinutes);
  form.date = dateOnMounted.toISOString().slice(0, 10);
  form.time = dateOnMounted.toISOString().slice(11, 16);
}

function normalizeAmount() {
  if (form.amount < 0) form.amount = -(form.amount);
  const integer = isCredit.value ? Math.floor(form.amount) : Math.floor(form.amount);
  const fractions = form.amount
    .toString()
    .split('.')[1]?.padEnd(2, "0") || "00"
    .slice(0, 2)
  form.amount = `${integer}.${fractions}`
}

watch(() => form.type, (type) => {
  form.fundID = type !== 2 ? defaultFundID : "";
  form.otherFundID = null;
})

</script>
