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
    class="bg-yellow-500 hover:bg-yellow-400 rounded-md w-20 m-1 py-1 transition-colors"
    @click="recordStore.getRecords">
      <MagnifyingGlassIcon class="w-5 h-5 text-stone-900 mx-auto" aria-hidden="true" />
    </button>

    <RecordCard
    v-for="record in filteredRecords"
    :key="record.id"
    :record="record"
    @edit-record="(record) => editRecord(record)"
    />
    <RecordForm
    v-if="formIsOpen"
    :form-is-open="formIsOpen"
    @close-form="closeForm"
    :editing="true"
    :editing-record="editingRecord"
    />
  </div>
</template>

<script setup>
import RecordCard from '../components/record/RecordCard.vue';
import { useRecordStore } from '../stores/recordStore';
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'))
const recordStore = useRecordStore()

let editingRecord = null
const records = computed(() => recordStore.records)
const formIsOpen = ref(false)
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

function editRecord(record) {
  editingRecord = record
  formIsOpen.value = true
}
function closeForm() {
  editingRecord = null
  formIsOpen.value = false
}

function applyFilter(newFilter) {
  if (newFilter.isApplied) return newFilter.isApplied = false
  const conflictFilter = filters.value.find(
    filter => filter.isApplied && filter.targetProperty === newFilter.targetProperty
  )
  if (conflictFilter !== undefined) conflictFilter.isApplied = false
  newFilter.isApplied = true
}

watch([records, appliedFilters], ([records, appliedFilters]) => {
  filteredRecords.value = records
  for(const filter of appliedFilters) filteredRecords.value = filteredRecords.value.filter(filter.fn)
}, { immediate: true })
</script>
