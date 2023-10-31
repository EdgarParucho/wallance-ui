<template>
  <div>
    <dl class="md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto">
      <div v-for="fund in funds" :key="fund.id" class="my-1 rounded-sm shadow-lg bg-white dark:bg-stone-800 flex justify-between items-center">
        <dt class="flex items-center gap-4 p-3">
          <ArchiveBoxIcon class="w-8 mx-auto p-1.5 rounded-full shadow-sm text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          {{ fund.name }}
        </dt>
        <dd class="flex justify-end my-2 mr-3">
          {{ getFundBalanceOnFilters(fund).currency }}
        </dd>
      </div>
    </dl>
    <div class="md:flex space-y-1 items-center justify-center gap-2 text-center mt-12">
      <dl class="h-28 md:w-4/12 xl:w-2/12 px-8 bg-white dark:bg-stone-800 p-4 rounded-md shadow-md">
        <dd class="font-semibold text-stone-900 dark:text-stone-100 text-4xl">
          {{ getAmountFormatted(creditsOnFilters) }}
        </dd>
        <dt class="leading-7 text-stone-600 dark:text-stone-400">Sum accredited on filters</dt>
      </dl>
      <dl class="h-36 md:w-4/12 xl:w-2/12 px-8 bg-white dark:bg-stone-800 p-4 rounded-md shadow-md flex items-center justify-center">
        <div>
          <dd class="font-semibold text-stone-900 dark:text-stone-100 text-5xl">
            {{ getAmountFormatted(balanceOnFilters) }}
          </dd>
          <dt class="leading-7 text-stone-600 dark:text-stone-400">Balance on filters</dt>
        </div>
      </dl>
      <dl class="h-28 md:w-4/12 xl:w-2/12 px-8 bg-white dark:bg-stone-800 p-4 rounded-md shadow-md">
        <dd class="font-semibold text-stone-900 dark:text-stone-100 text-4xl">
          {{ getAmountFormatted(debitsOnFilters) }}
        </dd>
        <dt class="leading-7 text-stone-600 dark:text-stone-400">Sum debited on filters</dt>
      </dl>
    </div>
    <div
    class="my-4 px-2 mx-auto md:w-2/3 lg:w-1/2 xl:w-1/3 flex items-center text-violet-500 bg-violet-600 bg-opacity-20 border-l-4 border-violet-700 rounded-sm py-2"
    v-show="balanceDiff && balanceDiff !== currentBalance"
    >
      <InformationCircleIcon class="w-8 text-left" />
      <span class="mx-auto font-bold">Difference between current balance and query's: {{ getAmountFormatted(balanceDiff) }}</span>
    </div>

  </div>
</template>

<script setup>
import { ArchiveBoxIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
import { useFundStore } from '../../stores/fundStore';
import { useRecordStore } from '../../stores/recordStore';
import { storeToRefs } from "pinia";

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

const balanceOnFilters = computed(() => Number(records.value
  .filter(record => record.type !== 0)
  .reduce((balance, { amount }) => balance + amount, 0)
  .toFixed(2))
);

const creditsOnFilters = computed(() => Number(records.value
  .filter(record => record.type === 1)
  .reduce((balance, { amount }) => balance + amount, 0)
  .toFixed(2))
);

const debitsOnFilters = computed(() => Number(records.value
  .filter(record => record.type === 2)
  .reduce((balance, { amount }) => balance + amount, 0)
  .toFixed(2))
);

const currentBalance = computed(() => funds.value.reduce((totalBalance, { balance }) => totalBalance + Number(balance), 0));

const balanceDiff = computed(() => {
  if (balanceOnFilters.value < 0) return currentBalance.value - balanceOnFilters.value
  return currentBalance.value - balanceOnFilters.value
})

function getAmountFormatted(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getFundBalanceOnFilters({ id }) {
  const fundBalanceOnFilters = records.value
    .filter(record => record.fundID === id || record.otherFundID === id)
    .reduce((balance, { fundID, amount }) => {
      const recordAmount = fundID === id ? amount : -amount;
      return balance + recordAmount;
    }, 0);
  return { currency: getAmountFormatted(fundBalanceOnFilters), numeric: fundBalanceOnFilters }
}

</script>