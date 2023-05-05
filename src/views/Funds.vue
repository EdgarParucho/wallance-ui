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
    v-for="fund in fundStore.funds"
    :key="fund._id"
    :id="fund._id"
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
import { useUserStore } from '../stores/userStore'
import FundCard from '../components/fund/FundCard.vue'

const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))
const BalanceForm = defineAsyncComponent(() => import('../components/fund/BalanceForm.vue'))

const fundStore = useFundStore();
const userStore = useUserStore();
let fundFormIsOpen = ref(false)
let balanceFormIsOpen = ref(false)
let editingFund = null
const queryInProgress = ref(false)
const userID = userStore.session.user._id;
const defaultFundID = fundStore.defaultFund._id;

function confirmDeletion(fund) {
  queryInProgress.value = true
  const deleteIsConfirmed = confirm(`Please confirm if you want to delete "${fund.name}". The action is irreversible.`)
  if(!deleteIsConfirmed) return
  fundStore.deleteFund({ userID, _id: fund._id, defaultFundID })
    .then((message) => alert(message))
    .catch((message) => alert(message))
    .finally(() => queryInProgress.value = false)
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
