<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2 bg-stone-700 text-yellow-400">
      <KeyIcon class="h-6 w-6-400" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium text-white text-center mt-4">
      Time is priceless, let's start
    </h3>
    <p class="text-sm text-white text-center">
      Enter your e-mail and password to start a session
    </p>
    <div aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-white" />
      </div>
    </div>

    <div class="rounded-md p-8">
      <form @submit.prevent="handleSubmit(form)">
        <input
        type="email"
        class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
        placeholder="email@example.com"
        required
        v-model="form.email"
        >
        <input
        type="password"
        class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
        placeholder="password"
        required
        v-model="form.password"
        >
        <button
        class="flex items-center w-72 px-4 py-2 font-bold leading-6 text-sm shadow rounded-sm text-black bg-yellow-400 hover:bg-yellow-300 transition ease-in-out duration-150 disabled:text-white disabled:bg-stone-800"
        :disabled="!formIsValid || loading"
        type="submit"
        >
          <svg
          v-if="loading"
          class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="loading" class="mx-auto">Processing...</span>
          <span v-else class="mx-auto">Log In</span>
        </button>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useCredentialStore } from '../../stores/credentialStore';
import { KeyIcon } from '@heroicons/vue/24/outline';
import Dialog from '../layout/Dialog.vue';

const props = defineProps({ formIsOpen: { type: Boolean, required: true } });
const emit = defineEmits(['close-form']);
const displayAlert = inject("alert");
const credentialStore = useCredentialStore();

const router = useRouter();

const form = ref({ email: '', password: '' });
let loading = ref(false);

const emailFormatIsValid = computed(() => {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(form.value.email);
  return emailIsValid;
});

const formIsValid = computed(() => emailFormatIsValid && form.value.password !== "");

function handleSubmit(data) {
  loading.value = true;
  credentialStore.login(data)
    .then((message) => {
      displayAlert({ title: "You're in", type: "success", text: message });
      router.replace('/dashboard');
    })
    .catch((message) => displayAlert({ title: "Couldn't authenticate you", type: "error", text: message }))
    .finally(() => loading.value = false)
}

</script>
