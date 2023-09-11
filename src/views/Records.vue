<template>
  <div class="py-4">
    <h1 class="text-4xl font-bold">
      Records History
    </h1>
    <p class="text-xl my-4">
      It's accurate to consider records as movements.
    </p>

    <h4 class="my-4 px-2 mx-auto md:w-3/4 lg:w-1/2 xl:w-1/3 justify-center flex items-center text-violet-500 bg-violet-600 bg-opacity-20 border-l-4 border-violet-700 rounded-sm py-2">
      <InformationCircleIcon class="w-8 text-left" />
      <span class="mx-auto font-bold">
        Data here is responsive to queries from the panel at the bottom
      </span>
    </h4>

    <div class="lg:flex my-10 p-10 justify-between items-center shadow-md rounded-md bg-white dark:bg-stone-800">
      <div class="grid w-4/12">
        <div class="p-10">
          <TagsEquivalenceChart :filtered-records="filteredRecords" />
        </div>
        <div>
          <TypesSumChart :filtered-records="filteredRecords" />
        </div>
      </div>
      <div class="lg:w-7/12">
        <MonthlyBalanceChart :filtered-records="filteredRecords" />
      </div>
    </div>

    <div class="lg:flex items-end gap-2 my-10 justify-center">
    </div>

    <div class="my-16">
      <ArchiveBoxIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
      <h2 class="mb-4 text-4xl font-bold text-center">Funds status</h2>
      <FundsRecords :funds="funds" :filtered-records="filteredRecords" />
    </div>

    <QueryForm :funds="funds" @runQuery="(filtersConfig) => appliedFilters = filtersConfig" />
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
import { ref, computed, inject, defineAsyncComponent } from 'vue'
import { useRecordStore } from '../stores/recordStore';
import { useFundStore } from '../stores/fundStore';
import { storeToRefs } from "pinia";
import AssignmentForm from '../components/record/AssignmentForm.vue';
import QueryForm from '../components/record/QueryForm.vue';
import RecordsTable from '../components/record/RecordsTable.vue';
import FundsRecords from '../components/record/FundsRecords.vue';
import TagsEquivalenceChart from '../components/chart/TagsEquivalenceChart.vue';
import MonthlyBalanceChart from '../components/chart/MonthlyBalanceChart.vue';
import TypesSumChart from '../components/chart/TypesSumChart.vue';
import { ArchiveBoxIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));
const recordStore = useRecordStore();
const fundStore = useFundStore();
const displayAlert = inject("alert");

const { records } = storeToRefs(recordStore);
const { funds } = storeToRefs(fundStore);
let originalRecord = null;
const loading = ref(false);
const recordFormIsOpen = ref(false);
const assignmentFormIsOpen = ref(false);

const appliedFilters = ref({
  tag: "",
  note: "",
  fromDate: null,
  toDate: null,
  type: null,
});

const filteredRecords = computed(() => {
  const activeFiltersKeys = Object.entries(appliedFilters.value)
  .filter(item => item[1] !== "" && item[1] !== null)
  .map(entry => entry[0]);
  if (activeFiltersKeys.length === 0 ) return records.value

  const resultingRecords = activeFiltersKeys.reduce((resultingArray, filterKey) => {
    const filterIsDate = (appliedFilters.value[filterKey] === "fromDate" || appliedFilters.value[filterKey] === "toDate");
    if (filterIsDate) appliedFilters.value[filterKey] = new Date(appliedFilters.value[filterKey]);
    const filterValue = appliedFilters.value[filterKey];
    if (filterKey === "fromDate") return resultingArray.filter(record => new Date(record.date) > new Date(appliedFilters.value[filterKey]))
    else if (filterKey === "toDate") return resultingArray.filter(record => new Date(record.date) < new Date(appliedFilters.value[filterKey]))
    else if (filterKey === "fundID") return resultingArray.filter(record => record.fundID === appliedFilters.value[filterKey] || record.otherFundID === appliedFilters.value[filterKey])
    else if (typeof filterValue === "string") return resultingArray.filter(record => record[filterKey]?.toLowerCase().includes(filterValue.toLowerCase()))
    else return resultingArray.filter(record => record[filterKey] === appliedFilters.value[filterKey])
  }, JSON.parse(JSON.stringify(records.value)));
  
  resultingRecords.forEach(r => r.date = new Date(r.date))
  return resultingRecords;
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

</script>
