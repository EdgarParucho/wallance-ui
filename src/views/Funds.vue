<template>
  <div class="mb-8 mx-auto">
    <router-link class="hover:underline font-bold text-white" to="/dashboard">
      Dashboard
    </router-link>
    <h1 class="text-white text-4xl font-bold">
      Saving Funds
    </h1>
    <p class="mt-2 mb-8">From here you can manage your savings into funds according to your needs.</p>

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

    <FundCard v-for="fund in fundStore.funds" :key="fund._id" :id="fund._id" @edit-fund="(fund) => editFund(fund)" />

    <FundForm v-if="fundFormIsOpen" :form-is-open="fundFormIsOpen" @close-form="closeForm" :editing-fund="editingFund" />
    <BalanceForm v-if="balanceFormIsOpen" :form-is-open="balanceFormIsOpen" @close-form="balanceFormIsOpen = false" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useFundStore } from '../stores/fundStore'
import FundCard from '../components/fund/FundCard.vue'
import { ArrowsRightLeftIcon, PlusIcon } from '@heroicons/vue/24/outline'

const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))
const BalanceForm = defineAsyncComponent(() => import('../components/fund/BalanceForm.vue'))

const fundStore = useFundStore()
let fundFormIsOpen = ref(false)
let balanceFormIsOpen = ref(false)
let editingFund = null

function editFund(fund) {
  editingFund = fund
  fundFormIsOpen.value = true
}
function closeForm() {
  editingFund = null
  fundFormIsOpen.value = false
}
</script>
