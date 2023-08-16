<template>
  <div class="py-4">
    <h1 class="text-white text-4xl font-bold">
      Records History
    </h1>

    <div class="lg:flex my-10 space-x-1 space-y-2 items-center shadow-md shadow-black transition-shadow rounded-md bg-stone-800 justify-center">
      <div class="lg:w-2/5">
        <DebitsByTagChart :filtered-records="filteredRecords" />
      </div>
      <div class="lg:w-3/5">
        <MonthlyBalanceChart :filtered-records="filteredRecords" />
      </div>
    </div>

    <div class="my-20">
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
import DebitsByTagChart from '../components/chart/DebitsByTagChart.vue';
import MonthlyBalanceChart from '../components/chart/MonthlyBalanceChart.vue';

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
