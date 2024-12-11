<template>
  <Dialog
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  title="Updating Password"
  :icon="KeyIcon"
  >
    <form @submit.prevent="onSubmit(newPassword)" class="p-2">
      <fieldset class="flex">
        <input
        type="password"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="New password"
        required
        v-model="newPassword"
        autocomplete="off"
        >
        <input
        type="password"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="Password confirmation"
        required
        v-model="reEnteredPassword"
        autocomplete="off"
        >
      </fieldset>
      <div class="w-full flex gap-1 justify-center">
        <button
        type="button"
        class="btn-secondary"
        @click="$emit('close-form')"
        :disabled="loading"
        >
          Cancel
        </button>
        <button
        class="btn-primary disabled:bg-stone-300 dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
        type="submit"
        :disabled="loading || passwordMismatch || someFieldIsEmpty"
        >
          <svg
          v-if="loading"
          class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="loading" class="mx-auto">Processing...</span>
          <span v-else>Update Now</span>
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { useUserStore } from '../../stores/userStore';
import { KeyIcon } from '@heroicons/vue/24/outline';
import Dialog from '../layout/Dialog.vue';

const emit = defineEmits(['close-form'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const showAlert = inject("showAlert");
const showToast = inject("showToast");
const userStore = useUserStore();

const loading = ref(false);
const newPassword = ref("");
const reEnteredPassword = ref('');

const passwordMismatch = computed(() => newPassword.value !== reEnteredPassword.value);
const someFieldIsEmpty = computed(() => newPassword.value === '' || reEnteredPassword.value === '');

function onSubmit(password) {
  loading.value = true
  userStore.updateUser({ password })
    .then(({ message }) => {
      showToast(message);
      emit('close-form');
    })
    .catch((message) => showAlert({ type: "error", text: message }))
    .finally(() => loading.value = false)
}

</script>
