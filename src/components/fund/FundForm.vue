<template>
  <Dialog
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  :icon="editing ? PencilSquareIcon : PlusIcon"
  title="Fund Form"
  :subtitle="`You are ${ editing ? 'editing' : 'creating' } a fund`"
  >
    <form @submit.prevent="handleSubmit(fund)" class="px-4">
      <div class="my-4 space-y-2 text-left px-1">
        <label class="text-xs font-bold" for="fund-name">
          Name
        </label>
        <div class="flex items-center">
          <input
          id="fund-name"
          v-model="fund.name"
          placeholder="College"
          class="w-full bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-white transition-colors rounded-sm focus:outline-none"
          required
          >
        </div>
      </div>
      
      <div class="my-4 space-y-2 text-left px-1">
        <label class="text-xs font-bold" for="fund-description">
          Description
        </label>
        <textarea
          type="text"
          id="fund-description"
          class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-violet-500 focus:ring-violet-500 sm:text-md disabled:text-stone-600 disabled:border-b-stone-600"
          maxlength="100"
          placeholder="Long-term savings"
          required
          v-model="fund.description"
        ></textarea>
      </div>
        
      <div class="h-1/3 flex items-center justify-end my-4 space-x-2">
        <button
        class="mt-3 inline-flex w-full justify-center rounded-md px-4 py-2 text-base font-bold shadow-sm bg-stone-300 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        type="button"
        @click="$emit('close-form')"
        >
          Cancel
        </button>
        <button
        class="mt-3 inline-flex gap-2 w-full justify-center rounded-md px-4 py-2 text-base font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm hover:bg-violet-500 bg-violet-600 text-white disabled:bg-stone-300 dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
        type="submit"
        :disabled="invalidForm"
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
    </form>
  </Dialog>          
</template>
 
<script setup>
import { ref, computed, inject } from 'vue'
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

const invalidForm = computed(() => fund.value.name === "" || fund.value.description === "");

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