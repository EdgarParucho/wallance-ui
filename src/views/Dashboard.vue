<template>
  <main class="pb-20">

    <header class="mt-12 py-6 grid items-center">

      <h2 class="text-4xl text-center font-bold">Status</h2>
      <p class="mb-8 text-center text-lg text-stone-500 dark:text-stone-400">Overall balance</p>

      <dl class="md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto" :class="{ 'animate-pulse': loggingIn }">
        <div class="mb-1 mx-auto pt-1 h-20 w-80 rounded-sm bg-white dark:bg-stone-800">
          <div class="px-2 flex justify-between">
            <ScaleIcon class="rounded-full w-7 h-7 p-1 bg-stone-200 dark:bg-stone-900 text-stone-500 dark:text-stone-400" />
            <strong v-if="!loggingIn" class="text-2xl">{{ balance }}</strong>
          </div>
          <dt class="px-2 text-sm">Budget</dt>
          <dd class="px-2 text-xs text-stone-500 dark:text-stone-400">Total balance from funds.</dd>
        </div>
        <FundCard
          v-for="fund in funds"
          :key="fund.id"
          :fund="fund"
          @edit-fund="() => editFund(fund)"
          @validate-deletion="() => validateDeletion(fund)"
        />
      </dl>

      <div class="mt-10 flex items-center space-x-2 justify-center">
        <button
        class="text-white transition-all hover:bg-violet-600 bg-violet-500 rounded-sm w-32 px-2 flex items-center justify-around gap-1"
        @click="recordFormIsOpen = true"
        >
          <PlusIcon class="w-5" />
          <span>Add Record</span>
        </button>
        <button
        class="bg-white transition-all hover:ring-1 hover:ring-stone-400 dark:bg-stone-800 dark:hover:bg-stone-700 dark:hover:ring-0 rounded-sm w-32 px-2 flex items-center justify-around gap-1"
        @click="fundFormIsOpen = true">
          <PlusIcon class="w-5" />
          <span class="mx-auto">Add Fund</span>
        </button>
      </div>
    </header>


    <section v-if="records.length > 0"  class="mt-12 py-12 grid items-center bg-stone-200 dark:bg-stone-800">

      <QueryTotals :records="records" />

      <download-excel
      :fetch="formatToXls"
      class="bg-stone-100 dark:bg-stone-900 cursor-pointer my-6 w-28 rounded-sm shadow-md text-sm hover:scale-105 transition-transform px-2 py-1 justify-between flex items-center mx-auto"
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

    </section>


    <RecordForm
    v-if="recordFormIsOpen"
    @close-form="resetRecordForm"
    :form-is-open="recordFormIsOpen"
    :preset="recordFormOptions.preset"
    />

    <FundForm
    v-if="fundFormIsOpen"
    :editing-fund="editingFund"
    :form-is-open="fundFormIsOpen"
    @close-form="closeForm"
    />

  </main>
</template>

<script setup>
import { computed, ref, defineAsyncComponent, inject } from 'vue';
import { storeToRefs } from 'pinia';
import { useDateFormat } from '@vueuse/shared';
import { TagIcon, ArrowDownIcon, PlusIcon, ScaleIcon, ArchiveBoxIcon } from '@heroicons/vue/24/solid';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { useFundStore } from '../stores/fundStore';
import { useAuthStore } from '../stores/authStore';
import { useRecordStore } from '../stores/recordStore';
import swal from "sweetalert";
import FundCard from '../components/fund/FundCard.vue';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement);
ChartJS.defaults = { responsive: true };

const QueryTagsList = defineAsyncComponent(() => import('../components/query/QueryTagsList.vue'));
const QueryTagsChart = defineAsyncComponent(() => import('../components/query/QueryTagsChart.vue'));
const QueryTotals = defineAsyncComponent(() => import('../components/query/QueryTotals.vue'));
const QueryTable = defineAsyncComponent(() => import('../components/query/QueryTable.vue'));
const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));
const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'));

const showAlert = inject("showAlert");
const showToast = inject("showToast");

const fundStore = useFundStore();
const recordStore = useRecordStore();
const authStore = useAuthStore();

const { funds } = storeToRefs(fundStore);
const { records } = storeToRefs(recordStore);
const { loggingIn } = storeToRefs(authStore);
const recordFormIsOpen = ref(false);
const fundFormIsOpen = ref(false);
let editingFund = null;

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

function validateDeletion(fund) {
  if (fund.balance > 0) showAlert({
    type: "info",
    title: "Can't complete the action",
    text: "First, move the balance to another fund, then retry this action."
  });
  else confirmDeletion(fund);
}

async function confirmDeletion(fund) {
  const deleteIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: `Please confirm to delete "${fund.name}". The action is irreversible.`,
    buttons: true,
    timer: null,
  });
  if(!deleteIsConfirmed) return;
  fundStore.deleteFund(fund.id)
    .then((message) => showToast(message))
    .catch((message) => showAlert({ type: "error", text: message }))
}

function editFund(fund) {
  editingFund = fund
  fundFormIsOpen.value = true
}

function closeForm() {
  editingFund = null
  fundFormIsOpen.value = false
}

function resetRecordForm() {
  recordFormOptions = {
    preset: null,
  };
  recordFormIsOpen.value = false;
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
