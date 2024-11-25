<template>
  <div>

    <header class="h-screen grid items-center">
      <div>
        <h2 class="text-4xl font-bold text-center">Status</h2>
        <p class="text-center text-lg text-stone-500 dark:text-stone-400">
          Find anything in your data
        </p>
      </div>
      
      <div class="lg:flex">
        <div
        class="h-44 md:w-1/2 lg:w-1/3 xl:w-1/4 p-16 mx-auto rounded-xl text-center shadow-md bg-white dark:bg-stone-800"
        :class="{ 'animate-pulse': loggingIn }"
        >
          <strong v-show="!loggingIn" class="text-5xl">{{ balance }}</strong>
        </div>
        <FundsList class="md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto" :class="{ 'animate-pulse': loggingIn }" />
      </div>
      <div class="flex items-center space-x-2 justify-center">
        <p class="font-bold text-xl">Outdated?</p>
        <button class="text-white hover:bg-violet-600 bg-violet-500 rounded-md w-32 inline-flex items-center justify-center gap-1" @click="recordFormIsOpen = true">
          <PlusIcon class="w-5" />
          <span>Add Record</span>
        </button>
      </div>
    </header>


    <div v-if="records.length > 0">

      <QueryTotals :records="records" />

      <download-excel
      :fetch="formatToXls"
      class="bg-stone-100 dark:bg-stone-800 cursor-pointer my-6 w-28 rounded-sm shadow-md text-sm hover:scale-105 transition-transform px-2 py-1 justify-between flex items-center mx-auto"
      >
        Export .xls
        <ArrowDownIcon class="w-4" />
      </download-excel>

      <QueryTable />

      <div v-if="tagData[1].length > 0 || tagData[2].length > 0" class="my-20">
        <TagIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        <h2 class="mb-2 text-3xl font-bold text-center">Tags Measurement</h2>
        <p class="text-center">Check the tags among the results</p>
        <div class="md:flex my-10 md:justify-center gap-2">
          <div class="md:w-1/2 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
            <QueryTagsList ref="taglistRef" :tag-data="tagData" :type-sum="typeSum" />
          </div>
          <div class="md:w-1/2 xl:w-1/3 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
            <QueryTagsChart :taglist-ref="taglistRef" :tag-names="tagNames" />
          </div>
        </div>
      </div>

      <div v-if="funds.length > 2" class="my-20">
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
        <router-link to="/projection" class="bg-violet-500 text-white py-0.5 px-2 font-bold rounded-sm flex gap-2" @click.native="scrollToTop">
          <LinkIcon class="w-4" />
          <span>Check projection</span>
        </router-link>
      </div>
      <p class="text-center">For a quick calculation based on this year's records.</p>

    </div>


    <RecordForm
    v-if="recordFormIsOpen"
    @close-form="resetRecordForm"
    :form-is-open="recordFormIsOpen"
    :preset="recordFormOptions.preset"
    />

  </div>
</template>

<script setup>
import { computed, ref, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useDateFormat } from '@vueuse/shared';
import { TagIcon, ArrowDownIcon, ArrowTrendingUpIcon, PlusIcon, LinkIcon, ArchiveBoxIcon } from '@heroicons/vue/24/solid';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { useFundStore } from '../stores/fundStore';
import { useAuthStore } from '../stores/authStore';
import { useRecordStore } from '../stores/recordStore';
import FundsList from '../components/fund/FundsList.vue';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement);
ChartJS.defaults = { responsive: true };

const QueryTagsList = defineAsyncComponent(() => import('../components/query/QueryTagsList.vue'));
const QueryTagsChart = defineAsyncComponent(() => import('../components/query/QueryTagsChart.vue'));
const QueryTotals = defineAsyncComponent(() => import('../components/query/QueryTotals.vue'));
const QueryTable = defineAsyncComponent(() => import('../components/query/QueryTable.vue'));
const FundsChart = defineAsyncComponent(() => import('../components/query/QueryFundsChart.vue'));
const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));

const fundStore = useFundStore();
const recordStore = useRecordStore();
const authStore = useAuthStore();

const { funds } = storeToRefs(fundStore);
const { records } = storeToRefs(recordStore);
const { loggingIn } = storeToRefs(authStore);
const recordFormIsOpen = ref(false);

const { tagData } = storeToRefs(recordStore);
const { typeSum } = storeToRefs(recordStore);
const { tagNames } = storeToRefs(recordStore);
const taglistRef = ref(null);

let recordFormOptions = {
  preset: null,
};

let recordsXls = [];
const typeNames = {
  0: "Assignment",
  1: "Credit",
  2: "Debit"
};

const balance = computed(() => {
  const total = funds.value.reduce((totalBalance, { balance }) => totalBalance + Number(balance), 0);
  const integer = Math.floor(total);
  const fractions = total
    .toString()
    .split('.')[1] || "0";
  const recomposed = [integer, fractions.slice(0, 2)].join(".");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(recomposed);
});

function resetRecordForm() {
  recordFormOptions = {
    preset: null,
  };
  recordFormIsOpen.value = false;
}

function scrollToTop() {
  setTimeout(() => {
    window.scrollTo(0,0);
  }, 250)
}

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


</script>
