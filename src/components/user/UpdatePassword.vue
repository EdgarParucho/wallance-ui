<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')" title="Updating Password" :icon="KeyIcon">
    <div class="mt-12 px-8">
      <form @submit.prevent="onSubmit(OTP, newPassword)">
        <fieldset class="my-6">
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
          placeholder="New password confirmation"
          required
          v-model="reEnteredPassword"
          autocomplete="off"
          >
          <input
          type="text"
          class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
          placeholder="Code"
          required
          autocomplete="off"
          v-model="OTP"
          >
        </fieldset>
        <button
        class="flex justify-center items-center space-x-2 w-full my-2 py-1 outline-none font-bold rounded-sm text-white bg-stone-800 dark:disabled:bg-stone-800 dark:disabled:text-stone-500 hover:bg-stone-700 disabled:bg-stone-300 focus:outline-violet-500 outline-1"
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
        <button
        class="flex items-center gap-1 mx-auto mb-3 px-3 py-1 text-xs hover:border-stone-500 text-stone-600 hover:scale-110 transition-all hover:text-black dark:hover:text-white"
        @click="reSendOTP()"
        :disabled="loading || countDown > 0"
        type="button"
        >
          Request code again
          <span v-if="countDown > 0">
            ({{ countDown }})
          </span>
        </button>
      </form>
    </div>
  </Dialog>
</template>

<script setup>

import { computed, ref, inject } from 'vue'
import { useUserStore } from '../../stores/userStore';
import { KeyIcon } from '@heroicons/vue/24/outline';
import Dialog from '../layout/Dialog.vue';

const emit = defineEmits(['close-form', 'request-otp'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const displayAlert = inject("alert");
const userStore = useUserStore()

const OTP = ref("");
const newPassword = ref("");
const reEnteredPassword = ref('')

const loading = ref(false)
const countDown = ref(0);

const passwordMismatch = computed(() => newPassword.value !== reEnteredPassword.value)
const someFieldIsEmpty = computed(() => {
  return OTP.value === '' || newPassword.value === '' || reEnteredPassword.value === ''
})

startCountDown();

function reSendOTP() {
  emit("request-otp");  
  startCountDown();
}
function onSubmit(OTP, newPassword) {
  loading.value = true
  userStore.updateUser({ OTP, updateEntries: { password: newPassword } })
    .then((message) => {
      displayAlert({ title: "Done", type: "success", text: message });
      emit('close-form')
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
}

function startCountDown() {
  countDown.value = 30;
  const counting = setInterval(function() {
    if (countDown.value === 0) clearInterval(counting)
    else countDown.value -= 1
  }, 1000);
};

</script>
