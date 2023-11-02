<template>
  <div class="py-4">
    <h1 class="text-4xl font-bold px-4">
      Records History
    </h1>
    <p class="text-xl my-4 px-4">
      Find and manage your records from here.
    </p>

    <QueryPanel />
    
    <div v-if="records.length > 0">

      <QueryTotals class="mt-24" />
      <RecordsTable
      @edit-record="(record) => editRecord(record)"
      @delete-record="(record) => deleteRecord(record)"
      />

      <div class="md:flex my-10 justify-center space-x-1">
        <div class="md:w-1/3 p-4 shadow-md rounded-md bg-white dark:bg-stone-800">
          <TopTags :records="records" />
        </div>
        <div class="md:w-1/3 p-4 shadow-md rounded-md bg-white dark:bg-stone-800">
          <TagsEquivalenceChart />
        </div>
      </div>

      <div class="md:flex my-10 md:justify-center">
        <div class="md:w-1/3 p-4 shadow-md rounded-md bg-white dark:bg-stone-800">
          <ArchiveBoxIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          <h2 class="mb-4 text-xl font-bold text-center">Funds management</h2>
          <BalanceByFundChart />
          <FundsRecords :funds="funds" />
        </div>
      </div>

      <div class="lg:flex my-10 justify-center items-center">
        <div class="lg:w-7/12 p-10 shadow-md rounded-md bg-white dark:bg-stone-800">
          <h4 class="text-xl font-bold text-center mb-4 text-stone-600 dark:text-stone-300">
            Balance - Current year
          </h4>
          <MonthlyBalanceChart />
        </div>
      </div>

      
    </div>

    <RecordForm
    v-if="recordFormIsOpen"
    :form-is-open="recordFormIsOpen"
    @close-form="resetForm"
    :editing="true"
    :preset="originalRecord"
    />
  </div>
</template>

<script setup>
import { ArchiveBoxIcon, TagIcon } from '@heroicons/vue/24/outline';
import { ref, inject, defineAsyncComponent } from 'vue'

import { storeToRefs } from "pinia";
import { useFundStore } from '../stores/fundStore';
import { useRecordStore } from '../stores/recordStore';

import QueryPanel from '../components/query/QueryPanel.vue';
import RecordsTable from '../components/record/RecordsTable.vue';
import FundsRecords from '../components/record/FundsRecords.vue';
import TagsEquivalenceChart from '../components/chart/TagsEquivalenceChart.vue';
import BalanceByFundChart from '../components/chart/BalanceByFundChart.vue';
import MonthlyBalanceChart from '../components/chart/MonthlyBalanceChart.vue';
import TopTags from '../components/dashboard/TopTags.vue'
import QueryTotals from '../components/query/QueryTotals.vue'

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const displayAlert = inject("alert");

const loading = ref(false);
const recordFormIsOpen = ref(false);

let originalRecord = null;

function editRecord(record) {
  originalRecord = record;
  recordFormIsOpen.value = true;
}

function resetForm() {
  originalRecord = null;
  recordFormIsOpen.value = false;
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
