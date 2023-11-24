<template>
  <div class="py-4">
    <h1 class="text-4xl font-bold px-4">Records History</h1>
    <p class="text-xl my-4 px-4">Find and manage your records from here.</p>
    <QueryPanel />
    
    <div v-if="records.length > 0">

      <QueryTotals class="mt-24" :records="records" />
      <RecordsTable />

      <div class="my-20">
        <TagIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        <h2 class="mb-2 text-3xl font-bold text-center">Tags Measurement</h2>
        <p class="text-center">Check the tags among the results</p>
        <div class="md:flex my-10 justify-center space-x-1">
          <div class="md:w-1/2 xl:w-1/3 p-4 shadow-md rounded-md bg-white dark:bg-stone-800">
            <QueryTagsList ref="tagsList" :records="records" />
          </div>
          <div class="md:w-1/2 xl:w-1/3 p-4 shadow-md rounded-md bg-white dark:bg-stone-800">
            <QueryTagsChart :records="records" :tags-data="tagsList.tagsData" />
          </div>
        </div>
      </div>

      <div class="md:flex my-10 md:justify-center md:gap-1">
        <div class="md:w-1/2 xl:w-1/3 p-4 shadow-md rounded-md bg-white dark:bg-stone-800">
          <ArchiveBoxIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          <h2 class="mb-2 text-3xl font-bold text-center">Funds management</h2>
          <p class="text-center">Credits, debits, and balance by fund</p>
          <FundsChart class="p-2 shadow-md" :records="records" />
          <FundsList :balance-on-records="true" />
        </div>
        <div class="hidden xl:inline w-full md:w-1/2 xl:w-2/3 p-10 shadow-md rounded-md bg-white dark:bg-stone-800">
          <CalendarIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          <h2 class="mb-2 text-3xl font-bold text-center">{{ new Date().getFullYear() }} Timeline</h2>
          <p class="text-center">Your query along this year</p>
          <QueryYearlyChart class="p-2 shadow-md" :records="records" />
        </div>
      </div>
      <div class="my-20">
        <LightBulbIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        <h2 class="mb-2 text-3xl font-bold text-center">A close look</h2>
        <p class="mb-10 text-center">Some valuable data about your management</p>
        <h2 class="mb-2 text-2xl font-bold text-center">This year on average</h2>
        <Stats />
      </div>
      
    </div>

  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from "pinia";
import { ArchiveBoxIcon, TagIcon, CalendarIcon, LightBulbIcon } from '@heroicons/vue/24/outline';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

import { useRecordStore } from '../stores/recordStore';
import QueryPanel from '../components/query/QueryPanel.vue';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement);

const Stats = defineAsyncComponent(() => import('../components/query/QueryStats.vue'));
const QueryTagsList = defineAsyncComponent(() => import('../components/query/QueryTagsList.vue'));
const FundsList = defineAsyncComponent(() => import('../components/fund/FundsList.vue'));
const QueryTotals = defineAsyncComponent(() => import('../components/query/QueryTotals.vue'));
const RecordsTable = defineAsyncComponent(() => import('../components/query/QueryResultsTable.vue'));
const FundsChart = defineAsyncComponent(() => import('../components/query/QueryFundsChart.vue'));
const QueryYearlyChart = defineAsyncComponent(() => import('../components/query/QueryYearlyChart.vue'));
const QueryTagsChart = defineAsyncComponent(() => import('../components/query/QueryTagsChart.vue'));

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);
const tagsList = ref(null);
tagsList.value = ref(tagsList.tagsData)
</script>
