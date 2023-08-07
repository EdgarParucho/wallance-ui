<template>
  <div class="mb-8 mx-auto">
    <h1 class="text-white text-4xl font-bold">Funds</h1>
    <p class="mt-2 mb-8 text-white">
      Consider funds as spaces dedicated to group records as required by your management.
    </p>

    <div class="lg:flex lg:justify-between space-y-10 mt-10">
      <div class="sm:w-3/4 lg:w-2/4 xl:w-1/3 mx-auto mt-24">
        <BalanceByFundChart />
      </div>
      <div class="lg:w-2/4 space-y-4 pb-6">
        <div class="flex justify-center rounded-md bg-stone-900 md:relative w-full fixed bottom-0 h-10 space-x-4 py-2">
          <button
          class="rounded-sm px-3 py-1 outline-none w-52 bg-stone-800 hover:bg-stone-700 text-yellow-300 flex items-center focus:outline-white focus:outline-1"
          @click="fundFormIsOpen = true">
            <PlusIcon class="relative left-0 w-5" />
            <span class="mx-auto">Add Fund</span>
          </button>
          <button
          class="rounded-sm px-3 py-1 outline-none w-52 bg-yellow-400 hover:bg-yellow-300 text-black font-bold flex items-center focus:outline-white focus:outline-1"
          @click="balanceFormIsOpen = true"
          :disabled="funds.length < 2"
          >
          <ArrowsRightLeftIcon class="relative left-0 w-5" />
          <span class="mx-auto">Move Balance</span>
          </button>
        </div>
        <FundCard
        v-for="fund in funds"
        :key="fund.id"
        :fund="fund"
        @edit-fund="(fund) => editFund(fund)"
        @confirm-deletion="(fund) => confirmDeletion(fund)"
        />
      </div>
    </div>

    <FundForm v-if="fundFormIsOpen" :form-is-open="fundFormIsOpen" @close-form="closeForm" :editing-fund="editingFund" />
    <AssignmentForm v-if="balanceFormIsOpen" :form-is-open="balanceFormIsOpen" @close-form="balanceFormIsOpen = false" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, inject, computed, watch } from 'vue';
import { ArrowsRightLeftIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useFundStore } from '../stores/fundStore';
import { useRecordStore } from '../stores/recordStore';
import FundCard from '../components/fund/FundCard.vue';
import swal from "sweetalert";
import BalanceByFundChart from '../components/chart/BalanceByFundChart.vue';

const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))
const AssignmentForm = defineAsyncComponent(() => import('../components/record/AssignmentForm.vue'))
const displayAlert = inject("alert");
const fundStore = useFundStore();
const recordStore = useRecordStore();

const { funds } = storeToRefs(fundStore);
const { records } = storeToRefs(recordStore);
let fundFormIsOpen = ref(false);
let balanceFormIsOpen = ref(false);
let editingFund = null;
const loading = ref(false);

async function confirmDeletion(fund) {
  loading.value = true
  const deleteIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: `Please confirm to delete "${fund.name}". The action is irreversible.`,
    buttons: true,
    timer: null,
  });
  if(!deleteIsConfirmed) return loading.value = false;
  fundStore.deleteFund({ id: fund.id })
    .then((message) => displayAlert({ title: "Done", type: "success", text: message }))
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
}

function editFund(fund) {
  editingFund = fund
  fundFormIsOpen.value = true
}

function closeForm() {
  editingFund = null
  fundFormIsOpen.value = false
}

watch(() => records.value,
(records) => {
  funds.value.forEach(fund => {
    const fundRecordsAmounts = records.filter(record => record.fundID === fund.id || record.otherFundID === fund.id);
    fund.balance = fundRecordsAmounts.reduce((balance, record) => {
      const recordAmount = record.fundID === fund.id ? record.amount : -record.amount;
      return balance + recordAmount;
    }, 0);

    fund.balance = fund.balance.toFixed(2)
  })
}, { immediate: true });
</script>
