<template>
  <div class="py-4">
    <h1 class="text-4xl font-bold px-4">Records History</h1>
    <p class="text-xl my-4 px-4">Find and manage your records from here.</p>
    <QueryPanel />
    
    <div v-if="records.length > 0">

      <QueryTotals class="mt-24" :records="records" />
      <download-excel
      :fetch="formatToXls"
      class="bg-stone-100 dark:bg-stone-800 cursor-pointer my-6 w-28 rounded-sm shadow-md text-sm hover:scale-105 transition-transform px-2 py-1 justify-between flex items-center mx-auto"
      >
        Export .xls
        <ArrowDownIcon class="w-4" />
      </download-excel>
      <RecordsTable />

      <div class="my-20">
        <TagIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        <h2 class="mb-2 text-3xl font-bold text-center">Tags Measurement</h2>
        <p class="text-center">Check the tags among the results</p>
        <div class="md:flex my-10 md:justify-center gap-2">
          <div class="md:w-1/2 xl:w-1/3 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
            <QueryTagsList ref="taglistRef" :tag-data="tagData" :type-sum="typeSum" />
          </div>
          <div class="md:w-1/2 xl:w-1/3 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
            <QueryTagsChart :taglist-ref="taglistRef" :tag-names="tagNames" />
          </div>
        </div>
      </div>

      <div class="my-20">
        <ArchiveBoxIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        <h2 class="mb-2 text-3xl font-bold text-center">Funds management</h2>
        <p class="text-center">Credits, debits, and balance by fund</p>
        <div class="md:flex my-10 md:justify-center md:gap-2">
          <div class="md:w-2/5 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
            <FundsChart class="p-2 shadow-md" :records="records" :type-sum="typeSum" />
          </div>
          <div class="md:w-2/5 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
            <FundsList :balance-on-records="true" />
          </div>
        </div>
      </div>

      <div class="mt-20 space-x-2 justify-center flex items-center">
        <ArrowTrendingUpIcon class="w-6" />
        <h3 class="font-bold text-2xl">Planning Time?</h3>
        <router-link to="/projection" class="bg-violet-500 text-white py-0.5 px-1.5 font-bold gap-2 rounded-sm flex justify-center" @click.native="scrollToTop">
          <LinkIcon class="w-4" />
          Check projection
        </router-link>
      </div>
      <p class="text-center">For a quick calculation based on this year's records.</p>

    </div>

  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from "pinia";
import { ArchiveBoxIcon, TagIcon, CalendarIcon, LinkIcon, ArrowDownIcon, ArrowTrendingUpIcon } from '@heroicons/vue/24/outline';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

import { useDateFormat } from '@vueuse/shared';
import { useFundStore } from '../stores/fundStore';
import { useRecordStore } from '../stores/recordStore';
import QueryPanel from '../components/query/QueryPanel.vue';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement);
ChartJS.defaults = { responsive: true };

const QueryTagsList = defineAsyncComponent(() => import('../components/query/QueryTagsList.vue'));
const FundsList = defineAsyncComponent(() => import('../components/fund/FundsList.vue'));
const QueryTotals = defineAsyncComponent(() => import('../components/query/QueryTotals.vue'));
const RecordsTable = defineAsyncComponent(() => import('../components/query/QueryResultsTable.vue'));
const FundsChart = defineAsyncComponent(() => import('../components/query/QueryFundsChart.vue'));
const QueryTagsChart = defineAsyncComponent(() => import('../components/query/QueryTagsChart.vue'));

const fundStore = useFundStore();
const recordStore = useRecordStore();
const { funds } = storeToRefs(fundStore);
const { records } = storeToRefs(recordStore);
const { tagData } = storeToRefs(recordStore);
const { typeSum } = storeToRefs(recordStore);
const { tagNames } = storeToRefs(recordStore);

const taglistRef = ref(null);

let recordsXls = [];
const typeNames = {
  0: "Assignment",
  1: "Credit",
  2: "Debit"
};

function getFundName (id) {
  return funds.value.find(f => f.id === id).name
}

function formatToXls() {
  recordsXls = records.value.map(({ date, type, amount, fundID, otherFundID, tag, note }) => {
    return {
      date: useDateFormat(date, 'YYYY-MM-DD HH:mm').value,
      type: typeNames[type],
      amount,
      fund_source: getFundName(fundID),
      fund_target: (otherFundID) ? getFundName(otherFundID) : "",
      tag,
      note,
    }
  })
  return recordsXls;
}

function scrollToTop() {
  setTimeout(() => {
    window.scrollTo(0,0);
  }, 250)
}

</script>
