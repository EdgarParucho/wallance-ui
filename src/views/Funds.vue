<template>
  <div class="mb-8 mx-auto">
    <router-link class="hover:underline font-bold text-white" to="/dashboard">
      Dashboard
    </router-link>
    <h1 class="text-white text-4xl font-bold">
      Balance Funds
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

    <FundCard
    v-for="fund in funds"
    :key="fund.id"
    :fund="fund"
    @edit-fund="(fund) => editFund(fund)"
    @confirm-deletion="(fund) => confirmDeletion(fund)"
    />

    <FundForm v-if="fundFormIsOpen" :form-is-open="fundFormIsOpen" @close-form="closeForm" :editing-fund="editingFund" />
    <AssignmentForm v-if="balanceFormIsOpen" :form-is-open="balanceFormIsOpen" @close-form="balanceFormIsOpen = false" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, inject } from 'vue';
import { ArrowsRightLeftIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useFundStore } from '../stores/fundStore';
import { storeToRefs } from 'pinia';
import FundCard from '../components/fund/FundCard.vue';
import swal from "sweetalert";

const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))
const AssignmentForm = defineAsyncComponent(() => import('../components/record/AssignmentForm.vue'))
const displayAlert = inject("alert");
const fundStore = useFundStore();

const { funds } = storeToRefs(fundStore);
let fundFormIsOpen = ref(false);
let balanceFormIsOpen = ref(false);
let editingFund = null;
const loading = ref(false);

async function confirmDeletion(fund) {
  loading.value = true
  const deleteIsConfirmed = await swal({
    icon: "info",
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
