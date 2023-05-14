<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="mt-12 px-8">
      <h3 class="text-2xl text-center">
        First step towards your command post
      </h3>
      <form>
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
          type="password"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="Password"
          required
          v-model="form.password"
          >
          <input
          type="password"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="Password"
          required
          v-model="reEnteredPassword"
          >
          <input
          v-if="validatingEmail"
          type="text"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="Validation"
          required
          v-model.number="OTP"
          >
        </fieldset>
        <button
        v-if="validatingEmail"
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
        @click="sign(OTP, form)"
        :disabled="missingValidation"
        type="button"
        >
          Create my account
        </button>
        <button
        v-else
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
        @click="validateEmail(form.email)"
        :disabled="loading || passwordMismatch || someFieldIsEmpty"
        type="button"
        >
          Validate My Email
        </button>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../../stores/userStore';
import Dialog from '../helper/Dialog.vue';

const userStore = useUserStore();
const emit = defineEmits(['close-form'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } });

const form = ref({ email: '', password: '' });
const reEnteredPassword = ref('');
const loading = ref(false);
const OTP = ref(0);
const validatingEmail = ref(false);

const passwordMismatch = computed(() => form.value.password !== reEnteredPassword.value);
const someFieldIsEmpty = computed(() => form.value.password === '' || form.value.email === '');
const missingValidation = computed(() => OTP.value === '');

function validateFormat(email) {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(email);
  return emailIsValid;
}

function validateForm() {
  let formValidation = { failed: false, feedback: '' }

  const emailIsEmpty = form.value.email === ''
  if(emailIsEmpty) return formValidation = { failed: true, feedback: 'Please, type your email in the corresponding field to be able to proceed' }

  const emailIsValid = validateFormat(form.value.email)
  if(!emailIsValid) return formValidation = { failed: true, feedback: 'The email format seems to be wrong, please check and try again' }

  return formValidation
}

function validateEmail(email) {
  loading.value = true
  userStore.preValidate({ email, mustBeNew: true })
    .then((response) => {
      alert(response)
      validatingEmail.value = true
    })
    .catch((error) => alert(error))
    .finally(() => loading.value = false)
}

function sign(OTP, form) {
  const formValidation = validateForm()
  if(formValidation.failed) return alert(formValidation.feedback)
  loading.value = true
  userStore.create({ OTP, ...form })
    .then((response) => {
      alert(response);
      emit('close-form');
    })
    .catch((error) => alert(error))
    .finally(() => loading.value = false)
}
</script>
