<template>
  <dl>
    <FundCard
      v-for="fund in funds"
      :key="fund.id"
      :fund="fund"
      @edit-fund="(fund) => editFund(fund)"
      @confirm-deletion="(fund) => confirmDeletion(fund)"
    />
  </dl>
</template>

<script setup>
import { ArchiveBoxIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';
import FundCard from './FundCard.vue';

const props = defineProps({
  balanceOnRecords: {
    type: Boolean,
    default: false,
  },
})

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const recordStore = useRecordStore();
const { typeSum } = storeToRefs(recordStore);

function getFundBalance({ id, balance, isDefault }) {
  if (!props.balanceOnRecords) return getBalanceFormatted(balance);
  const fundCreditSum = typeSum.value[1].byFund[id] || 0;
  const fundDebitSum = typeSum.value[2].byFund[id] || 0;
  const balanceOnRecords = fundCreditSum + fundDebitSum;
  return getBalanceFormatted(balanceOnRecords)
}

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

</script>