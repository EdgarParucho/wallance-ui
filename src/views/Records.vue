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
    <RecordCard
    v-for="record in filteredRecords"
    :key="record.id"
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
    <AssignmentForm
    v-if="assignmentFormIsOpen"
    :form-is-open="assignmentFormIsOpen"
    @close-form="closeForm"
    :editing="true"
    :original-record="originalRecord"
    />
  </div>
</template>

<script setup>
import { useRecordStore } from '../stores/recordStore';
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import AssignmentForm from '../components/record/AssignmentForm.vue';
import RecordCard from '../components/record/RecordCard.vue';

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'))
const recordStore = useRecordStore()
let originalRecord = null

const loading = ref(false);
const records = computed(() => recordStore.records);
const recordFormIsOpen = ref(false);
const assignmentFormIsOpen = ref(false);
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
const sortOptions = ref([
{
    name: 'Date',
    targetProperty: 'date',
    fn: (a, b) => a.date - b.date,
    isApplied: true
  },
  {
    name: 'Amount',
    targetProperty: 'amount',
    fn: (a, b) => a.amount - b.amount,
    isApplied: false
  },
]);

function editRecord({ id }) {
  originalRecord = records.value.find(r => r.id === id);
  if (originalRecord.type === 0) assignmentFormIsOpen.value = true;
  else recordFormIsOpen.value = true;
}

function closeForm() {
  originalRecord = null;
  if (assignmentFormIsOpen.value) assignmentFormIsOpen.value = false;
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

function applySortOption(newOption) {
  if (newOption.isApplied) return newOption.isApplied = false;
  const conflictFilter = filters.value.find(
    filter => filter.isApplied && filter.targetProperty === newOption.targetProperty
  );
  if (conflictFilter !== undefined) conflictFilter.isApplied = false;
  newOption.isApplied = true;
}

function deleteRecord(record) {
  loading.value = true;
  recordStore.deleteRecord({ id: record.id })
    .then((message) => {
      alert(message)
      recordFormIsOpen.value = false
    })
    .catch((message) => alert(message))
    .finally(() => loading.value = false)
}

watch([records, appliedFilters], ([records, appliedFilters]) => {
  filteredRecords.value = appliedFilters.reduce((resultingArray, filter) => {
    return resultingArray.filter(filter.fn)
  }, JSON.parse(JSON.stringify(records)));
  filteredRecords.value.forEach(r => r.date = new Date(r.date))
  filteredRecords.value.sort((a, b) => a.date - b.date);
}, { immediate: true })
</script>
