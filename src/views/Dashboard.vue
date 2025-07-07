<template>
  <main class="pt-12">

    <div
    v-if="authStore.inDemoMode"
    role="alert"
    class="sticky left-2 top-16 w-16 px-2 rounded-dm text-sm bg-violet-500 border-l border-violet-500 text-violet-500 bg-opacity-20"
    >Demo</div>

    <section class="h-screen">

      <ScaleIcon class="rounded-icon mx-auto mb-4 w-14 h-14 p-2 bg-stone-200 dark:bg-stone-800 shadow-md" />
      <h2 class="text-4xl text-center font-bold">Status</h2>
      <p class="mb-8 text-center text-lg text-stone-500 dark:text-stone-400">
        Balance and funds
      </p>

      <div :class="['mb-1 mx-auto h-26 p-2 w-80 rounded-sm shadow-md', { 'animate-pulse': loggingIn }]">
        <div class="flex justify-between">
          <ScaleIcon class="rounded-icon" />
          <dd>
            <strong v-if="!loggingIn" class="text-lg font-light">
              ${{ balance }}
            </strong>
          </dd>
        </div>
        <dt class="text-sm">Balance</dt>
      </div>

      <div
      v-if="authStore.inDemoMode"
      class="alert"
      role="note"
      >
        <p>Funds allow you to organize your balance and group related records.</p>
      </div>

      <dl
      class="mt-6 grid grid-cols-1 md:grid-cols-2 grid-flow-row-dense gap-4"
      :class="{'lg:grid-cols-3': funds.length % 3 == 0 }">
        <div
        :class="['mb-1 mx-auto h-26 pt-1 w-80 rounded-sm shadow-md', { 'animate-pulse': loggingIn }]"
        v-for="fund in funds"
        :key="fund.id"
        >
          <div class="px-2 flex justify-between">
            <ArchiveBoxIcon class="rounded-icon" />
            <strong class="text-lg font-light">${{ amountFormatted(fund.balance) }}</strong>
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
            @click="confirmFundDeletion(fund)"
            :disabled="fund.isDefault"
            >
              <TrashIcon class="w-4 mx-auto" aria-hidden="true" />
            </button>
          </div>
        </div>
      </dl>

      <div class="mt-10 flex items-center space-x-2 justify-center disabled:bg-stone-600 dark:disabled:bg-stone-600">
        <button class="btn-primary" @click="recordFormIsOpen = true" :disabled="loggingIn">
          <PlusIcon class="w-5" />
          <span>Add Record</span>
        </button>
        <button class="btn-secondary" @click="fundFormIsOpen = true">
          <PlusIcon class="w-5" />
          <span class="mx-auto">Add Fund</span>
        </button>
      </div>

    </section>


    <section  class="h-screen">

      <MagnifyingGlassIcon class="rounded-icon mx-auto mb-4 w-14 h-14 p-2 bg-white dark:bg-stone-800 shadow-md" />
      <h2 class="text-4xl font-bold text-center">Records</h2>
      <p v-if="oneOrMoreRecords" class="mb-8 text-center text-lg text-stone-500 dark:text-stone-400">
        {{ (queryExecuted || authStore.inDemoMode) ? 'Query Results' : 'Current Month' }}
      </p>

      <div
      v-if="authStore.inDemoMode"
      class="alert"
      role="note"
      >
        <p>Here you'll find the records loaded on log in, or from queries.</p>
      </div>

      <QueryTable
      v-if="oneOrMoreRecords"
      @edit-record="editRecord"
      @confirm-record-deletion="confirmRecordDeletion"
      />
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
    </section>

    <section v-if="oneOrMoreRecords && oneOrMoreTags" class="px-2 h-screen">
      <TagIcon class="rounded-icon mx-auto mb-4 w-14 h-14 p-2 bg-white dark:bg-stone-800 shadow-md" />
      <h2 class="text-4xl font-bold text-center">Tags Measurement</h2>
      <p class="mb-8 text-center text-lg text-stone-500 dark:text-stone-400">
        Tags from records showed above
      </p>
      <div
      v-if="authStore.inDemoMode"
      class="alert"
      role="note"
      >
        <p>This section is here to help you analyze the records shown above.</p>
      </div>
      <div class="md:flex my-10 md:justify-center gap-2">
        <div class="md:w-1/2 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
          <QueryTags v-if="oneOrMoreRecords && oneOrMoreTags" ref="tagsDataRef" />
        </div>
        <div class="md:w-1/2 xl:w-1/4 my-1 p-2 shadow-md rounded-md bg-white dark:bg-stone-800">
          <QueryChart v-if="oneOrMoreRecords && oneOrMoreTags" :tags-data-ref="tagsDataRef" />
        </div>
      </div>

    </section>

    <transition name="fade" mode="out-in">
      <RecordForm
        v-if="recordFormIsOpen"
        :editing="editingRecord"
        :form-is-open="recordFormIsOpen"
        :selected-record="selectedRecord"
        @close-form="closeRecordForm"
        />
    </transition>

    <transition name="fade" mode="out-in">
      <FundForm
      v-if="fundFormIsOpen"
      :form-is-open="fundFormIsOpen"
      :editing="editingFund"
      :selected-fund="selectedFund"
      @close-form="closeFundForm"
      />
    </transition>

    <transition name="fade" mode="out-in">
      <QueryPanel
      v-if="queryPanelIsOpen"
      :form-is-open="queryPanelIsOpen"
      @confirm-query-execution="queryExecuted = true"
      @close-form="queryPanelIsOpen = false"
      />
    </transition>

  </main>
