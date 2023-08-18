<template>
  <div class="mb-8 mx-auto">
    <h1 class="text-4xl font-bold">Funds</h1>
    <p class="mt-2 mb-8">
      Consider funds as spaces dedicated to group records as required by your management.
    </p>

    <div class="lg:flex lg:justify-between space-y-10 mt-10">
      <div class="sm:w-3/4 lg:w-2/4 xl:w-1/3 mx-auto mt-24">
        <BalanceByFundChart />
      </div>
      <div class="lg:w-2/4 space-y-4 pb-6">
        <div class="flex justify-center rounded-md md:relative w-full h-10 space-x-4 py-2">
          <button
          class="rounded-sm px-3 py-4 outline-none w-44 font-bold flex items-center focus:outline-violet-400 focus:outline-1 text-white hover:bg-violet-500 bg-violet-600"
          @click="fundFormIsOpen = true">
            <PlusIcon class="w-5" />
            <span class="mx-auto">Add Fund</span>
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
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, inject } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useFundStore } from '../stores/fundStore';
import FundCard from '../components/fund/FundCard.vue';
import swal from "sweetalert";
import BalanceByFundChart from '../components/chart/BalanceByFundChart.vue';

const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))
const displayAlert = inject("alert");
const fundStore = useFundStore();

const { funds } = storeToRefs(fundStore);
let fundFormIsOpen = ref(false);
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

</script>
