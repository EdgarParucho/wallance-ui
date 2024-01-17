<template>
  <div class="font-sans lg:block h-36 lg:w-2/3 mx-auto rounded-xl dark:shadow-[#101010] shadow-lg bg-white dark:bg-stone-800">
    <div class="flex justify-between">
      <p class="ml-2 font-bold">{{ fund.name }}</p>
      <span v-if="fund.isDefault" class="flex items-center justify-center h-6 w-16 text-sm rounded-sm bg-stone-200 text-stone-700 font-bold">
        Main
      </span>
    </div>
    <div class="justify-end flex items-baseline my-2 mr-3">
      <span class="text-3xl">{{ amountFormatted(fund.balance) }}</span>
    </div>
    <p class="ml-2 text-md h-11">{{ fund.description }}</p>
    <div class="flex align-bottom">
      <button
      class="w-1/2 py-1 hover:bg-stone-100 dark:hover:bg-stone-700 focus:bg-stone-100 dark:focus:bg-stone-700 focus:outline-none transition-colors"
      @click="editFund(fund)"
      >
        <PencilSquareIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
      <button
      class="w-1/2 py-1 text-red-400 hover:bg-red-100 dark:hover:bg-red-900 focus:bg-red-100 dark:focus:bg-red-900 focus:outline-none transition-colors disabled:text-stone-400 disabled:hover:bg-stone-100 dark:disabled:hover:bg-stone-800"
      @click="validateDeletion(fund)"
      :disabled="fund.isDefault"
      >
        <TrashIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
    </div>
    <FundForm v-if="fundFormIsOpen" :form-is-open="fundFormIsOpen" @close-form="closeForm" :editing-fund="editingFund" />
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useFundStore } from "../../stores/fundStore";
import FundForm from "./FundForm.vue";
import swal from "sweetalert";

const props = defineProps(['fund']);
const showAlert = inject("showAlert");
const showToast = inject("showToast");
const fundStore = useFundStore();
let fundFormIsOpen = ref(false);
let editingFund = null;

function amountFormatted(amount = 0) {
  const integer = Math.floor(amount);
  const fractions = amount
    .toString()
    .split('.')[1] || "0";
  const recomposed = [integer, fractions.slice(0, 2)].join(".")
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
   }).format(recomposed)
}

function validateDeletion(fund) {
  if (props.fund.isDefault) return showAlert({
    type: "info",
    title: "Can't complete the action",
    text: "The default fund can't be deleted. It helps to work the consistency and logic of your records."
  });
  else if (props.fund.balance > 0) return showAlert({
    type: "info",
    title: "Can't complete the action",
    text: 'First, move the balance to another fund, then retry this action.'
  });
  confirmDeletion(fund);
}

async function confirmDeletion(fund) {
  const deleteIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: `Please confirm to delete "${fund.name}". The action is irreversible.`,
    buttons: true,
    timer: null,
  });
  if(!deleteIsConfirmed) return;
  fundStore.deleteFund(fund.id)
    .then((message) => showToast(message))
    .catch((message) => showAlert({ type: "error", text: message }))
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
