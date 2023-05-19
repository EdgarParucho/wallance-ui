<template>
  <div class="py-4">
    <router-link class="hover:underline font-bold text-white" to="/dashboard">
      Dashboard
    </router-link>
    <h1 class="dark:text-white text-4xl font-bold">
      Records History
    </h1>
    <small class="font-bold">Filters</small>

    <div class="grid-flow-col p-2 bg-stone-800 flex-wrap">
      <button
      v-for="filter, i in filters"
      :key="i"
      :class="[filter.isApplied ? 'bg-stone-300 text-stone-900' : 'bg-stone-900 text-white','text-xs font-bold rounded-xl w-20 m-1 py-1 transition-colors']"
      @click="applyFilter(filter)"
      >
        {{ filter.name }}
      </button>
    </div>
    <button
    class="bg-yellow-500 hover:bg-yellow-400 rounded-md w-20 m-1 py-1 transition-colors disabled:bg-stone-700"
    @click="findRecords"
    :disabled="loading"
    >
      <MagnifyingGlassIcon class="w-5 h-5 text-stone-900 mx-auto" aria-hidden="true" />
    </button>

    <RecordCard
    v-for="record in filteredRecords"
    :key="record._id"
    :record="record"
    @edit-record="(record) => editRecord(record)"
    @delete-record="(record) => deleteRecord(record)"
    />
    <RecordForm
    v-if="recordFormIsOpen"
    :form-is-open="recordFormIsOpen"
    @close-form="closeForm"
    :editing="true"
    :original-record="originalRecord"
    />
    <BalanceForm
    v-if="balanceFormIsOpen"
    :form-is-open="balanceFormIsOpen"
    @close-form="closeForm"
    :editing="true"
    :original-record="originalRecord"
    />
  </div>
</template>

<script setup>
import { useRecordStore } from '../stores/recordStore';
import { useUserStore } from '../stores/userStore';
import { useFundStore } from '../stores/fundStore';
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import BalanceForm from '../components/fund/BalanceForm.vue';
import RecordCard from '../components/record/RecordCard.vue';

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'))
const recordStore = useRecordStore()
const fundStore = useFundStore()
const userStore = useUserStore();
let originalRecord = null

const userID = userStore.userID;
const loading = ref(false);
const records = computed(() => recordStore.records);
const recordFormIsOpen = ref(false);
const balanceFormIsOpen = ref(false);
const filteredRecords = ref([]);
const appliedFilters = computed(() => filters.value.filter(filter => filter.isApplied));
const filters = ref([
  {
    name: 'Credits',
    targetProperty: 'type',
    fn: (r) => r.type === 1,
    isApplied: false
  },
  {
    name: 'Debits',
    targetProperty: 'type',
    fn: (r) => r.type === 2,
    isApplied: false
  },
  {
    name: 'This month',
    targetProperty: 'date',
    fn: (r) => r.date.slice(0, 7) === new Date().toISOString().slice(0, 7),
    isApplied: false
  },
  {
    name: 'This year',
    targetProperty: 'date',
    fn: (r) => r.date.slice(0, 4) === new Date().toISOString().slice(0, 4),
    isApplied: false
  },
]);

function findRecords() {
  loading.value = true;
  const userFunds = fundStore.funds.map(fund => fund._id);
  recordStore.getRecords(userFunds)
    .then((message) => alert(message))
    .catch((error) => alert(error))
    .finally(() => loading.value = false)
}

function editRecord(record) {
  originalRecord = { ...record };
  delete originalRecord.user;
  if (record.type === 0) balanceFormIsOpen.value = true;
  else recordFormIsOpen.value = true;
}

function closeForm() {
  originalRecord = null;
  if (balanceFormIsOpen.value) balanceFormIsOpen.value = false;
  else recordFormIsOpen.value = false;
}

function applyFilter(newFilter) {
  if (newFilter.isApplied) return newFilter.isApplied = false;
  const conflictFilter = filters.value.find(
    filter => filter.isApplied && filter.targetProperty === newFilter.targetProperty
  );
  if (conflictFilter !== undefined) conflictFilter.isApplied = false;
  newFilter.isApplied = true;
}

function deleteRecord(record) {
  const actions = [];
  const subtractionIsRequired = record.type !== 2;

  if (!subtractionIsRequired) return executeActions(record, actions);

  const fundToUpdate = defineFundToUpdate(record.targetID, -record.amount);
  if (fundToUpdate.balance < 0) return alert(
    `The record cannot be deleted since "${fundToUpdate.name}" would have a negative balance.\nYou can re-balance the fund first, then retry this action.`
  );
  actions.push({ action: fundStore.updateFund, data: { userID, _id: fundToUpdate._id, body: { balance: fundToUpdate.balance } } });
  executeActions(record, actions);
}

function defineFundToUpdate(fundID, difference) {
  const relatedFund = fundStore.funds.find(fund => fund._id === fundID);
  const fundToUpdate = { ...relatedFund };
  fundToUpdate.balance += difference;
  return fundToUpdate;
}

function executeActions(record, actions) {
  const additionIsRequired = record.type !== 1;
  if (additionIsRequired) {
    const fundToUpdate = defineFundToUpdate(record.sourceID, record.amount)
    actions.push({ action: fundStore.updateFund, data: { userID, _id: fundToUpdate._id, body: { balance: fundToUpdate.balance } } });
  }
  actions.push({ action: recordStore.deleteRecord, data: { userID, _id: record._id } });

  const makePromises = (actions) => Array.from(actions, ({ action, data }) => action(data));
  Promise.all(makePromises(actions))
    .then((responses) => {
      const message = responses.join('\n')
      alert(message)
      recordFormIsOpen.value = false
    })
}

watch([records, appliedFilters], ([records, appliedFilters]) => {
  filteredRecords.value = records
  for(const filter of appliedFilters) filteredRecords.value = filteredRecords.value.filter(filter.fn)
}, { immediate: true })
</script>
