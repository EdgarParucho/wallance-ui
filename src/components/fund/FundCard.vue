<template>
  <div class="font-sans lg:block h-36 lg:w-2/3 mx-auto rounded-xl dark:shadow-[#101010] shadow-lg bg-white dark:bg-stone-800">
    <div class="flex justify-between">
      <p class="ml-2 font-bold">{{ fund.name }}</p>
      <span v-if="fund.isDefault" class="flex items-center justify-center h-6 w-16 text-sm rounded-sm bg-stone-200 text-stone-700 font-bold">
        Main
      </span>
    </div>
    <div class="justify-end flex items-baseline my-2 mr-3">
      <span class="text-3xl">{{ fundBalance.inCurrencyFormat }}</span>
    </div>
    <p class="ml-2 text-md h-11">{{ fund.description }}</p>
    <div class="flex align-bottom">
      <button
      class="w-1/2 py-1 hover:bg-stone-200 dark:hover:bg-stone-700 focus:bg-stone-100 dark:focus:bg-stone-700 focus:outline-none transition-colors"
      @click="$emit('edit-fund', fund)"
      >
        <PencilSquareIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
      <button
      class="w-1/2 py-1 text-red-400 hover:bg-red-100 dark:hover:bg-red-900 focus:bg-red-100 dark:focus:bg-red-900 focus:outline-none transition-colors disabled:text-stone-600 disabled:hover:bg-stone-800"
      @click="validateDeletion(fund)"
      :disabled="fund.isDefault"
      >
        <TrashIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useRecordStore } from '../../stores/recordStore';

const emit = defineEmits(['edit-fund', 'confirm-deletion']);
const props = defineProps(['fund']);
const displayAlert = inject("alert");
const recordStore = useRecordStore();

const fundBalance = computed(() => {
  const fundRecords = recordStore.records.filter(record => record.fundID === props.fund.id || record.otherFundID === props.fund.id);
  const balance = fundRecords.reduce((accumulatedBalance, record) => {
    const recordAmount = (record.fundID === props.fund.id) ? record.amount : -record.amount;
    const resultingBalance = (accumulatedBalance + recordAmount);
    return resultingBalance
  }, 0);
  const inCurrencyFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(balance);
  return { inCurrencyFormat, balance };
});

function validateDeletion(fund) {
  if(fund.isDefault) return displayAlert({
    type: "info",
    title: "Can't complete the action",
    text: 'Cannot delete the default fund.'
  });
  else if(fundBalance.value.balance > 0)  return displayAlert({
    type: "info",
    title: "Can't complete the action",
    text: 'The fund has a positive balance. You can move the balance to another fund, then retry this action.'
  });
  emit('confirm-deletion', fund);
}
</script>
