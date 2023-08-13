<template>
  <div class="py-4">
    <h1 class="text-white text-4xl font-bold">
      Records History
    </h1>

    <div class="lg:flex mt-5 space-x-1 space-y-2 items-center shadow-md shadow-black transition-shadow rounded-md bg-stone-800 justify-center">
      <div class="lg:w-2/5">
        <DebitsByTagChart :filtered-records="filteredRecords" />
      </div>
      <div class="lg:w-3/5">
        <MonthlyBalanceChart :filtered-records="filteredRecords" />
      </div>
    </div>

    <FundsRecords :funds="funds" :filtered-records="filteredRecords" />

    <div class="md:flex items-end justify-between mt-12 mx-auto 2xl:w-2/3 space-y-3">
      <div class="grid">
        <div class="flex items-center justify-between my-1">
          <small class="text-white text-xs mb-1 font-bold">Find by tag</small>
          <button class="hover:text-white text-stone-300 rounded-full" @click="tagFilter = ''">
            <XCircleIcon class="w-5" />
          </button>
        </div>
        <select
        placeholder="Tag"
        class="bg-transparent text-white focus:border-transparent focus:border-yellow-300 focus:ring-0 border-stone-300 focus:bg-stone-700 transition-colors rounded-sm"
        v-model="tagFilter"
        >
          <option v-for="tag, i in tagOptions" :key="i">{{ tag }}</option>
        </select>
      </div>
      <div class="grid my-2">
        <small class="text-white text-xs mb-1 font-bold">Find by text in note</small>
        <input
        placeholder="Case insensitive"
        type="text"
        class="bg-transparent text-white border-transparent border-b-stone-300 focus:border-yellow-300 focus:ring-0 focus:bg-stone-700 transition-colors rounded-sm"
        v-model="noteFilter"
        >
      </div>
      <div class="p-2 flex-wrap flex justify-center">
        <button
        v-for="filter, i in filters"
        :key="i"
        :class="[filter.isApplied ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-stone-700 hover:bg-stone-800 text-white','text-xs font-bold rounded-xl w-24 m-1 py-1 px-2 transition-colors']"
        @click="applyFilter(filter)"
        >
          {{ filter.name }}
        </button>
      </div>
    </div>

    <RecordsTable
    @edit-record="(record) => editRecord(record)"
    @delete-record="(record) => deleteRecord(record)"
    :filtered-records="filteredRecords"
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
import { ref, computed, watch, inject, defineAsyncComponent } from 'vue'
import { useRecordStore } from '../stores/recordStore';
import { useFundStore } from '../stores/fundStore';
import { storeToRefs } from "pinia";
import { XCircleIcon } from '@heroicons/vue/24/outline';
import AssignmentForm from '../components/record/AssignmentForm.vue';
import RecordsTable from '../components/record/RecordsTable.vue';
import FundsRecords from '../components/record/FundsRecords.vue';
import DebitsByTagChart from '../components/chart/DebitsByTagChart.vue';
import MonthlyBalanceChart from '../components/chart/MonthlyBalanceChart.vue';

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));
const recordStore = useRecordStore();
const fundStore = useFundStore();
const displayAlert = inject("alert");

const { records, recordTags } = storeToRefs(recordStore);
const { funds } = storeToRefs(fundStore);
let originalRecord = null;
const loading = ref(false);
const recordFormIsOpen = ref(false);
const assignmentFormIsOpen = ref(false);

const filteredRecords = ref([]);
const tagFilter = ref("");
const noteFilter = ref("");
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
const appliedFilters = computed(() => filters.value.filter(filter => filter.isApplied));
const tagOptions = computed(() => Object.values(recordTags.value).flat());

function applyFilter(newFilter) {
  if (newFilter.isApplied) return newFilter.isApplied = false;
  const conflictFilter = filters.value.find(
    filter => filter.isApplied && filter.targetProperty === newFilter.targetProperty
  );
  if (conflictFilter !== undefined) conflictFilter.isApplied = false;
  newFilter.isApplied = true;
}

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

watch([records, appliedFilters, noteFilter, tagFilter], ([records, appliedFilters, noteFilterValue, tagFilterValue]) => {
  
  filteredRecords.value = appliedFilters.reduce((resultingArray, filter) => {
    return resultingArray.filter(filter.fn)
  }, JSON.parse(JSON.stringify(records)))

  if (noteFilterValue) filteredRecords.value = filteredRecords.value.filter((record) => {
    if (!record.note) return false
    return record.note.toLowerCase().includes(noteFilterValue.toLowerCase())  
  });

  if (tagFilterValue) filteredRecords.value = filteredRecords.value.filter((record) => {
    if (!record.tag) return false
    return record.tag.toLowerCase().includes(tagFilterValue.toLowerCase())
  });

  filteredRecords.value.forEach(r => r.date = new Date(r.date))
  filteredRecords.value.sort((a, b) => b.date - a.date);
}, { immediate: true })

</script>
