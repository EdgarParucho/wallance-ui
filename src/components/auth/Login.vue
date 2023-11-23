<template>
  <Dialog
  title="Time is priceless, let's start"
  subtitle="Enter your e-mail and password to start a session"
  :icon="KeyIcon"
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  >
    <form @submit.prevent="handleSubmit(form)" class="rounded-md px-8 pb-10">
      <input
      type="email"
      class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
      placeholder="example@email.com"
      required
      v-model="form.email"
      >
      <input
      type="password"
      class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
      placeholder="password"
      required
      v-model="form.password"
      >
      <button
      class="flex justify-center items-center space-x-2 w-full mt-6 py-1 outline-none font-bold rounded-sm text-white bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 dark:disabled:bg-stone-800 dark:disabled:text-stone-500 focus:outline-violet-500 outline-1"
      :disabled="!formIsValid || loading"
      type="submit"
      >
        <svg
        v-if="loading"
        class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-if="loading" class="mx-auto">Processing...</span>
        <span v-else class="mx-auto">Log In</span>
      </button>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router';
import { KeyIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '../../stores/authStore';
import Dialog from '../layout/Dialog.vue';

const props = defineProps({ formIsOpen: { type: Boolean, required: true } });
const emit = defineEmits(['close-form']);
const showAlert = inject("showAlert");
const showToast = inject("showToast");
const authStore = useAuthStore();

const router = useRouter();

const form = ref({ email: '', password: '' });
let loading = ref(false);

const emailFormatIsValid = computed(() => {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(form.value.email);
  return emailIsValid;
});

const formIsValid = computed(() => form.value.email !== "" && emailFormatIsValid && form.value.password !== "");

function handleSubmit(data) {
  loading.value = true;
  authStore.login(data)
    .then((message) => {
      router.replace('/dashboard');
      showToast(message);
    })
    .catch((message) => showAlert({ title: "Couldn't authenticate you", type: "error", text: message }))
    .finally(() => loading.value = false)
}

</script>
