<template>
  <table class="border-separate border-spacing-4 bg-stone-800 italic font-serif text-white mx-auto w-full 2xl:w-1/3">
    <thead>
      <tr>
        <th class="px-4 text-white underline">Fund</th>
        <th class="px-4 text-white underline">Balance on filters</th>
      </tr>
    </thead>
    <tbody>
      <tr class="p-2 my-1" v-for="fund in funds" :key="fund.id">
        <td class=" lg:w-36 lg:px-2">
          {{ fund.name }}
        </td>
        <td class="lg:w-40 lg:px-2 text-end">
          <span>{{ getFundBalanceOnFilters(fund) }}</span>
        </td>
      </tr>
      <tr class="font-bold">
        <th class="px-2 text-center border-t border-white">Overall Balance</th>
        <th class="px-2 text-end  border-t border-white flex items-center justify-end space-x-2">
          {{ getAmountFormatted(balanceOnFilters) }}
        </th>
      </tr>
    </tbody>
  </table>
  <p class="block text-center mt-3 mb-6 text-white" v-show="balanceDiff && balanceDiff !== currentBalance">
    If you exclude the records from your query, your balance would be:
    <span class="text-black bg-white py-1 px-1.5 rounded-md font-bold">{{ getAmountFormatted(balanceDiff) }}</span>
  </p>
</template>

<script setup>
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
  return getAmountFormatted(fundBalanceOnFilters)
}

</script>