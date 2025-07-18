<template>
  <Dialog
  title="Updating email address"
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  >
    <form @submit.prevent="updateEmail(email)" class="rounded-md px-8 pb-10">
      <fieldset class="my-6">
        <input
        type="email"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="example@newemail.com"
        required
        v-model.trim="email"
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
      type="submit block"
      class="btn-primary block disabled:dark:bg-stone-800 disabled:text-stone-400 disabled:bg-stone-300 disabled:dark:text-stone-500"
      :disabled="loading || formIsEmpty || !emailFormatIsValid"
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
import { computed, ref, inject } from 'vue';
import { useUserStore } from '../../stores/userStore';
import Dialog from '../layout/Dialog.vue';

const showAlert = inject("showAlert");
const showToast = inject("showToast");

const emit = defineEmits(['close-form'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const userStore = useUserStore();

const loading = ref(false);
const email = ref('');

const formIsEmpty = computed(() => email.value === '');
const emailFormatIsValid = computed(() => {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(email.value);
  return emailIsValid;
})

function updateEmail(email) {
  loading.value = true;
  userStore.updateUser({ email })
    .then(({ message }) => {
      showToast(message);
      emit('close-form');
    })
    .catch((message) => showAlert({ type: "error", text: message }))
    .finally(() => loading.value = false)
}

</script>
