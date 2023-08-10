<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="rounded-md p-8">
      <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2 bg-stone-700 text-yellow-400">
        <IdentificationIcon class="h-6 w-6-400" aria-hidden="true" />
      </div>
      <h3 class="text-lg font-medium text-white text-center mt-4">
        {{ title }}
      </h3>
      <div aria-hidden="true">
        <div class="py-5">
          <div class="border-t border-white" />
        </div>
      </div>

      <form @submit.prevent="onSubmit(OTPSent, action)">
        <fieldset class="my-6">
          <input
          type="email"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          placeholder="email@example.com"
          autofocus
          required
          v-model.trim="form.email"
          >
          <input
          v-if="OTPSent"
          type="password"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          placeholder="Password"
          required
          v-model="form.password"
          >
          <input
          v-if="OTPSent"
          type="password"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          placeholder="Password"
          required
          v-model="reEnteredPassword"
          >
          <input
          v-if="OTPSent"
          type="text"
          class="block my-2 p-3 w-72 mx-auto text-white bg-transparent focus:border-transparent focus:border-b-yellow-300 focus:ring-0 border border-transparent border-b-white focus:bg-stone-700 transition-colors rounded-sm"
          placeholder="Code"
          required
          v-model="OTP"
          >
        </fieldset>
        
        <button
        class="flex justify-center rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
        type="submit"
        :disabled="(OTPSent && (passwordMismatch || passwordIsBlank)) || (emailIsBlank || !emailFormatIsValid) || (OTPSent && otpIsBlank) || loading"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading" class="mx-auto">Processing...</span>
            <span v-else>
              {{ OTPSent ? "Submit" : "Continue" }}
            </span>
        </button>
      </form>
      <button
      v-if="OTPSent"
      class="block rounded-sm my-2 px-3 mx-auto w-72 text-sm text-cyan-300 hover:text-cyan-100 bg-stone-800 disabled:text-stone-400 disabled:hover:bg-stone-800"
      @click="requestOTP(form.email, action)"
      :disabled="loading || countDown > 0 || !emailFormatIsValid || emailIsBlank"
      type="button"
      >
        Request code again
        <span v-if="countDown > 0">
          ({{ countDown }})
        </span>
      </button>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref, inject } from 'vue';
import { useCredentialStore } from '../../stores/credentialStore';
import { IdentificationIcon } from '@heroicons/vue/24/outline';
import Dialog from '../layout/Dialog.vue';

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    required: true
  },
  action: {
    type: String,
    default: "sign",
    required: true,
  },
});
const emit = defineEmits(['close-form']);
const displayAlert = inject("alert");
const credentialStore = useCredentialStore();

const form = ref({ email: '', password: '' });
const reEnteredPassword = ref('');
const loading = ref(false);
const OTP = ref("");
const OTPSent = ref(false);
const countDown = ref(0);
const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

const title = computed(() => (props.action === "sign") ? 'First step towards your command post' : 'Recover your access');
const emailIsBlank = computed(() => form.value.email === '');
const emailFormatIsValid = computed(() => emailformat.test(form.value.email));
const passwordMismatch = computed(() => form.value.password !== reEnteredPassword.value);
const passwordIsBlank = computed(() => form.value.password === '');
const otpIsBlank = computed(() => OTP.value === '');

function startCountDown() {
  countDown.value = 30;
  const counting = setInterval(() => {
    if (countDown.value === 0) clearInterval(counting)
    else countDown.value -= 1
  }, 1000);
};

function requestOTP(email, action) {
  loading.value = true
  const emailShouldBeStored = (action === "recovery");
  credentialStore.requestOTPValidation({ email, emailShouldBeStored, action })
    .then((message) => {
      displayAlert({ title: "Check your inbox", type: "info", text: message });
      OTPSent.value = true
      startCountDown()
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
}

function sign(OTP, form) {
  loading.value = true
  credentialStore.sign({ OTP, body: { ...form } })
    .then((message) => {
      displayAlert({ title: "You're in", type: "success", text: message });
      emit('close-form');
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
}

function onSubmit(OTPSent, action) {
  if (!OTPSent) requestOTP(form.value.email, action);
  else if (action === "sign") sign(OTP.value, form.value); 
  else resetPassword({ OTP: OTP.value, ...form.value });
}

function resetPassword({ OTP, email, password }) {
  loading.value = true
  credentialStore.resetPassword({ OTP, email, password })
    .then((message) => {
      displayAlert({ title: "Done", type: "success", text: message });
      emit('close-form')
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
}

</script>
