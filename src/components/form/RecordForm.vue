<template>
  <Dialog
  title="Record Form"
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  >
    <form>
      <fieldset class="px-2">
        <div class="my-4 flex justify-around">
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
        </div>

        <div class="my-4 flex justify-around">
          <label for="type" class="grid text-left text-xs font-semibold">
            Type
            <select
            id="type"
            class="border-none font-normal focus:ring-violet-500 rounded-full bg-transparent shadow-sm shadow-stone-400 dark:shadow-black"
            required
            v-model="form.type"
            >
              <option class="text-white bg-stone-800 disabled:text-opacity-50 text-sm" :value="1">
                Credit
              </option>
              <option class="text-white bg-stone-800 disabled:text-opacity-50 text-sm" :value="2">
                Debit
              </option>
              <option class="text-white bg-stone-800 disabled:text-opacity-50 text-sm" :value="0">
                Fund
                 to Fund</option>
            </select>
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

        <div class="my-4 mx-auto w-5/6">
          <label for="fundID" class="w-full grid text-left text-xs font-semibold">
            Fund
            <select
            id="fundID"
            class="border-none font-normal focus:ring-violet-500 rounded-full bg-transparent shadow-sm shadow-stone-400 dark:shadow-black invalid:text-red-400"
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
        </div>

        <div class="my-4 mx-auto w-5/6">
          <label for="otherFundID" :class="[{ 'text-stone-400': form.type !== 0 || !form.fundID }, 'grid text-left text-xs font-semibold']">
            Correlated Fund
            <select
            id="otherFundID"
            class="border-none font-normal focus:ring-violet-500 rounded-full bg-transparent shadow-sm shadow-stone-400 dark:shadow-black invalid:text-red-400"
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

        <div class="my-4 w-5/6 mx-auto">
          <label for="tag" class="grid text-left text-xs font-semibold">
            Tag
            <input
            id="tag"
            type="text"
            class="font-normal focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            required
            v-model.trim="form.tag"
            >
          </label>
          <div class="mt-2 w-full min-h-4 px-1 flex flex-wrap gap-1">
            <button
            v-for="tag, i in tags"
            :Key="i"
            v-show="tag != ''"
            class="px-2 rounded-sm text-white inline text-xs bg-violet-500 cursor-pointer"
            @click="form.tag = tag, showTags = false"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        <div class="my-4 w-5/6 mx-auto">
          <label for="note" class="grid text-left text-xs font-semibold">
            Note
            <input
            type="text"
            id="note"
            maxlength="240"
            required
            v-model.trim="form.note"
            class="font-normal focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            >
          </label>
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
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';
import Dialog from '../layout/Dialog.vue';
import RecordIcon from '../layout/RecordIcon.vue';

const showAlert = inject("showAlert");
const showToast = inject("showToast");

const emit = defineEmits(['close-form']);

const props = defineProps({
  editing: { type: Boolean, default: false },
  selectedRecord: { type: Object, default: undefined },
  formIsOpen: { type: Boolean, default: false },
});

onMounted(() => setFormattedData())

function setFormattedData() {
  form.date = getDateFormatted();
  form.time = getTimeFormatted();
  form.amount = getAmountFormatted();
}

const getDateFormatted = () => {
  const date = props.editing ? new Date(props.selectedRecord.date) : new Date();
  const currentYear = date.getFullYear();
  const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  const currentDate = String(date.getDate()).padStart(2, '0');
  return `${currentYear}-${currentMonth}-${currentDate}`;
};

const getTimeFormatted = () => {
  const date = props.editing ? new Date(props.selectedRecord.date) : new Date();
  return date.toTimeString().slice(0, 5);
};

const getAmountFormatted = () => {
  const amount = props.editing ? props.selectedRecord.amount : form.amount;
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
  ...props.selectedRecord,
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

const formHasErrors = computed(() => {
  const invalidDate = new Date(form.date).toString() === "Invalid Date";
  const invalidAmount = form.amount <= 0 || form.amount === "";
  const invalidFundID = form.fundID === "" || (form.type === 0 && form.otherFundID === null);
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
  return { id: props.selectedRecord.id, body: normalizedRecord };
}

function removeUnalteredProperties(formValues) {
  const keys = Object.keys(formValues);
  for (const key of keys) if (formValues[key] === props.selectedRecord[key]) delete formValues[key];
}

watch(() => form.type, (type) => {
  form.fundID = type !== 2 ? defaultFundID : "";
  form.otherFundID = null;
})

</script>