</template>

<script setup>
import { defineAsyncComponent, inject, ref, computed, onMounted } from 'vue';
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
import { useAuthStore } from '../stores/authStore';
import { useFundStore } from '../stores/fundStore';
import { useRecordStore } from '../stores/recordStore';
import swal from 'sweetalert';
import router from '../router';

onMounted(() => {
  if (router.currentRoute.value.path == '/demo') loginToDemo()
});

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
const queryExecuted = ref(false);
const tagsDataRef = ref({ type: 2, tagsData: [] });

const oneOrMoreRecords = computed(() => recordStore.records.length > 0);
const oneOrMoreTags =  computed(() => Object.values(recordStore.tagsByRecordType).flat().length > 0);

let selectedFund = null;
let selectedRecord = null;
let editingRecord = false;
let editingFund = false;
let recordsXls = [];
const typeNames = {
  0: "Fund to Fund",
  1: "Credit",
  2: "Debit"
};

const balance = computed(() => {
  const fundsBalance = funds.value.reduce((sum, { balance }) => sum + Number(balance), 0);
  return amountFormatted(fundsBalance);
});

function amountFormatted(amount) {
  return (amount < 0) ? String(Number(-amount).toFixed(2)) : String(Number(amount).toFixed(2));
}

function editFund(fund) {
  editingFund = true;
  selectedFund = fund;
  fundFormIsOpen.value = true;
}

async function confirmFundDeletion(fund) {
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

function closeFundForm() {
  editingFund = false;
  selectedFund = null;
  fundFormIsOpen.value = false;
}

function editRecord(record) {
  editingRecord = true;
  selectedRecord = record;
  recordFormIsOpen.value = true;
}

async function confirmRecordDeletion(record) {
  const deleteIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: `Please confirm to delete this record. The action is irreversible.`,
    buttons: true,
    timer: null,
  });
  if(!deleteIsConfirmed) return;
  recordStore.deleteRecord({ id: record.id })
    .then((message) => showToast(message))
    .catch((message) => showAlert({ type: "error", text: message }))
}

function closeRecordForm() {
  editingRecord = false;
  selectedRecord = null;
  recordFormIsOpen.value = false;
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

function getFundName (id) {
  return funds.value.find(f => f.id === id).name;
}

function loginToDemo() {
  authStore.login({ inDemoMode: true })
    .then(() => showToast('Welcome! Check around and manage the data freely.'))
    .then(() => recordStore.getRecords({}))
    .catch((message) => showToast(message));
}

</script>
