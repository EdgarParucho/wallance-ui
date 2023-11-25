<template>
  <div>
    <form class="my-10 shadow-md mx-auto md:w-1/3 px-4 py-2 rounded-xl text-sm">
      <dl>
        <div class="flex items-center justify-between">
          <dt class="font-bold">Fund name</dt>
          <dt class="font-bold">Avg. Balance (monthly)</dt>
        </div>
        <div v-for="fund in estimationData.fundsData" :key="fund.id" class="flex items-center justify-between">
          <dd class="w-1/2">{{ fund.label }}</dd>
          <dd class="w-1/2 text-right">
            <button class="w-28 hover:bg-stone-200 px-2" type="button" @click="editCustomSample(fund.id)">
              ${{ fundAvgBalance[fund.id].toFixed(2) }}
            </button>
          </dd>
        </div>
      </dl>
      <button class="flex mx-auto justify-center my-2 w-24 px-2 py-1 rounded-sm shadow-sm text-sm bg-violet-500 text-white" @click="runEstimation" type="button">
        Estimate
      </button>
    </form>
    <Dialog :form-is-open="formIsOpen" @close-form="formIsOpen = false" :icon="CurrencyDollarIcon" title="Set an alternative average">
      <form @submit.prevent="overrideEstimation(customSampleTargetFund, customSample)">
        <input type="number" v-model.number="customSample" class="bg-transparent border-transparent border-b border-stone-400">
        <div class="flex items-center justify-center gap-2">
          <button @click="overrideEstimation(customSampleTargetFund, customSample)" type="button" class="rounded-sm shadow-sm w-20 my-4 text-sm bg-violet-500 text-white hover:bg-violet-600">
            Done
          </button>
          <button type="button" @click="formIsOpen = false" class="rounded-sm shadow-sm w-20 my-4 text-sm">Cancel</button>
        </div>
      </form>
    </Dialog>
    <LineChart :estimation-data="estimationData" />
  </div>
</template>

<script setup>
// Scenarios to consider:
// Not enough sample data (< 1 month)

import Dialog from '../components/layout/Dialog.vue';
import { ref, computed, inject, onMounted } from "vue";
import { useRecordStore } from "../stores/recordStore";
import { useFundStore } from "../stores/fundStore";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/shared";
import { useNow } from "@vueuse/core";
import LineChart from "../components/estimation/LineChart.vue";
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline';

onMounted(() => runEstimation());
const showToast = inject("showToast");
const showAlert = inject("showAlert");

const recordStore = useRecordStore();
const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);
const { sampleRecords } = storeToRefs(recordStore);

const formIsOpen =  ref(false);
const customSample = ref(0);
const customSampleTargetFund = ref({});

const currentMonth = Number(new Intl.DateTimeFormat('en-US', { month: '2-digit' }).format(new Date()));
const currentYear = Number(useDateFormat(useNow(), 'YYYY').value);
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const estimationInMonths = ref(12);
const calculating = ref(false);
const estimationData = ref({ dates: [useDateFormat(useNow(), "MMM, YYYY").value], fundsData: [] });

const fundAvgBalance = ref({});

function setFundsAverageBalances() {
  const monthsPassed = currentMonth - 1;
  const fundsEntries = funds.value.map(({ id }) => [[id], 0 ]);
  fundAvgBalance.value = Object.fromEntries(fundsEntries);
  sampleRecords.value.forEach(({ amount, fundID, otherFundID }) => {
    fundAvgBalance.value[fundID] += amount;
    if (otherFundID) fundAvgBalance.value[otherFundID] -= amount;
  })
  fundsEntries.forEach(([id]) => fundAvgBalance.value[id] /= monthsPassed)
}

function getSampleRecords() {
  calculating.value = true;
  const thisYearStartDate = useDateFormat(useNow(), "YYYY-01-01").value;
  return recordStore.getRecords({ filters: { fromDate: thisYearStartDate } }, true)
    .then((message) => {
      showToast(message)
    })
    .catch((error) => showAlert({ type: "error", text: error }))
    .finally(() => calculating.value = false)
}

async function runEstimation() {
  if (sampleRecords.value.length === 0) await getSampleRecords();
  setFundsAverageBalances()
  calculating.value = true;
  const estimationDates = [];
  for (let i = 1; i <= estimationInMonths.value; i++) {
    const nextMonth = months[currentMonth + i - 2] ?? months[currentMonth + i - 14]
    const estimationMonth = nextMonth;
    const estimationYear = (estimationMonth < currentMonth) ? (currentYear + 1) : currentYear;
    const estimationDate = useDateFormat(new Date(estimationYear, estimationMonth, 1), "MMM, YYYY").value;
    estimationDates.push(estimationDate);
  }

  const fundsData = [];
  funds.value.forEach(({ id, balance }) => {
    const fundData = {
      id,
      label: getFundName(id),
      data: [balance],
    };
    const fundAvg = fundAvgBalance.value[id];
    for (let i = 1; i <= estimationInMonths.value; i++) fundData.data.push(fundData.data[i-1] + fundAvg)
    fundsData.push(fundData)
  })
  estimationData.value.dates = estimationDates;
  estimationData.value.fundsData = fundsData;
}

function overrideEstimation(fundID, customAmount) {
  const dataIndex = estimationData.value.fundsData.findIndex(fundData => fundData.id === fundID)
  const fundData = {
    id: fundID,
    label: estimationData.value.fundsData[dataIndex].label,
    data: [estimationData.value.fundsData[dataIndex].data[0]],
  };
  for (let i = 1; i <= estimationInMonths.value; i++) fundData.data.push(fundData.data[i-1] + customAmount)
  estimationData.value.fundsData.splice(dataIndex, 1, fundData);
  formIsOpen.value = false;
  fundAvgBalance.value[fundID] = customAmount;
}

function getFundName(id) {
  return funds.value.find(fund => fund.id === id).name;
}

function editCustomSample(fundID) {
  customSampleTargetFund.value = fundID;
  formIsOpen.value = true;
}

</script>