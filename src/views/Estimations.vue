<template>
  <div>
    <form class="my-10 shadow-md mx-auto md:w-1/3 px-4 py-2 rounded-xl text-sm">
      <dl>
        <div class="flex items-center justify-between">
          <dt class="font-bold">Fund name</dt>
          <dt class="font-bold">Avg. Balance (monthly)</dt>
        </div>
        <div v-for="fund in chartData.fundsData" :key="fund.id" class="flex items-center justify-between">
          <dd class="w-1/2">{{ fund.label }}</dd>
          <dd class="w-1/2 text-right">
            <button class="w-28 text-right hover:bg-stone-200 px-2" type="button" @click="editCustomSample(fund.id, fund.monthlyAvg)">
              ${{ fund.monthlyAvg }}
            </button>
          </dd>
        </div>
      </dl>
      <button class="flex mx-auto justify-center my-2 w-24 px-2 py-1 rounded-sm shadow-sm text-sm bg-violet-500 text-white" @click="runEstimation" type="button">
        Estimate
      </button>
    </form>
    <Dialog :form-is-open="formIsOpen" @close-form="formIsOpen = false" :icon="CurrencyDollarIcon" title="Set an alternative average">
      <form @submit.prevent="overrideEstimation(customAvgFundID, customMonthlyAvg)">
        <input type="number" v-model.number="customMonthlyAvg" class="bg-transparent border-transparent border-b border-stone-400">
        <div class="flex items-center justify-center gap-2">
          <button @click="overrideEstimation(customAvgFundID, customMonthlyAvg)" type="button" class="rounded-sm shadow-sm w-20 my-4 text-sm bg-violet-500 text-white hover:bg-violet-600">
            Done
          </button>
          <button type="button" @click="formIsOpen = false" class="rounded-sm shadow-sm w-20 my-4 text-sm">Cancel</button>
        </div>
      </form>
    </Dialog>
    <LineChart :estimation-data="chartData" />
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/shared";
import { useNow } from "@vueuse/core";
import { useRecordStore } from "../stores/recordStore";
import { useFundStore } from "../stores/fundStore";
import LineChart from "../components/estimation/LineChart.vue";
import Dialog from '../components/layout/Dialog.vue';

onMounted(() => runEstimation());

const showToast = inject("showToast");
const showAlert = inject("showAlert");

const fundStore = useFundStore();
const recordStore = useRecordStore();
const { funds } = storeToRefs(fundStore);
const { sampleRecords } = storeToRefs(recordStore);

const formIsOpen =  ref(false);
const calculating = ref(false);

const chartData = ref({
  dates: [],
  fundsData: [],
});

const monthsToEstimate = ref(12);
const sampleBalance = ref({});
const customAvgFundID = ref("");
const customMonthlyAvg = ref(0);

const sampleDateRange = ref({ fromDate: "", toDate: "" });
sampleDateRange.value.fromDate = useDateFormat(useNow(), "YYYY-01-01").value;
sampleDateRange.value.toDate = useDateFormat(useNow(), "YYYY-MM-01").value;

async function runEstimation() {
  calculating.value = true;
  await getSampleRecords();
  if (sampleRecords.value.length === 0) return showAlert({
    type: "caution",
    text: "There are no records to take as sample for estimations. Come back after adding some records."
  });
  setChartData();
  calculating.value = false;
}

function getSampleRecords() {
  if (sampleRecords.value.length > 0) return;
  return recordStore.getRecords({ filters: sampleDateRange.value }, true)
    .then((message) => showToast(message))
    .catch((error) => showAlert({ type: "error", text: error }))
}

function setChartData() {
  chartData.value.dates = [];
  chartData.value.fundsData = [];
  setEstimationDates();
  setFundsData();
}

function setEstimationDates() {
  let month = Number(useDateFormat(useNow(), "MM").value);
  let year = Number(useDateFormat(useNow(), 'YYYY').value);
  let monthsEstimated = 0;
  do {
    const estimationDate = useDateFormat(`${year}/${month}`, "MMM, YYYY").value;
    chartData.value.dates.push(estimationDate);
    if (month === 12) {
      month = 1;
      year++;
    } else {
      month++;
    }
    monthsEstimated++;
  } while (monthsEstimated <= monthsToEstimate.value);
}

function setFundsData() {
  const fundsEntries = funds.value.map(({ id }) => [id, 0]);
  const currentMonth = Number(useDateFormat(useNow(), "MM").value);
  const monthsPassed = currentMonth - 1;
  
  sampleBalance.value = Object.fromEntries(fundsEntries);
  sampleRecords.value.forEach(({ amount, fundID, otherFundID }) => {
    sampleBalance.value[fundID] += amount;
    if (otherFundID) sampleBalance.value[otherFundID] -= amount;
  })

  const fundsData = Object.entries(sampleBalance.value);
  fundsData.forEach(([id, balance]) => {
    const currentMonthEstimation = balance + (balance / monthsPassed);
    const fundData = {
      id,
      label: getFundName(id),
      data: [currentMonthEstimation],
      monthlyAvg: sampleBalance.value[id] / monthsPassed,
    };
    for (let month = 1; month <= monthsToEstimate.value; month++) fundData.data.push(fundData.data[month-1] + fundData.monthlyAvg)
    chartData.value.fundsData.push(fundData);
  })
}

function overrideEstimation(fundID, customAvg) {
  const dataIndex = chartData.value.fundsData.findIndex(fundData => fundData.id === fundID);
  const currentMonthEstimation = sampleBalance.value[fundID] + customAvg;
  const fundData = {
    id: fundID,
    label: getFundName(fundID),
    data: [currentMonthEstimation],
    monthlyAvg: customAvg,
  };
  for (let month = 1; month <= monthsToEstimate.value; month++) fundData.data.push(fundData.data[month-1] + customAvg)
  chartData.value.fundsData.splice(dataIndex, 1, fundData);
  formIsOpen.value = false;
  sampleBalance.value[fundID] = customAvg;
}

function getFundName(id) {
  return funds.value.find(fund => fund.id === id).name;
}

function editCustomSample(fundID, monthlyAvg) {
  customAvgFundID.value = fundID;
  customMonthlyAvg.value = monthlyAvg;
  formIsOpen.value = true;
}

</script>
