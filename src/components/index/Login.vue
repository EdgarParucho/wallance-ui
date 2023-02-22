<template>
  <div class="mt-12">
    <h3 class="text-2xl text-center">
      Time is priceless, let's log in!
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
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
        @submit="handleSubmit"
        :disabled="queryInProgress"
        >
          {{ forgotPassword ? 'Recover my password' : 'Log In' }}
        </button>
      </div>
    </form>
    <!-- Password recovery -->
    <div class="flex items-center justify-center">
      <div class="flex items-center mt-6">
        <input type="checkbox" class="h-4 w-4 rounded border-gray-300" v-model="forgotPassword" />
        <label for="remember-me" class="ml-2 block text-sm text-stone-500 dark:text-white" @click="forgotPassword = !forgotPassword">
          I forgot my password
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/userStore';

const store = useUserStore()
const router = useRouter()

const forgotPassword = ref(false)
const form = ref({ email: 'edpn@gmail.com', password: 'anepicsong' })
let queryInProgress = ref(false)

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


function handleSubmit() {
  const formValidation = validateForm()
  if(formValidation.failed) return alert(formValidation.feedback)
  queryInProgress.value = true
  const queryStatus = store.login(form.value)
  alert(queryStatus.feedback)
  queryInProgress.value = false
  if(queryStatus.succeed) router.push('/dashboard')
}
</script>