<template>
  <main>

    <header class="mt-12 py-6 grid items-center">

      <ScaleIcon class="rounded-icon mx-auto mb-4 w-14 h-14 p-2 bg-white dark:bg-stone-800 shadow-md" />
      <h2 class="text-4xl text-center font-bold">Status</h2>
      <p class="mb-8 text-center text-lg text-stone-500 dark:text-stone-400">
        Overall balance
      </p>

      <dl :class="['mx-auto', { 'animate-pulse': loggingIn }]">
        <div class="mb-1 pt-1 h-20 w-80 rounded-sm bg-white dark:bg-stone-800">
          <div class="px-2 flex justify-between">
            <ScaleIcon class="rounded-icon" />
            <strong v-if="!loggingIn" class="text-2xl">{{ balance }}</strong>
          </div>
          <dt class="px-2 text-sm">Budget</dt>
          <dd class="px-2 text-xs text-stone-500 dark:text-stone-400">Total balance from funds.</dd>
        </div>
        <div
        class="mb-1 mx-auto h-26 pt-1 w-80 rounded-sm bg-white dark:bg-stone-800"
        v-for="fund in funds"
        :key="fund.id"
        :fund="fund"
        >
          <div class="px-2 flex justify-between">
            <ArchiveBoxIcon class="rounded-icon" />
            <strong class="text-lg font-light">{{ amountFormatted(fund.balance) }}</strong>
          </div>
          <dt class="px-2 text-sm">{{ fund.name }}</dt>
          <dd class="px-2 text-xs text-stone-500 dark:text-stone-400">{{ fund.description }}</dd>

          <div class="flex justify-evenly">
            <button
            class="w-1/2 py-0.5 hover:bg-stone-100 dark:hover:bg-stone-700 focus:bg-stone-100 dark:focus:bg-stone-700 focus:outline-none transition-colors"
            @click="editFund(fund)"
            >
              <PencilSquareIcon class="w-4 mx-auto" aria-hidden="true" />
            </button>
            <button
            class="w-1/2 py-0.5 text-red-400 hover:bg-red-100 dark:hover:bg-red-900 focus:bg-red-100 dark:focus:bg-red-900 focus:outline-none transition-colors disabled:text-stone-400 disabled:hover:bg-stone-100 dark:disabled:hover:bg-stone-800"
            @click="validateDeletion(fund)"
            :disabled="fund.isDefault"
            >
              <TrashIcon class="w-4 mx-auto" aria-hidden="true" />
            </button>
          </div>
        </div>
      </dl>

      <div class="mt-10 flex items-center space-x-2 justify-center">
        <button class="btn-primary" @click="recordFormIsOpen = true">
          <PlusIcon class="w-5" />
          <span>Add Record</span>
        </button>
        <button class="btn-secondary" @click="fundFormIsOpen = true">
          <PlusIcon class="w-5" />
          <span class="mx-auto">Add Fund</span>
        </button>
      </div>

    </header>


    <section  class="mt-12 py-12">

      <MagnifyingGlassIcon class="rounded-icon mx-auto mb-4 w-14 h-14 p-2 bg-white dark:bg-stone-800 shadow-md" />
      <h2 class="text-4xl font-bold text-center">Records</h2>
      <p v-if="oneOrMoreRecords" class="mb-8 text-center text-lg text-stone-500 dark:text-stone-400">
        {{ queryCompleted ? 'Query Results' : 'Current Month' }}
      </p>
      
      <QueryTable v-if="oneOrMoreRecords" />
      <QueryBalance v-if="oneOrMoreRecords" :records="records" />

      <div class="mt-10 flex items-center space-x-2 justify-center">
        <button class="btn-primary w-36" @click="queryPanelIsOpen = true">
          <MagnifyingGlassIcon class="w-5" />
          <span>Make a Query</span>
        </button>
        <download-excel v-if="oneOrMoreRecords" :fetch="formatToXls" class="btn-secondary cursor-pointer w-36">
          <ArrowDownIcon class="w-5" />
          <span>Export .xls</span>
        </download-excel>
      </div>

      <p class="mt-20 text-center bg-violet-500 bg-opacity-20 w-1/2 mx-auto border-l-2 border-violet-500 rounded-sm">
        oneOrMoreTags: {{ oneOrMoreTags }}
      </p>

      <div v-if="oneOrMoreRecords" v-show="oneOrMoreTags" class="my-20">
        <TagIcon class="rounded-icon mx-auto mb-4 w-14 h-14 p-2 bg-white dark:bg-stone-800 shadow-md" />
        <h2 class="text-4xl font-bold text-center">Tags Measurement</h2>
        <p class="mb-8 text-center text-lg text-stone-500 dark:text-stone-400">
          Check the tags among the results
        </p>
        <div class="md:flex my-10 md:justify-center gap-2">
          <div class="md:w-1/2 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
            <!-- <QueryTags ref="taglistRef" :tag-data="tagData" :type-sum="typeSum" /> -->
          </div>
          <!-- <div class="md:w-1/2 xl:w-1/4 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
            <QueryChart :taglist-ref="taglistRef" :tag-names="tagNames" />
          </div> -->
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

    <QueryPanel
    v-if="queryPanelIsOpen"
    @close-form="queryPanelIsOpen = false"
    @confirm-query-completion="queryCompleted = true"
    :form-is-open="queryPanelIsOpen"
    />

  </main>
</template>

<script setup>
import { computed, ref, defineAsyncComponent, inject } from 'vue';
import { storeToRefs } from 'pinia';
import { useDateFormat } from '@vueuse/shared';
import {
  ScaleIcon,
  ArchiveBoxIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowDownIcon,
  TagIcon,
} from '@heroicons/vue/24/solid';
import { useFundStore } from '../stores/fundStore';
import { useAuthStore } from '../stores/authStore';
import { useRecordStore } from '../stores/recordStore';
import swal from "sweetalert";

const QueryPanel = defineAsyncComponent(() => import('../components/query/QueryPanel.vue'));
const QueryTags = defineAsyncComponent(() => import('../components/query/QueryTags.vue'));
const QueryChart = defineAsyncComponent(() => import('../components/query/QueryChart.vue'));
const QueryBalance = defineAsyncComponent(() => import('../components/query/QueryBalance.vue'));
const QueryTable = defineAsyncComponent(() => import('../components/query/QueryTable.vue'));
const RecordForm = defineAsyncComponent(() => import('../components/form/RecordForm.vue'));
const FundForm = defineAsyncComponent(() => import('../components/form/FundForm.vue'));

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
const queryPanelIsOpen = ref(false);
const queryCompleted = ref(false);
const taglistRef = ref(null);

const oneOrMoreTags =  computed(() => Object.values(recordStore.tagsByType).flat().length > 0);

const oneOrMoreRecords = computed(() => recordStore.records.length > 0);

let editingFund = null;

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

function amountFormatted(amount = 0) {
  const integer = Math.floor(amount);
  const fractions = amount
    .toString()
    .split('.')[1] || "0";
  const recomposed = [integer, fractions.slice(0, 2)].join(".")
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
   }).format(recomposed)
}

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
