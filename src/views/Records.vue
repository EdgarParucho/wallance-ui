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
    :disabled="queryInProgress"
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
import RecordCard from '../components/record/RecordCard.vue';
import { useRecordStore } from '../stores/recordStore';
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useFundStore } from '../stores/fundStore';
import BalanceForm from '../components/fund/BalanceForm.vue';

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'))
const recordStore = useRecordStore()
const fundStore = useFundStore()

let originalRecord = null

const queryInProgress = ref(false)
const records = computed(() => recordStore.records)
const recordFormIsOpen = ref(false)
const balanceFormIsOpen = ref(false)
const filteredRecords = ref([])
const appliedFilters = computed(() => filters.value.filter(filter => filter.isApplied))
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
])

async function findRecords() {
  queryInProgress.value = true
  const fundsIDs = fundStore.funds.map(fund => fund._id)
  const getRecords = await recordStore.getRecords(fundsIDs)
  alert(getRecords.message)
  queryInProgress.value = false
}

function editRecord(record) {
  originalRecord = record
  if (record.type === 0) balanceFormIsOpen.value = true
  else recordFormIsOpen.value = true
}

function closeForm() {
  originalRecord = null
  if (balanceFormIsOpen.value) balanceFormIsOpen.value = false
  else recordFormIsOpen.value = false
}

function applyFilter(newFilter) {
  if (newFilter.isApplied) return newFilter.isApplied = false
  const conflictFilter = filters.value.find(
    filter => filter.isApplied && filter.targetProperty === newFilter.targetProperty
  )
  if (conflictFilter !== undefined) conflictFilter.isApplied = false
  newFilter.isApplied = true
}

function defineFundToUpdate(fundID, difference) {
  const relatedFund = fundStore.funds.find(fund => fund._id === fundID)
  const fundToUpdate = { ...relatedFund }
  fundToUpdate.savings += difference
  return fundToUpdate
}

function deleteRecord(record) {
  const requiredActions = []
  const subtractionIsRequired = record.type !== 2

  if (!subtractionIsRequired) return confirmDeletion(record, requiredActions)

  const fundToUpdate = defineFundToUpdate(record.targetID, -record.amount)
  if (fundToUpdate.savings < 0) return alert(
    `The record cannot be deleted since "${fundToUpdate.name}" would have a negative balance.\nYou can re-balance the fund first, then retry this action.`
  )
  requiredActions.push({ action: fundStore.updateFund, arg: fundToUpdate })
  confirmDeletion(record, requiredActions)
}

function confirmDeletion(record, requiredActions) {
  const additionIsRequired = record.type !== 1
  if (additionIsRequired) {
    const fundToUpdate = defineFundToUpdate(record.sourceID, record.amount)
    requiredActions.push({ action: fundStore.updateFund, arg: fundToUpdate })
  }
  requiredActions.push({ action: recordStore.deleteRecord, arg: record._id })

  const makePromises = (requiredActions) => Array.from(requiredActions, ({ action, arg }) => action(arg))
  Promise.all(makePromises(requiredActions))
    .then((responses) => {
      console.log('This should be third');
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
