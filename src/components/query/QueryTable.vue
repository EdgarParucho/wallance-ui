<template>
  <div class="my-4 w-11/12 xl:w-9/12 mx-auto">
    <div class="flex items-end justify-between my-2 mx-auto w-full 2xl:w-2/3">
      <div class="grid font-bold">
        <small class="text-xs mb-1">Rows</small>
        <select class="h-9 border-none rounded-sm text-stone-600 dark:text-white text-center font-normal bg-stone-300 dark:bg-stone-800" v-model="maxRows">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
        </select>
      </div>
      <div class="grid font-bold">
        <small class="text-xs mb-1">Page: {{ currentPage }} / {{ totalPages }}</small>
        <div class="flex justify-between space-x-1">
          <button
            class="h-9 px-2 border-none rounded-sm text-stone-600 dark:text-white text-center font-normal bg-stone-300 dark:bg-stone-800"
            @click="currentPage--"
            :disabled="currentPage === 1">
            <ArrowLeftIcon class="w-5 py-1 mx-auto" />
          </button>
          <button
            class="h-9 px-2 border-none rounded-sm text-stone-600 dark:text-white text-center font-normal bg-stone-300 dark:bg-stone-800"
            @click="currentPage++"
            :disabled="currentPage === totalPages">
            <ArrowRightIcon class="w-5 py-1 mx-auto" />
          </button>
        </div>
      </div>
    </div>
    <table class="w-full mx-auto text-sm shadow-md table-fixed border-collapse">
      <thead v-if="!underLgBreakpoint">
        <tr class="p-1 bg-stone-100 dark:bg-stone-700">
          <th v-for="header, i in headers" :key="i" class="border border-white dark:border-stone-900" :class="{'w-96': i == 2}">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
        v-for="record in recordsInRange" :key="record.id" :class="underLgBreakpoint ? 'grid' : ''"
        class="my-1 p-1 bg-stone-100 dark:bg-stone-800"
        >
          <td class="xl:h-8 py-1 lg:px-2 xl:border xl:border-white xl:dark:border-stone-900">
            {{ formattedDate(record) }}
          </td>
          <td class="xl:h-8 py-1 lg:px-2 xl:border xl:border-white xl:dark:border-stone-900">
            <div class="flex items-center">
              <span>{{ getFundName(record.fundID) }}</span>
              <span v-if="record.type === 0">, {{ getFundName(record.otherFundID) }}</span>
            </div>
          </td>
          <td class="xl:h-8 py-1 xl:w-96 lg:px-2 xl:border xl:border-white xl:dark:border-stone-900 whitespace-nowrap overflow-hidden text-ellipsis">
            <span class="font-medium text-sm">
              {{ record.note }}
            </span>
            <div v-if="record.tag !== ''" class="block">
              <span class="block w-32 ml-auto px-2 rounded-sm text-sm text-center font-medium whitespace-nowrap overflow-hidden text-ellipsis text-stone-600 dark:text-white bg-stone-300 dark:bg-stone-600">
                {{ record.tag }}
              </span>
            </div>
          </td>
          <td class="xl:h-8 py-1 lg:w-40 lg:px-2 xl:border border-white dark:border-stone-900">
            <div class="flex justify-end lg:justify-between space-x-2 items-center">
              <RecordIcon :recordType="record.type" />
              <span>${{ amountFormatted(record.amount) }}</span>
            </div>
          </td>
          <td class="xl:h-8 py-1 xl:border border-white dark:border-stone-900">
            <div class="flex justify-around items-center gap-0.5">
              <button
              class="p-1 rounded-sm bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 w-1/2"
              @click="$emit('editRecord', record)"
              >
                <PencilSquareIcon class="h-4 w-4 mx-auto" />
              </button>
              <button
              class="p-1 rounded-sm bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 w-1/2"
              @click="$emit('confirmRecordDeletion', record)"
              >
                <TrashIcon class="h-4 w-4 mx-auto" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, ArrowRightIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { ref, computed, watch } from "vue";
import { useFundStore } from '../../stores/fundStore';
import { useRecordStore } from '../../stores/recordStore';
import { storeToRefs } from "pinia";
import { breakpointsTailwind, useBreakpoints, useDateFormat } from '@vueuse/core';
import RecordIcon from '../layout/RecordIcon.vue';

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);
const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

const headers = ["Date", "Fund", "Concept", "Amount", "Actions"];
const breakpoints = useBreakpoints(breakpointsTailwind);
const underLgBreakpoint = breakpoints.smaller('lg');

const currentPage = ref(1);
const maxRows = ref(10);

const totalPages = computed(() => Math.ceil(records.value.length / maxRows.value));
const startIndex = computed(() => (currentPage.value * maxRows.value) - maxRows.value);
const endIndex = computed(() => (startIndex.value + maxRows.value));
const recordsInRange = computed(() => records.value.slice(startIndex.value, endIndex.value));

function getFundName(fundID) {
  return funds.value.find(fund => fund.id === fundID).name;
}

function amountFormatted(amount) {
  return (amount < 0) ? String(Number(-amount).toFixed(2)) : String(Number(amount).toFixed(2));
}

const formattedDate = ({ date }) => useDateFormat(new Date(date), 'MMM-DD (ddd)').value;

watch(totalPages, (numPages) => {
  if (numPages < currentPage.value) currentPage.value = 1
})

</script>
