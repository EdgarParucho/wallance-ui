<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="mt-12 px-8">
      <h3 class="text-2xl text-center">
        Time is priceless, let's log!
      </h3>
      <form @submit.prevent="handleSubmit">
        <div class="mt-6">
          <input
          type="email"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="email@example.com"
          autofocus
          required
          v-model="form.email"
          >
          <input
          type="password"
          :class="[
            forgotPassword ? 'bg-stone-300' : 'bg-white',
            'block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800'
          ]"
          placeholder="password"
          required
          :disabled="forgotPassword"
          v-model="form.password"
          >
          <button
          class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
          @submit="handleSubmit"
          :disabled="loading"
          >
            {{ forgotPassword ? 'Recover my password' : 'Log In' }}
          </button>
        </div>
      </form>
      <div class="flex items-center justify-center">
        <div class="flex items-center mt-6">
          <input type="checkbox" class="h-4 w-4 rounded border-gray-300" v-model="forgotPassword" />
          <label for="remember-me" class="ml-2 block text-sm text-stone-500 dark:text-white" @click="forgotPassword = !forgotPassword">
            I forgot my password
          </label>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useFundStore } from '../../stores/fundStore';
import { useSessionStore } from '../../stores/sessionStore';
import Dialog from '../helper/Dialog.vue';

const sessionStore = useSessionStore();
const fundStore = useFundStore();
const router = useRouter();
const emit = defineEmits(['close-form']);
const props = defineProps({ formIsOpen: { type: Boolean, required: true } });

const forgotPassword = ref(false);
const form = ref({ email: 'edpn@gmail.com', password: '12345678' });
let loading = ref(false);

function handlePassRecovery() {
  const recoveryIsConfirmed = confirm('The "Forgot password" field is checked. Confirm to recover your password or cancel to uncheck the field')
  if(recoveryIsConfirmed) alert('You will receive an email to recover your password.')
  else forgotPassword.value = false
}

function validateFormat(email) {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(email)
  return emailIsValid
}

function validateForm() {
  let formValidation = { failed: false, feedback: '' }

  const emailIsEmpty = form.value.email === ''
  if(emailIsEmpty) return formValidation = { failed: true, feedback: 'Please, type your email in the corresponding field to be able to proceed' }

  const emailIsValid = validateFormat(form.value.email)
  if(!emailIsValid) return formValidation = { failed: true, feedback: 'The email format seems to be wrong, please check and try again' }

  if(forgotPassword.value) return handlePassRecovery()
  
  return formValidation
}

function postLogin() {
  const userID = sessionStore.session.user._id
  fundStore.getFunds(userID)
    .then((message) => {
      alert(message)
      router.push('/dashboard')
    })
    .catch((message) => alert(message))
}

function handleSubmit() {
  const formValidation = validateForm()
  if(formValidation.failed) return alert(formValidation.feedback)
  loading.value = true
  sessionStore.login(form.value)
    .then((message) => {
      alert(message)
      postLogin()
    })
    .catch((message) => alert(message))
    .finally(() => loading.value = false)
}
</script>
