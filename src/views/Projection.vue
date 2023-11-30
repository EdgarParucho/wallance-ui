<template>
  <div class="mb-8 mx-auto">
    <h1 class="text-4xl font-bold">Projection</h1>
    <p class="text-xl my-4">
      Based on this year's records (until the last month), let's try to make a rough calculation for upcoming months.
    </p>

    <div v-if="calculating" class="my-20 shadow-md mx-auto md:w-1/3 px-4 py-2 rounded-xl text-sm dark:bg-stone-800 bg-stone-400 h-44 animate-pulse" />

    <form v-else class="my-20 shadow-md mx-auto md:w-1/3 px-4 py-2 rounded-xl text-sm dark:bg-stone-800">
      <div class="text-center my-2 space-y-1">
        <label for="estimating-months">Time projecting</label>
        <select id="estimating-months" class="flex mx-auto rounded-sm text-center h-8 w-20 px-3 p-0 bg-transparent border-none focus:ring-stone-400 shadow-md" v-model="monthsProjecting">
          <option class="bg-stone-800 text-white" :value="12">1 y.</option>
          <option class="bg-stone-800 text-white" :value="24">2 y.</option>
          <option class="bg-stone-800 text-white" :value="36">3 y.</option>
          <option class="bg-stone-800 text-white" :value="48">4 y.</option>
          <option class="bg-stone-800 text-white" :value="60">5 y.</option>
        </select>
      </div>
      <dl>
        <div class="flex items-center justify-between">
          <dt class="font-bold">Fund name</dt>
          <dt class="font-bold">Avg. Balance (monthly)</dt>
        </div>
        <div v-for="fund in chartData.fundsData" :key="fund.id" class="flex items-center justify-between">
          <dd class="w-1/2">{{ fund.label }}</dd>
          <dd class="w-1/2 text-right">
            <button class="w-28 text-right hover:bg-stone-100 px-2 shadow-sm" type="button" @click="editCustomSample(fund.id, fund.monthlyAvg)">
              ${{ fund.monthlyAvg.toFixed() }}
            </button>
          </dd>
        </div>
      </dl>
      <small class="text-violet-400 flex justify-center">
        You can interact with the average balance to customize it.
      </small>
    </form>
    <Dialog :form-is-open="formIsOpen" @close-form="formIsOpen = false" :icon="CurrencyDollarIcon" title="Set an alternative average">
      <form @submit.prevent="overrideProjection(customAvgFundID, customMonthlyAvg)">
        <input type="number" v-model.number="customMonthlyAvg" class="bg-transparent border-transparent border-b border-stone-400">
        <div class="flex items-center justify-center gap-2">
          <button @click="overrideProjection(customAvgFundID, customMonthlyAvg)" type="button" class="rounded-sm shadow-sm w-20 my-4 text-sm bg-violet-500 text-white hover:bg-violet-600">
            Done
          </button>
          <button type="button" @click="formIsOpen = false" class="rounded-sm shadow-sm w-20 my-4 text-sm">Cancel</button>
        </div>
      </form>
    </Dialog>
    <div class="xl:w-10/12 mx-auto dark:bg-stone-800 p-2">
      <LineChart :chart-data="chartData" />
    </div>
    <div class="my-20">
      <LightBulbIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
      <h2 class="mb-2 text-3xl font-bold text-center">A close look</h2>
      <p class="mb-10 text-center">Some valuable data about your management</p>
      <h2 class="mb-2 text-2xl font-bold text-center">This year on average</h2>
      <Stats :sample-records="sampleRecords" />
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { CurrencyDollarIcon, LightBulbIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/shared";
import { useNow } from "@vueuse/core";
import { useRecordStore } from "../stores/recordStore";
import { useFundStore } from "../stores/fundStore";
import LineChart from "../components/projection/LineChart.vue";
import Dialog from '../components/layout/Dialog.vue';
import router from "../router";
import Stats from '../components/projection/Stats.vue';

onMounted(() => runProjection());

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

const monthsProjecting = ref(12);
const sampleBalance = ref({});
const customAvgFundID = ref("");
const customMonthlyAvg = ref(0);

const sampleDateRange = ref({ fromDate: "", toDate: "" });
sampleDateRange.value.fromDate = useDateFormat(useNow(), "YYYY-01-01").value;
sampleDateRange.value.toDate = useDateFormat(useNow(), "YYYY-MM-01").value;

async function runProjection() {
  calculating.value = true;
  await getSampleRecords();
  if (sampleRecords.value.length === 0) return showAlert({
    type: "info",
    text: "There are no records to take as sample for the projection."
  });
  setChartData();
  calculating.value = false;
}

function getSampleRecords() {
  if (sampleRecords.value.length > 0) return;
  return recordStore.getRecords({ filters: sampleDateRange.value }, true)
    .then((message) => {
      if (sampleRecords.value.length > 0) return showToast(message);
      calculating.value = false;
      showAlert({ type: "info", text: message });
      router.back();
    })
    .catch((error) => showAlert({ type: "error", text: error }))
}

function setChartData() {
  chartData.value.dates = [];
  chartData.value.fundsData = [];
  setProjectionDates();
  setFundsData();
}

function setProjectionDates() {
  let month = Number(useDateFormat(useNow(), "MM").value);
  let year = Number(useDateFormat(useNow(), 'YYYY').value);
  let monthsEstimated = 0;
  do {
    const projectionDate = useDateFormat(`${year}/${month}`, "MMM, YYYY").value;
    chartData.value.dates.push(projectionDate);
    if (month === 12) {
      month = 1;
      year++;
    } else {
      month++;
    }
    monthsEstimated++;
  } while (monthsEstimated <= monthsProjecting.value);
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
    const currentMonthProjection = balance + (balance / monthsPassed);
    const fundData = {
      id,
      label: getFundName(id),
      data: [currentMonthProjection],
      monthlyAvg: sampleBalance.value[id] / monthsPassed,
    };
    for (let month = 1; month <= monthsProjecting.value; month++) fundData.data.push(fundData.data[month-1] + fundData.monthlyAvg)
    chartData.value.fundsData.push(fundData);
  })
}

function overrideProjection(fundID, customAvg) {
  const dataIndex = chartData.value.fundsData.findIndex(fundData => fundData.id === fundID);
  const currentMonthProjection = sampleBalance.value[fundID] + customAvg;
  const fundData = {
    id: fundID,
    label: getFundName(fundID),
    data: [currentMonthProjection],
    monthlyAvg: customAvg,
  };
  for (let month = 1; month <= monthsProjecting.value; month++) fundData.data.push(fundData.data[month-1] + customAvg)
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

watch(monthsProjecting, () => setChartData())

</script>
