<template>
  <Dialog
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  :icon="ExclamationTriangleIcon"
  title="Deleting Account"
  subtitle="Data will be removed at confirmation"
  >
    <div class="mt-12 p-8">
      <form @submit.prevent="onSubmit">
        <p>Please type <code class="text-red-400 px-2 py-0.5 rounded-sm">delete</code> to proceed</p>
        <fieldset class="my-6">
          <input
          type="text"
          class="w-32 my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
          required
          v-model="confirmationText"
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
          type="submit"
          class="btn-primary disabled:bg-stone-300 dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
          :disabled="fieldIsInvalid || loading"
          >
            <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading" class="mx-auto">Processing...</span>
            <span v-else>Delete account</span>
          </button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '../../stores/userStore';
import Dialog from '../layout/Dialog.vue';

const { logout } = useAuth0();
const emit = defineEmits(['close-form', 'request-otp'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const showAlert = inject("showAlert");
const userStore = useUserStore();

const confirmationText = ref('')
const loading = ref(false)
const fieldIsInvalid = computed(() => confirmationText.value !== "delete");

function onSubmit() {
  loading.value = true;
  userStore.deleteUser()
    .then(() => logout())
    .catch(() => showAlert({ type: "error", text: "Sorry, something went wrong." }))
    .finally(() => loading.value = false)
}

</script>
