<template>
  <Dialog
  title="Query Form"
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  >
    <form class="my-10 px-4 shadow-md rounded-sm mx-auto">
      <fieldset class="space-y-4">

        <div class="flex justify-center items-end gap-4">
          <label for="type" class="text-sm w-16 inline-block">Get all</label>
          <select id="type" class="py-0 w-60 text-center bg-transparent border-transparent border-b-stone-500 font-bold" v-model="filters.type">
            <option class="bg-stone-700 text-white" :value="null">records</option>
            <option v-for="type, k in types" :key="k" class="bg-stone-700 text-white" :value="type.value">
              {{ type.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-center items-end gap-4">
          <label for="fund" class="text-sm w-16 inline-block">related to</label>
          <select id="fund" class="py-0 w-60 text-center bg-transparent border-transparent border-b-stone-500 font-bold" v-model="filters.fundID">
            <option class="bg-stone-700 text-white" :value="null">no particular fund</option>
            <option v-for="fund in funds" :key="fund.id" class="bg-stone-700 text-white" :value="fund.id">
              {{ fund.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-center items-end gap-4">
          <label for="fromDate" class="text-sm w-16 inline-block">from</label>
          <input
            id="fromDate"
            type="date"
            class="w-60 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
            v-model="filters.fromDate"
          >
        </div>

        <div class="flex justify-center items-end gap-4">
          <label for="toDate" class="text-sm w-16 inline-block">to</label>
          <input
            id="toDate"
            type="date"
            class="w-60 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
            v-model="filters.toDate"
          >
        </div>

        <div class="flex justify-center items-end gap-4">
          <label for="tag" class="text-sm inline-block">tagged as</label>
          <input
            id="tag"
            class="w-60 px-2 bg-transparent border-transparent border-b mx-0.5 border-b-stone-500 font-bold placeholder:text-center placeholder:text-stone-600 dark:placeholder:text-white"
            placeholder="any"
            v-model="filters.tag"
          >
        </div>

        <div class="flex justify-center items-end gap-4">
          <label for="note" class="text-sm w-20 inline-block">and the note</label>
          <input
            class="w-60 px-2 bg-transparent border-transparent border-b mx-0.5 border-b-stone-500 font-bold placeholder:text-center placeholder:text-stone-600 dark:placeholder:text-white"
            placeholder="whatever"
            v-model="filters.note"
          >
        </div>
      </fieldset>

      <div class="mt-10 flex items-center gap-2">
        <button
        type="button"
        class="w-full h-6 sm:w-36 flex items-center bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-sm px-4"
        @click="$emit('close-form')"
        >
          <XMarkIcon class="w-4 text-left" />
          <span class="mx-auto">Cancel</span>
        </button>
        <button type="button" class="h-6 sm:w-36 bg-violet-500 hover:bg-violet-600 text-white rounded-sm px-4" @click="submitQuery(appliedFilters)">
        <div class="flex items-center gap-1" v-if="loading">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="loading" class="mx-auto">Processing...</span>
        </div>
        <div v-else class="flex justify-center items-end gap-4 items-center gap-2">
          <MagnifyingGlassIcon class="w-4 text-left" />
          <span class="mx-auto">Search</span>
        </div>
        </button>
        <button type="button" class="h-6 sm:w-36 flex items-center bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-sm px-4" @click="resetForm">
          <ArrowUturnLeftIcon class="w-4 text-left" />
          <span class="mx-auto">Reset</span>
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from "pinia";
import { ref, computed, inject, defineProps } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';
import Dialog from '../layout/Dialog.vue';

const formIsOpen = defineProps({ type: Boolean, default: false })
const emit = defineEmits(['close-form', 'confirm-query-execution']);
const showAlert = inject("showAlert");
const showToast = inject("showToast");

const fundStore = useFundStore();
const recordStore = useRecordStore();
const { funds } = storeToRefs(fundStore);

const filters = ref({
  tag: null,
  note: null,
  fromDate: null,
  toDate: null,
  type: null,
  fundID: null,
});
const loading = ref(false);

const types = [
  { name: "debits", value: 2 },
  { name: "credits", value: 1 },
  { name: "assignments", value: 0 }
];

const appliedFilters = computed(() => {
  const filtersEntries = Object.entries(filters.value);
  const validEntries = filtersEntries.filter(([key, value]) => value !== "" && value !== null);
  return Object.fromEntries(validEntries);
});

function submitQuery(filters) {
  loading.value = true;
  recordStore.getRecords(filters)
    .then((message) => {
      showToast(message)
      emit('confirm-query-execution')
      emit('close-form')
    })
    .catch((message) => showAlert({ type: "error", text: message }))
    .finally(() => loading.value = false)
}

function resetForm() {
  filters.value = {
    tag: null,
    note: null,
    fromDate: null,
    toDate: null,
    type: null,
    fundID: null,
  };
}
</script>
