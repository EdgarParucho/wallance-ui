<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2 bg-stone-700 text-yellow-400">
      <KeyIcon class="h-6 w-6 text-white" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium text-white text-center mt-4">
      Updating my password
    </h3>
    <div aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-white" />
      </div>
    </div>

    <div class="mt-12 px-8">
      <form @submit.prevent="onSubmit(OTP, newPassword)">
        <fieldset class="my-6">
          <input
          type="text"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          placeholder="Code"
          required
          autocomplete="ignore"
          v-model="OTP"
          >
          <input
          type="password"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          placeholder="New password"
          required
          v-model="newPassword"
          autocomplete="ignore"
          >
          <input
          type="password"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          placeholder="New password confirmation"
          required
          v-model="reEnteredPassword"
          autocomplete="ignore"
          >
        </fieldset>
        <button
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
        type="submit"
        :disabled="loading || passwordMismatch || someFieldIsEmpty"
        >
          Update Now
        </button>
        <button
        class="block rounded-sm my-2 px-3 mx-auto w-72 text-sm text-cyan-300 hover:text-cyan-100 bg-stone-800 disabled:text-stone-400 disabled:hover:bg-stone-800"
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
import { useAccountStore } from '../../stores/accountStore';
import Dialog from '../layout/Dialog.vue';
import { KeyIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['close-form', 'request-otp'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const displayAlert = inject("alert");
const accountStore = useAccountStore()

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
  accountStore.updatePassword({ OTP, updateEntries: { password: newPassword } })
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
