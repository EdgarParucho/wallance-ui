<template>
  <div class="py-4">
    <router-link class="hover:underline font-bold text-white" to="/dashboard">
      Dashboard
    </router-link>
    <h1 class="text-white text-4xl font-bold">
      Saving Funds
    </h1>
    <p>From here you can manage your savings into funds according to your needs.</p>
    <FundCard
    v-for="fund in store.funds"
    :key="fund._id"
    :fund="fund"
    @open-modal="(editingFund) => editFund(editingFund)"
    />
    <FundForm v-if="formIsOpen" :form-is-open="formIsOpen" @close-form="formIsOpen = false" :editing-fund="selectedFund" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useFundStore } from '../stores/fundStore'
import FundCard from '../components/fund/FundCard.vue'
const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))

const store = useFundStore()
let formIsOpen = ref(false)
let selectedFund = {}

function editFund(editingFund) {
  selectedFund = editingFund
  formIsOpen.value = true
}
</script>
