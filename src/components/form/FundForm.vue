<template>
  <Dialog
  title="Fund Form"
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
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
          class="w-1/3 bg-transparent focus:border-transparent focus:border-b-violet-500 focus:ring-0 border border-transparent border-b-white transition-colors rounded-sm focus:outline-none"
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
        <button class="btn-secondary" type="button" @click="$emit('close-form')" :disabled="loading">
          Cancel
        </button>
        <button
        class="btn-primary disabled:bg-stone-300 dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
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

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    required: true,
  },
  editing: {
    type: Boolean,
    default: false
  },
  selectedFund: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close-form']);
const showAlert = inject("showAlert");
const showToast = inject("showToast");

const fundStore = useFundStore();

const fund = ref({ name: '', description: '' });
const loading = ref(false);

if (props.editing) {
  const { name, description } = props.selectedFund;
  fund.value = { name, description };
}

const invalidForm = computed(() => fund.value.name === "" || fund.value.description === "");

function handleSubmit(body) {
  if (!props.editing) return createFund(body);
  const { id } = props.selectedFund;
  updateFund(id, body);
}

function createFund(body) {
  loading.value = true
  fundStore.createFund(body)
    .then((message) => {
      showToast(message);
      emit('close-form');
  })
    .catch((message) => showAlert({ type: "error", title: "Something went wrong", text: message }))
    .finally(() => loading.value = false)
}

function updateFund(id, body) {
  loading.value = true
  fundStore.updateFund({ id, body })
    .then((message) => {
      showToast(message);
      emit('close-form');
    })
    .catch((message) => showAlert({ type: "error", title: "Something went wrong", text: message }))
    .finally(() => loading.value = false)
}
 </script>