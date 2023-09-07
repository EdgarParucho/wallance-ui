<template>
  <div>
    <dl class="md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto">
      <div v-for="fund in funds" :key="fund.id" class="my-1 rounded-md shadow-lg bg-white dark:bg-stone-800 flex justify-between items-center">
        <dt class="flex items-center gap-4 p-3">
          <ArchiveBoxIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          {{ fund.name }}
        </dt>
        <dd class="flex justify-end my-2 mr-3">
          {{ getFundBalanceOnFilters(fund).currency }}
        </dd>
      </div>
      <div class="h-20 font-bold my-10 rounded-lg shadow-lg bg-white dark:bg-stone-900 flex justify-between items-center">
        <dt class="flex items-center gap-4 p-3">
          <ScaleIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          Balance on filters
        </dt>
        <dd class="justify-end flex items-baseline my-2 mr-3">
          {{ getAmountFormatted(balanceOnFilters) }}
        </dd>
      </div>
    </dl>
    <div
    class="my-4 px-2 mx-auto md:w-2/3 lg:w-1/2 xl:w-1/3 flex items-center text-violet-500 bg-violet-900 bg-opacity-10 border-l-4 border-violet-700 rounded-sm py-2"
    v-show="balanceDiff && balanceDiff !== currentBalance"
    >
      <InformationCircleIcon class="w-8 text-left" />
      <span class="mx-auto font-bold">Difference between current balance and query's: {{ getAmountFormatted(balanceDiff) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ArchiveBoxIcon, InformationCircleIcon, ScaleIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

const props = defineProps(["funds", "filteredRecords"]);

const balanceOnFilters = computed(() => Number(props.filteredRecords
  .filter(record => record.type !== 0)
  .reduce((balance, { amount }) => balance + amount, 0)
  .toFixed(2))
);

const currentBalance = computed(() => props.funds.reduce((totalBalance, { balance }) => totalBalance + Number(balance), 0));

const balanceDiff = computed(() => {
  if (balanceOnFilters.value < 0) return currentBalance.value - balanceOnFilters.value
  return currentBalance.value - balanceOnFilters.value
})

const stats = [
  { id: 1, name: 'Of your income is saved', value: 45 + '%'},
  { id: 2, name: 'You are saving on average monthly', value: '$' + 320 },
  { id: 3, name: 'This year estimated savings', value: '$' + 12 * 12 },
];


function getAmountFormatted(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getFundBalanceOnFilters({ id }) {
  const fundBalanceOnFilters = props.filteredRecords
    .filter(record => record.fundID === id || record.otherFundID === id)
    .reduce((balance, { fundID, amount }) => {
      const recordAmount = fundID === id ? amount : -amount;
      return balance + recordAmount;
    }, 0);
  return { currency: getAmountFormatted(fundBalanceOnFilters), numeric: fundBalanceOnFilters }
}

</script>