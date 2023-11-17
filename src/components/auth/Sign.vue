<template>
  <Dialog
  :title="title"
  subtitle=""
  :icon="IdentificationIcon"
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  >
    <form @submit.prevent="onSubmit(OTPSent, action)" class="rounded-md px-8 pb-10">
      <fieldset class="my-6">
        <input
        type="email"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="email@example.com"
        autofocus
        required
        v-model.trim="form.email"
        >
        <input
        v-if="OTPSent"
        type="password"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="Password"
        required
        v-model="form.password"
        >
        <input
        v-if="OTPSent"
        type="password"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="Confirm password"
        required
        v-model="reEnteredPassword"
        >
        <input
        v-if="OTPSent"
        type="text"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="Code"
        required
        v-model="OTP"
        >
      </fieldset>

      <button
      class="flex justify-center items-center space-x-2 w-full my-2 py-1 outline-none font-bold rounded-sm text-white bg-stone-800 dark:disabled:bg-stone-800 dark:disabled:text-stone-500 hover:bg-stone-700 disabled:bg-stone-300 focus:outline-violet-500 outline-1"
      type="submit"
      :disabled="(OTPSent && (passwordMismatch || passwordIsBlank)) || (emailIsBlank || !emailFormatIsValid) || (OTPSent && otpIsBlank) || loading"
      >
        <svg
        v-if="loading"
        class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-if="loading" class="mx-auto">Processing...</span>
        <span v-else>{{ OTPSent ? "Submit" : "Continue" }}</span>
      </button>
    </form>
    <button
    v-if="OTPSent"
    class="flex items-center gap-1 mx-auto mb-3 px-3 py-1 text-xs hover:border-stone-500 text-stone-600 hover:scale-110 transition-all hover:text-black dark:hover:text-white"
    @click="requestOTP(form.email, action)"
    :disabled="loading || countDown > 0 || !emailFormatIsValid || emailIsBlank"
    type="button"
    >
      <ArrowUturnLeftIcon class="w-4" />
      Request code again
      <span v-if="countDown > 0">
        ({{ countDown }})
      </span>
    </button>
  </Dialog>
</template>

<script setup>
import { computed, ref, inject } from 'vue';
import { IdentificationIcon, ArrowUturnLeftIcon, } from '@heroicons/vue/24/outline';

import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import Dialog from '../layout/Dialog.vue';

const emit = defineEmits(['close-form']);
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

const displayAlert = inject("alert");

const authStore = useAuthStore();
const userStore = useUserStore();

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
  authStore.requestOTP({ email, emailShouldBeStored, action })
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
  authStore.sign({ OTP, body: { ...form } })
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
  userStore.resetPassword({ OTP, email, password })
    .then((message) => {
      displayAlert({ title: "Done", type: "success", text: message });
      emit('close-form')
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
}

</script>
