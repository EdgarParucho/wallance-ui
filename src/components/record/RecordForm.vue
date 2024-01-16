<template>
  <Dialog
  @close-form="$emit('close-form')"
  :form-is-open="formIsOpen"
  :icon="editing ? PencilSquareIcon : DocumentPlusIcon"
  title="Record Form"
  :subtitle="`You are ${editing ? 'editing' : 'creating'} a record`"
  widthClasses="w-96 md:w-2/3 xl:w-1/3"
  >
    <form class="px-4">
      <fieldset>
        <div class="mb-4 space-y-2 text-left px-1">
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
            class="w-1/2 focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            required
            v-model="form.date"
            >
            <input
            type="time"
            name="time"
            id="time"
            class="w-1/2 focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 invalid:text-red-400 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
            required
            v-model="form.time"
            >
          </div>
        </div>

        <div class="mb-4 text-left px-1">
          <div class="lg:flex md:items-center gap-1">
            <div class="flex items-center space-x-4 w-3/5">
              <div class="my-2 flex items-center space-x-2">
                <input
                  id="credit"
                  name="credit"
                  type="radio"
                  class=" text-violet-500 focus:ring-violet-500 p-2"
                  :value="1"
                  v-model="form.type"
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
                  v-model="form.type"
                  required
                >
                <label for="debit" class="text-xs font-semibold">
                  Debit
                </label>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  id="assignment"
                  name="assignment"
                  type="radio"
                  class=" text-violet-500 focus:ring-violet-500 p-2 disabled:bg-stone-300 dark:disabled:bg-stone-700"
                  required
                  :disabled="funds.length < 2"
                  :value="0"
                  v-model="form.type"
                >
                <label for="assignment" class="text-xs font-semibold">
                  Assignment
                </label>
              </div>
            </div>

            <div class="relative rounded-md w-2/5">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 space-x-2">
                <component
                :class="[operationIconStyles, 'bg-opacity-20 p-1 rounded-full h-5 w-5']"
                :is="operationIcon" />
                <span class="sm:text-md">$</span>
              </div>
              <input
                type="number"
                :min="0"
                id="amount"
                class="w-full bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-stone-400 dark:border-b-stone-700 rounded-sm pl-6 text-right disabled:text-stone-400"
                :class="{ 'border-b-red-400 dark:border-b-red-400': Number(form.amount) <= 0 }"
                placeholder="0"
                required
                v-model.number.lazy="form.amount"
              >
            </div>
          </div>
        </div>

        <div class="mb-4 space-y-2 text-left px-1">
          <div class="flex items-center gap-1">
            <div class="grid space-y-2 w-1/2">
              <label for="fundID" class="text-xs font-semibold">
                Main Fund
              </label>
              <select
              id="fundID"
              name="fundID"
              class="border-transparent dark:focus:border-1 focus:border-violet-500 dark:focus:border-violet-500 shadow-sm shadow-stone-400 dark:shadow-black rounded-full invalid:text-red-400 bg-transparent focus:ring-0"
              required
              :disabled="isCredit"
              v-model="form.fundID"
              >
                <option
                class="text-white bg-stone-800 disabled:text-opacity-50 text-sm"
                v-for="fund in funds" :key="fund.id"
                :value="fund.id"
                >
                  <span>{{ fund.name }}</span>
                </option>
              </select>
            </div>
            <div class="grid space-y-2 w-1/2">
              <label for="otherFundID" :class="[{ 'text-stone-400': form.type !== 0 || !form.fundID }, 'text-xs font-semibold']">
                Correlated Fund
              </label>
              <select
              id="otherFundID"
              name="otherFundID"
              class="border-transparent dark:focus:border-1 focus:border-violet-500 dark:focus:border-violet-500 shadow-sm shadow-stone-400 dark:shadow-black rounded-full invalid:text-red-400 bg-transparent focus:ring-0"
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
                  <span>{{ fund.name }}</span>
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="mb-4 text-left px-1 flex items-center gap-2">
            <div class="w-1/2">
              <label for="tag" class="text-xs font-semibold">
                Tag
              </label>
              <input
              @focusin="showTags = true"
              @focusout="(e) => handleTagList(e)"
              @keydown.tab="showTags = false"
              @keydown.backspace="showTags = true"
              @keydown.arrow-up="focusedTagIndex--"
              @keydown.arrow-down="focusedTagIndex++"
              @keydown.enter="handleTagEnter(typeTags[focusedTagIndex])"
              id="tag"
              type="text"
              name="tag"
              class="w-full focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
              required
              v-model.trim="form.tag"
              >
              <div v-show="showTags" class="px-1 text-sm rounded-sm mt-4 bg-white dark:bg-stone-800 border-violet-500 border absolute w-72">
                <button
                v-for="tag, i in typeTags" Key="i"
                type="button"
                class="tag hover:text-violet-500 w-full cursor-pointer text-left"
                :class="{'bg-violet-200 dark:bg-violet-600 dark:bg-opacity-10': focusedTagIndex === i }"
                @click="form.tag = tag, showTags = false"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
            <div class="w-1/2">
              <label for="note" class="text-xs font-semibold">
                Note
              </label>
              <input
              type="text"
              name="note"
              id="note"
              maxlength="240"
              required
              v-model.trim="form.note"
              class="w-full focus:border-b-violet-500 dark:focus:border-b-violet-500 border-b-stone-400 dark:border-b-stone-700 focus:border-transparent focus:ring-0 border-transparent bg-transparent"
              >
            </div>
          </div>
      </fieldset>

      <div class="h-1/2 flex items-center justify-end my-4 space-x-2">
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
      class="mt-3 inline-flex gap-2 w-full justify-center rounded-md px-4 py-2 text-base font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm hover:bg-violet-500 bg-violet-600 text-white disabled:bg-stone-300 dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
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
const { funds } = storeToRefs(fundStore);

const recordStore = useRecordStore();
const { tagNames } = storeToRefs(recordStore);


const form = reactive({
  amount: 1,
  date: new Date(),
  note: "",
  tag: "",
  fundID: fundStore.defaultFund.id,
  otherFundID: null,
  type: 2,
  ...props.preset,
});

const loading = ref(false);
const templateName = ref("");
const showTags = ref(false);
const focusedTagIndex = ref(0);

const typeTags = computed(() => {
  const formTag = form.tag?.toLowerCase() || "";
  const matchingTags = tagNames.value[form.type]
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

function handleTagList(e) {
  const tagSelected = e.relatedTarget?.className?.includes('tag');
  if (!tagSelected) return showTags.value = false;
  form.tag = e.relatedTarget.innerText;
  showTags.value = false;
}

function handleTagEnter(tag) {
  form.tag = tag;
  focusedTagIndex.value = 0;
  showTags.value = false;
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
  form.fundID = type !== 2 ? fundStore.defaultFund.id : "";
  form.otherFundID = null;
})

watch(focusedTagIndex, (i) => {
  if (i < 0) focusedTagIndex.value = (typeTags.value.length - 1);
  if (i >= typeTags.value.length) focusedTagIndex.value = 0;
})

</script>
