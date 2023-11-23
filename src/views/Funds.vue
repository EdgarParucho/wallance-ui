<template>
  <div class="mb-8 mx-auto">
    <h1 class="text-4xl font-bold">Funds</h1>
    <p class="text-xl my-4">
      Think in a fund like an account, a space to manage your records and the balance resulting from them.
    </p>

    <div v-if="funds.length < 2" class="lg:flex justify-around mt-10">
      <div class="lg:w-1/3 my-10">
        <h3 class="text-center text-2xl my-4 font-bold">Why having multiple funds?</h3>
        <p class="text-justify text-lg my-4">
          One word: flexibility. With multiple funds, you're able to implement different methods like
          <a class="underline" href="https://www.betterinvesting.org/learn-about-investing/investor-education/personal-finance/the-bucket-approach" target="_blank">the buckets approach</a>,
          or try your own ones, like creating an X fund for X goal, or organizing funds by subjects (e.g. services).
        </p>
      </div>

      <div class="lg:w-1/3 my-10">
        <h3 class="text-center text-2xl my-4 font-bold">Getting started with funds</h3>
        <p class="text-justify text-lg my-4">
          You start with a default fund (Base). All credits go there, increasing the fund's balance available
          for debits and assignments to other funds.
        </p>
        <p class="text-justify text-lg my-4">
          Any fund you create can increase its balance through assignments, and then also be used for debits or assigning to another fund.
        </p>
      </div>
    </div>

    <div class="space-y-10 mt-10">
      <div class="mx-auto lg:w-2/4 space-y-4 pb-6">
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
import { storeToRefs } from 'pinia';
import { ref, defineAsyncComponent, inject } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useFundStore } from '../stores/fundStore';
import FundCard from '../components/fund/FundCard.vue';
import swal from "sweetalert";

const FundForm = defineAsyncComponent(() => import('../components/fund/FundForm.vue'))

const showAlert = inject("showAlert");
const showToast = inject("showToast");
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
    .then((message) => showToast(message))
    .catch((message) => showAlert({ title: "Something went wrong", type: "error", text: message }))
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
