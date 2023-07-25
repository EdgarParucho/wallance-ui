<template>
  <div class="py-4">
    <router-link class="hover:underline font-bold text-white" to="/dashboard">
      Dashboard
    </router-link>
    <h1 class="dark:text-white text-4xl font-bold">
      Records History
    </h1>
    
    <div class="lg:flex mt-5 space-x-1">
      <div class="lg:w-1/3">
        <PieChart id="tags-records" :labels="recordsTags" :data-values="tagsRecords" data-label=" %" />
      </div>
      <div class="lg:w-2/3">
        <LineChart id="month-balance" :labels="months" :data-values="monthsBalance" data-label="Balance (Credits - Debits)" />
      </div>
    </div>
    
    <small class="font-bold">Filters</small>
    <div class="p-2 bg-stone-800 flex-wrap flex justify-center">
      <button
      v-for="filter, i in filters"
      :key="i"
      :class="[filter.isApplied ? 'bg-yellow-400 text-stone-900' : 'bg-stone-900 text-white','text-xs font-bold rounded-xl w-24 m-1 py-1 px-2 transition-colors']"
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
import { ref, computed, watch, defineAsyncComponent, inject } from 'vue'
import AssignmentForm from '../components/record/AssignmentForm.vue';
import RecordCard from '../components/record/RecordCard.vue';
import PieChart from '../components/chart/PieChart.vue';
import LineChart from '../components/chart/LineChart.vue';
import { storeToRefs } from 'pinia';

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));
const recordStore = useRecordStore();
const displayAlert = inject("alert");

let originalRecord = null;
const loading = ref(false);
const { records } = storeToRefs(recordStore);
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
    name: 'Assignments',
    targetProperty: 'type',
    fn: (r) => r.type === 0,
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

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthsBalance = computed(() => {
  const result = [];
  months.forEach(month => {
    console.log(month);
    const monthMatch = (date) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date) === month;
    const monthRecords = records.value.filter(record => monthMatch(new Date(record.date)));
    const monthBalance = monthRecords.reduce((acc, record) => acc + record.amount, 0);
    result.push(monthBalance);
  })
  return result;
});

const date = new Date().getMonth()
const recordsTags = computed(() => Array.from(new Set([...records.value.map(record => record.tag)])))
const tagsRecords = computed(() => {
  const tagTotal = [];
  const debitRecords = records.value.filter(record => record.type === 2);
  recordsTags.value.forEach(tag => {
    const debitTagRecords = debitRecords.filter(record => record.tag === tag && record.type === 2);
    const tagRecordsTotal = debitTagRecords.length / debitRecords.length * 100;
    tagTotal.push(tagRecordsTotal);
  })
  return tagTotal;
});

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

function deleteRecord(record) {
  loading.value = true;
  recordStore.deleteRecord({ id: record.id })
    .then((message) => {
      displayAlert({ type: "success", title: "Done", text: message });
      recordFormIsOpen.value = false;
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
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
