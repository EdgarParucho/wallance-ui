<template>
  <div class="my-4">
    <table class="border-separate border-spacing-2 border border-stone-500 text-white mx-auto w-full 2xl:w-2/3">
      <thead v-if="!underLgBreakpoint">
        <tr>
          <th class="border border-stone-600 px-4 bg-stone-800 text-white" v-for="header in headers" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b-white p-2 bg-stone-800 my-1" v-for="record in recordRows" :key="record.id" :class="underLgBreakpoint ? 'grid' : ''">
          <td class="text-end xl:w-64 lg:px-2">
            {{ getDateFormatted(record) }}
          </td>
          <td class="text-end lg:w-36 lg:px-2">
            {{ getFundName(record) }}
          </td>
          <td class="items-center flex justify-between 2xl:min-w-96 lg:pl-2">
            <span class="font-medium text-sm">{{ record.note }}</span>
            <span class="text-sm bg-stone-600 font-medium px-2 py-1 rounded-sm">
              {{ record.tag }}
            </span>
          </td>
          <td class="lg:w-40 lg:px-2">
            <div class="flex justify-end lg:justify-between space-x-2 items-center">
              <div :class="[getRecordTypeStyles(record), 'p-1 rounded-full']">
                <component class="h-3 w-3" :is="getRecordTypeIcon(record)" />
              </div>
              <span>{{ getAmountFormatted(record) }}</span>
            </div>
          </td>
          <td class="lg:w-24">
            <div class="flex justify-around items-center">
              <button class="p-1 rounded-sm bg-stone-800 hover:bg-stone-700 w-1/2" @click="$emit('edit-record', record)">
                <PencilSquareIcon class="h-4 w-4 mx-auto" />
              </button>
              <button class="p-1 rounded-sm bg-stone-800 hover:bg-stone-700 w-1/2" @click="confirmDeletion(record)">
                <TrashIcon class="h-4 w-4 mx-auto" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-end justify-between my-2 mx-auto w-full 2xl:w-2/3">
      <div class="grid font-bold">
        <small class="text-white text-xs mb-1">Rows</small>
        <select class="bg-stone-800 rounded-sm border-stone-600 text-white text-center" v-model="maxRows">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
        </select>
      </div>
      <div class="grid font-bold">
        <small class="text-white text-xs mb-1">Page: {{ currentPage }} / {{ totalPages }}</small>
        <div class="flex space-x-1">
          <button
            class="bg-stone-800 rounded-sm border-stone-600 text-white text-center hover:bg-stone-700 px-2 disabled:bg-stone-900 disabled:text-stone-600"
            @click="currentPage--"
            :disabled="currentPage === 1">
            <ArrowLeftIcon class="w-5 py-1 mx-auto" aria-hidden="true" />
          </button>
          <button
            class="bg-stone-800 rounded-sm border-stone-600 text-white text-center hover:bg-stone-700 px-2 disabled:bg-stone-900 disabled:text-stone-600"
            @click="currentPage++"
            :disabled="currentPage === totalPages">
            <ArrowRightIcon class="w-5 py-1 mx-auto" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowsRightLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon } from '@heroicons/vue/24/outline'
import { ref, computed, watch } from "vue";
import { useFundStore } from '../../stores/fundStore';
import { storeToRefs } from "pinia";
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

const props = defineProps(['filteredRecords']);
const emit = defineEmits(['edit-record', 'delete-record']);

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const headers = ["Date", "Fund", "Concept", "Amount", "Actions"];

const currentPage = ref(1);
const maxRows = ref(10);
const breakpoints = useBreakpoints(breakpointsTailwind);
const underLgBreakpoint = breakpoints.smaller('lg');

const totalPages = computed(() => Math.ceil(props.filteredRecords.length / maxRows.value));
const startIndex = computed(() => (currentPage.value * maxRows.value) - maxRows.value);
const endIndex = computed(() => (startIndex.value + maxRows.value));
const recordRows = computed(() => props.filteredRecords.slice(startIndex.value, endIndex.value));

function getRecordTypeIcon({ type }) {
  if (type === 0) return ArrowsRightLeftIcon
  else if (type === 1) return PlusIcon
  else return MinusIcon
};

function getRecordTypeStyles({ type }) {
  if (type === 0) return 'text-white bg-stone-700'
  else if (type === 1) return 'text-green-400 bg-green-900'
  else return 'text-red-400 bg-red-900'
};

function getFundName({ fundID }) {
  return funds.value.find(fund => fund.id === fundID).name;
}

function getAmountFormatted({ amount }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getDateFormatted({ date }){
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "2-digit"
  }).format(new Date(date)).toLocaleString()
}

async function confirmDeletion(record) {
  const deletionIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: 'Please confirm if you want to delete the record. The action is irreversible.',
    buttons: true,
    timer: null,
  });
  if (deletionIsConfirmed) emit('delete-record', record)
}

watch(totalPages, (numPages) => {
  if (numPages < currentPage.value) currentPage.value = 1
})

</script>
