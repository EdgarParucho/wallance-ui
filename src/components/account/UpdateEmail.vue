<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2 bg-stone-700 text-yellow-400">
      <AtSymbolIcon class="h-6 w-6 text-white" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium text-white text-center mt-4">
      Updating my email
    </h3>
    <p class="text-sm text-white text-center">
      You'll need to validate the new address
    </p>
    <div aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-white" />
      </div>
    </div>

    <div class="mt-12 px-8">
      <form @submit.prevent="onSubmit">
        <fieldset class="my-6">
          <input
          type="email"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          placeholder="newemail@example.com"
          autofocus
          required
          v-model.trim="email"
          >
          <input
          v-if="validatingEmail"
          type="text"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="OTP"
          required
          v-model="OTP"
          >
        </fieldset>
        <button
        type="submit"
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
        :disabled="loading || someFieldIsEmpty || !emailFormatIsValid"
        >
          {{ validatingEmail ? 'Update Now': 'Validate My Email' }}
        </button>
        <button
        v-if="validatingEmail"
        class="block rounded-sm my-2 px-3 mx-auto w-72 text-sm text-cyan-300 hover:text-cyan-100 bg-stone-800 disabled:text-stone-400 disabled:hover:bg-stone-800"
        @click="validateEmail"
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
import { computed, ref, inject } from 'vue';
import { useAccountStore } from '../../stores/accountStore';
import { useCredentialStore } from '../../stores/credentialStore';
import Dialog from '../layout/Dialog.vue';
import { AtSymbolIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['close-form'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const displayAlert = inject("alert");
const accountStore = useAccountStore();
const credentialStore = useCredentialStore();

const loading = ref(false)
const countDown = ref(0);

const email = ref('');
const someFieldIsEmpty = computed(() => {
  const emailFieldEmpty = email.value === ''
  const tokenFieldEmpty = validatingEmail.value && OTP.value === ''
  return emailFieldEmpty || tokenFieldEmpty
})
const currentEmail = computed(() => accountStore.account.email)
const currentEqualsNew = computed(() => email.value === currentEmail.value)
const validatingEmail = ref(false)
const OTP = ref('');

function onSubmit() {
  if (validatingEmail.value) updateEmail(OTP.value, email.value);
  else validateEmail({ email: email.value })
}

const emailFormatIsValid = computed(() => {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(email.value)
  return emailIsValid
})

function updateEmail(OTP, email) {
  if (currentEqualsNew.value) return alert('The email you entered is already your current address.')
  loading.value = true
  accountStore.updateEmail({ OTP, updateEntries: { email } })
  .then((message) => {
    displayAlert({ title: "Done", type: "success", text: message });
    emit('close-form');
  })
  .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
  .finally(() => loading.value = false)
}

function validateEmail({ email }) {
  loading.value = true
  credentialStore.requestOTPValidation({ email, emailShouldBeStored: false, action: "update" })
    .then((message) => {
      displayAlert({ title: "Check your inbox", type: "info", text: message });
      validatingEmail.value = true;
      startCountDown();
    })
    .catch((message) => displayAlert({ title: "Couldn't sign in", type: "error", text: message }))
    .finally(() => loading.value = false)
}

function startCountDown() {
  countDown.value = 30;
  const counting = setInterval(function() {
    if (countDown.value === 0) clearInterval(counting)
    else countDown.value -= 1
  }, 1000);
}

</script>

<style scoped>
/* Remove the default arrows from input number fields */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: inherit;
}
</style>
