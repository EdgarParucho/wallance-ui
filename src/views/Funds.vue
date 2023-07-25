<template>
  <div class="mb-8 mx-auto">
    <router-link class="hover:underline font-bold text-white" to="/dashboard">
      Dashboard
    </router-link>
    <h1 class="text-white text-4xl font-bold">
      Saving Funds
    </h1>
    <p class="mt-2 mb-8">From here you can manage your balance into funds according to your needs.</p>

    <div class="flex rounded-md bg-stone-900 md:relative w-full fixed left-0 bottom-0 h-8">
      <button class="font-bold text-yellow-500 bg-stone-800 hover:bg-stone-700 transition-colors w-1/2 md:w-40 py-1"
      @click="fundFormIsOpen = true">
        <PlusIcon class="w-6 mx-auto" />
      </button>
      <button
      class="font-bold text-stone-900 bg-yellow-500 hover:bg-yellow-400 transition-colors w-1/2 md:w-40 py-1 disabled:bg-stone-800"
      @click="balanceFormIsOpen = true"
      :disabled="funds.length < 2"
      >
        <ArrowsRightLeftIcon class="w-6 mx-auto" />
      </button>
    </div>

    <div class="lg:flex lg:justify-between space-y-10 mt-10">
      <div class="sm:w-3/4 lg:w-2/4 xl:w-1/3 mx-auto">
        <PieChart :labels="fundsNames" :data-values="fundsBalances" data-label="Balance" />
      </div>
      <div class="lg:w-2/4 row-end">
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
import { useFundStore } from '../stores/fundStore';
import { storeToRefs } from 'pinia';
import FundCard from '../components/fund/FundCard.vue';
import swal from "sweetalert";
import PieChart from '../components/chart/PieChart.vue';
import { useRecordStore } from '../stores/recordStore';

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

const fundsNames = computed(() => funds.value.map(fund => fund.name));
const fundsBalances = computed(() => funds.value.map(fund => fund.balance));

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
    const fundRecordsAmounts = records.filter(record => record.fundID === fund.id).map(r => r.amount);
    fund.balance = fundRecordsAmounts.reduce((balance, amount) => balance + amount, 0);
  })
}, { immediate: true });

</script>
