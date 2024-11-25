<template>
  <div class="my-4">
    <table class="shadow-md mx-auto w-full 2xl:w-2/3 text-sm">
      <thead v-if="!underLgBreakpoint">
        <tr class="p-1 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-700">
          <th v-for="header in headers" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
        v-for="record in recordsInRange" :key="record.id" :class="underLgBreakpoint ? 'grid' : ''"
        class="my-1 p-1 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
        >
          <td class="text-end h-8 xl:w-40 lg:px-2">
            {{ formattedDate(record) }}
          </td>
          <td class="h-8 lg:w-48 lg:px-2">
            <div class="flex items-center">
              <span>{{ getFundName(record.fundID) }}</span>
              <span v-if="record.type === 0">, {{ getFundName(record.otherFundID) }}</span>
            </div>
          </td>
          <td class="px-2 h-8 2xl:min-w-96">
            <div class="flex justify-between">
              <span class="font-medium text-sm">{{ record.note }}</span>
              <span v-if="record.tag !== ''" class="text-sm bg-stone-200 dark:bg-stone-700 font-medium px-2 rounded-xl">
                {{ record.tag }}
              </span>
            </div>
          </td>
          <td class="lg:w-40 lg:px-2 h-8">
            <div class="flex justify-end lg:justify-between space-x-2 items-center">
              <div :class="[getRecordTypeStyles(record), 'p-1 rounded-full']">
                <component class="h-3 w-3" :is="getRecordTypeIcon(record)" />
              </div>
              <span>{{ getAmountFormatted(record) }}</span>
            </div>
          </td>
          <td class="lg:w-24 h-8">
            <div class="flex justify-around items-center gap-0.5">
              <button class="p-1 rounded-sm bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 w-1/2" @click="editRecord(record)">
                <PencilSquareIcon class="h-4 w-4 mx-auto" />
              </button>
              <button class="p-1 rounded-sm bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 w-1/2" @click="confirmDeletion(record)">
                <TrashIcon class="h-4 w-4 mx-auto" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-end justify-between my-2 mx-auto w-full 2xl:w-2/3">
      <div class="grid font-bold">
        <small class="text-xs mb-1">Rows</small>
        <select class="text-white bg-stone-800 rounded-sm border-stone-600 text-center" v-model="maxRows">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
        </select>
      </div>
      <div>
        <input type="range" v-model="currentPage" :min="1" step="1" :max="totalPages">
      </div>
      <div class="grid font-bold">
        <small class="text-xs mb-1">Page: {{ currentPage }} / {{ totalPages }}</small>
        <div class="flex space-x-1">
          <button
            class="text-white bg-stone-800 rounded-sm border-stone-600 text-center hover:bg-stone-700 px-2 disabled:bg-stone-900 disabled:text-stone-600"
            @click="currentPage--"
            :disabled="currentPage === 1">
            <ArrowLeftIcon class="w-5 py-1 mx-auto" aria-hidden="true" />
          </button>
          <button
            class="text-white bg-stone-800 rounded-sm border-stone-600 text-center hover:bg-stone-700 px-2 disabled:bg-stone-900 disabled:text-stone-600"
            @click="currentPage++"
            :disabled="currentPage === totalPages">
            <ArrowRightIcon class="w-5 py-1 mx-auto" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
    <RecordForm
    v-if="recordFormIsOpen"
    :form-is-open="recordFormIsOpen"
    @close-form="resetForm"
    :editing="true"
    :preset="originalRecord"
    />
  </div>
</template>

<script setup>
import {
  ArrowsRightLeftIcon,
  ArrowLeftIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import { ref, computed, watch, defineAsyncComponent, inject } from "vue";
import { useFundStore } from '../../stores/fundStore';
import { useRecordStore } from '../../stores/recordStore';
import { storeToRefs } from "pinia";
import { breakpointsTailwind, useBreakpoints, useDateFormat } from '@vueuse/core';

const RecordForm = defineAsyncComponent(() => import('../record/RecordForm.vue'));

const showAlert = inject("showAlert");
const showToast = inject("showToast");

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);
const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

const headers = ["Date", "Fund", "Concept", "Amount", "Actions"];
const breakpoints = useBreakpoints(breakpointsTailwind);
const underLgBreakpoint = breakpoints.smaller('lg');
let originalRecord = null;

const currentPage = ref(1);
const maxRows = ref(10);
const recordFormIsOpen = ref(false);

function editRecord(record) {
  originalRecord = record;
  recordFormIsOpen.value = true;
}

function resetForm() {
  originalRecord = null;
  recordFormIsOpen.value = false;
}

const totalPages = computed(() => Math.ceil(records.value.length / maxRows.value));
const startIndex = computed(() => (currentPage.value * maxRows.value) - maxRows.value);
const endIndex = computed(() => (startIndex.value + maxRows.value));
const recordsInRange = computed(() => records.value.slice(startIndex.value, endIndex.value));

function getRecordTypeIcon({ type }) {
  if (type === 0) return ArrowsRightLeftIcon
  else if (type === 1) return PlusIcon
  else return MinusIcon
};

function getRecordTypeStyles({ type }) {
  if (type === 0) return 'text-stone-500 bg-stone-600 bg-opacity-20'
  else if (type === 1) return 'text-green-500 bg-green-600 bg-opacity-20'
  else return 'text-red-500 bg-red-600 bg-opacity-20'
};

function getFundName(fundID) {
  return funds.value.find(fund => fund.id === fundID).name;
}

function getAmountFormatted({ amount }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

const formattedDate = ({ date }) => useDateFormat(new Date(date), 'MMM-DD (ddd)').value;

function deleteRecord(record) {
  recordStore.deleteRecord({ id: record.id })
    .then((message) => showToast(message))
    .catch((message) => showAlert({ type: "error", text: message }))
}

async function confirmDeletion(record) {
  const deletionIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: 'Please confirm if you want to delete the record. The action is irreversible.',
    buttons: true,
    timer: null,
  });
  if (deletionIsConfirmed) deleteRecord(record)
}

watch(totalPages, (numPages) => {
  if (numPages < currentPage.value) currentPage.value = 1
})

</script>
