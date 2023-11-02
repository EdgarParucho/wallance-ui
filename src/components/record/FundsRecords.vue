<template>
  <div>
    <dl>
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
  </div>
</template>

<script setup>
import { ArchiveBoxIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

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