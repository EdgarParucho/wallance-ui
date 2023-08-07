<template>
  <div class="py-4">
    <h1 class="text-white text-4xl font-bold">
      Records History
    </h1>
    
    <div class="lg:flex mt-5 space-x-1 space-y-2 items-center shadow-md shadow-black transition-shadow rounded-md bg-stone-800 justify-center">
      <div class="lg:w-2/5">
        <DebitsByTagChart />
      </div>
      <div class="lg:w-3/5">
        <MonthlyBalanceChart />
      </div>
    </div>
    
    <RecordsTable @edit-record="(record) => editRecord(record)" @delete-record="(record) => deleteRecord(record)" />
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
import { ref, defineAsyncComponent, inject } from 'vue'
import AssignmentForm from '../components/record/AssignmentForm.vue';
import RecordsTable from '../components/record/RecordsTable.vue';
import DebitsByTagChart from '../components/chart/DebitsByTagChart.vue';
import MonthlyBalanceChart from '../components/chart/MonthlyBalanceChart.vue';
import { storeToRefs } from "pinia";

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));
const recordStore = useRecordStore();
const displayAlert = inject("alert");

let originalRecord = null;
const loading = ref(false);
const recordFormIsOpen = ref(false);
const assignmentFormIsOpen = ref(false);
const { records } = storeToRefs(recordStore);

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
