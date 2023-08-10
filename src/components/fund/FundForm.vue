<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2 bg-stone-700 text-yellow-400">
      <PencilSquareIcon v-if="editing" class="h-6 w-6" aria-hidden="true" />
      <PlusIcon v-else class="h-6 w-6-400" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium text-white text-center mt-4">
      Fund Form
    </h3>
    <p class="text-sm text-white text-center">
      You are <span class="p-1 bg-stone-700 rounded-md">{{ editing ? 'editing' : 'creating' }}</span> a fund
    </p>
    <div aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-white" />
      </div>
    </div>

    <form @submit.prevent="handleSubmit(fund)">
      <div class="p-4">

        <div class="h-1/3">
          <label for="fund-name" class="text-xs font-semibold">Name</label>
          <input
          id="fund-name"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          v-model="fund.name"
          placeholder="College">
        </div>

        <div class="h-1/3">
          <label for="fund-description" class="text-xs font-semibold">Description</label>
          <textarea
          id="fund-description"
          class="w-full rounded-sm bg-transparent border-transparent border-b-stone-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-md text-white disabled:text-stone-600 disabled:border-b-stone-600"
          v-model="fund.description"
          placeholder="A creative description"
          maxlength="80"></textarea>
        </div>

        <div class="h-1/3 flex items-center justify-end my-4 space-x-2">
          <button
          class="text-white bg-transparent hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 rounded-md text-sm w-1/3 py-2 transition-colors"
          type="button"
          @click="$emit('close-form')"
          >
            Cancel
          </button>
          <button
          class="mt-3 inline-flex w-full justify-center rounded-md bg-yellow-400 text-black px-4 py-2 text-base font-bold shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          type="submit"
          >
            <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading" class="mx-auto">Processing...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </div>
    </form>
  </Dialog>          
</template>
 
<script setup>
import { ref, inject } from 'vue'
import { useFundStore } from '../../stores/fundStore';
import Dialog from '../layout/Dialog.vue';
import { PlusIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['form-is-open', 'editing-fund']);
const emit = defineEmits(['close-form']);
const displayAlert = inject("alert");
const fundStore = useFundStore();

const fund = ref({
  name: '',
  description: '',
});
const loading = ref(false);

const editing = props.editingFund !== null
if (editing) {
  const { name, description } = props.editingFund;
  fund.value = { name, description };
}

function handleSubmit(body) {
  if (!editing) return createFund(body);
  const { id } = props.editingFund;
  updateFund(id, body);
}

function createFund(fund) {
  loading.value = true
  fundStore.createFund(fund)
    .then((message) => {
      displayAlert({ type: "success", title: "Done", text: message });
      emit('close-form');
  })
    .catch((message) => displayAlert({ type: "error", title: "Something went wrong", text: message }))
    .finally(() => loading.value = false)
}

function updateFund(id, body) {
  loading.value = true
  fundStore.updateFund({ id, body })
    .then((message) => {
      displayAlert({ type: "success", title: "Done", text: message });
      emit('close-form');
    })
    .catch((message) => displayAlert({ type: "error", title: "Something went wrong", text: message }))
    .finally(() => loading.value = false)
}
 </script>