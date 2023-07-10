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
      class="font-bold text-stone-900 bg-yellow-500 hover:bg-yellow-400 transition-colors w-1/2 md:w-40 py-1"
      @click="balanceFormIsOpen = true"
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
    <BalanceForm v-if="balanceFormIsOpen" :form-is-open="balanceFormIsOpen" @close-form="balanceFormIsOpen = false" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { ArrowsRightLeftIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useFundStore } from '../stores/fundStore'
import FundCard from '../components/fund/FundCard.vue'
import { storeToRefs } from 'pinia';

const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))
const BalanceForm = defineAsyncComponent(() => import('../components/fund/BalanceForm.vue'))

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore)
let fundFormIsOpen = ref(false)
let balanceFormIsOpen = ref(false)
let editingFund = null
const loading = ref(false)

function confirmDeletion(fund) {
  loading.value = true
  const deleteIsConfirmed = confirm(`Please confirm to delete "${fund.name}". The action is irreversible.`);
  if(!deleteIsConfirmed) return loading.value = false;
  fundStore.deleteFund(fund.id)
    .then((message) => alert(message))
    .catch((message) => alert(message))
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
