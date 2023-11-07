<template>
  <dl>
    <div v-for="fund in funds" :key="fund.id" class="my-1 rounded-sm shadow-lg bg-white dark:bg-stone-800 flex justify-between items-center">
      <dt class="flex items-center gap-4 p-3">
        <ArchiveBoxIcon class="w-8 mx-auto p-1.5 rounded-full shadow-sm text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        {{ fund.name }}
      </dt>
      <dd class="flex justify-end my-2 mr-3">
        {{ balanceFormatted(fund) }}
      </dd>
    </div>
  </dl>
</template>

<script setup>
import { ArchiveBoxIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';

const props = defineProps({
  balanceOnRecords: {
    type: Boolean,
    default: false,
  }
})

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const recordStore = useRecordStore();
const { records } = storeToRefs(recordStore);

function getBalanceFormatted(amount) {
  const integer = Math.floor(amount);
  const fractions = amount
    .toString()
    .split('.')[1] || "0";
  const recomposed = [integer, fractions.slice(0, 2)].join(".")
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(recomposed)
}

function balanceFormatted(fund) {
  if (!props.balanceOnRecords) return getBalanceFormatted(fund.balance);
  const balanceOnRecords = records.value
    .filter(record => record.fundID === fund.id || record.otherFundID === fund.id)
    .reduce((balance, { fundID, amount }) => {
      const recordAmount = fundID === fund.id ? amount : -(amount);
      return balance + recordAmount;
    }, 0);
  return getBalanceFormatted(balanceOnRecords)
}

</script>