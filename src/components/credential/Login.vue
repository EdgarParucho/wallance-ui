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
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-300 text-black font-bold disabled:bg-stone-700"
        type="submit"
        :disabled="loading"
        >Log In</button>
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
