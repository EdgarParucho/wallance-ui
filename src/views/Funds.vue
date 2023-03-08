<template>
  <div class="mb-8 mx-auto">
    <router-link class="hover:underline font-bold text-white" to="/dashboard">
      Dashboard
    </router-link>
    <h1 class="text-white text-4xl font-bold">
      Saving Funds
    </h1>
    <p>From here you can manage your savings into funds according to your needs.</p>

    <div class="flex rounded-md bg-stone-900 md:relative w-full fixed left-0 bottom-0 h-8">
      <button class="font-bold text-yellow-500 bg-stone-800 hover:bg-stone-700 transition-colors w-1/2 md:w-40 py-1"
      @click="formIsOpen = true">
        <PlusIcon class="w-6 mx-auto" />
      </button>
      <button class="font-bold text-stone-900 bg-yellow-500 hover:bg-yellow-400 transition-colors w-1/2 md:w-40 py-1"
      @click="formIsOpen = true">
        <ArrowsRightLeftIcon class="w-6 mx-auto" />
      </button>
    </div>

    <div class="mt-8 p-2">
      <FundCard
      v-for="fund in store.funds"
      :key="fund._id"
      :fund="fund"
      @edit-fund="(fund) => editFund(fund)"
      />
    </div>
    <FundForm
    v-if="formIsOpen"
    :form-is-open="formIsOpen"
    @close-form="closeForm"
    :editing-fund="editingFund"
    />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useFundStore } from '../stores/fundStore'
import FundCard from '../components/fund/FundCard.vue'
import { ArrowsRightLeftIcon, PlusIcon } from '@heroicons/vue/24/outline'

const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))

const store = useFundStore()
let formIsOpen = ref(false)
let editingFund = null

function editFund(fund) {
  editingFund = fund
  formIsOpen.value = true
}
function closeForm() {
  editingFund = null
  formIsOpen.value = false
}
</script>
