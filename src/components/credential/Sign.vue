<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="py-4 px-8">
      <h3 class="text-2xl text-center">
        {{ title }}
      </h3>
      <form @submit.prevent="onSubmit(OTPSent, action)">
        <fieldset class="my-6">
          <input
          type="email"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="email@example.com"
          autofocus
          required
          v-model.trim="form.email"
          >
          <input
          v-if="OTPSent"
          type="password"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="Password"
          required
          v-model="form.password"
          >
          <input
          v-if="OTPSent"
          type="password"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="Password"
          required
          v-model="reEnteredPassword"
          >
          <input
          v-if="OTPSent"
          type="text"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="Code"
          required
          v-model="OTP"
          >
        </fieldset>
        
        <button
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
        type="submit"
        :disabled="(OTPSent && (passwordMismatch || passwordIsBlank)) || (emailIsBlank || !emailFormatIsValid) || (OTPSent && otpIsBlank) || loading"
        >
          {{ OTPSent ? "Submit" : "Continue" }}
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
import Dialog from '../helper/Dialog.vue';

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
  const emailShouldBeStored = action === "recovery";
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
