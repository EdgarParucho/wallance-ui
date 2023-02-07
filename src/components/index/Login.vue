<template>
  <div class="mt-12">
    <h3 class="text-2xl text-center">
      Time is priceless, let's log in!
    </h3>
    <form @submit.prevent="submit">
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
        @submit="submit"
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
import { useUserStore } from '../../stores/userStore';
import { useRouter } from 'vue-router';

const store = useUserStore()
const router = useRouter()

const forgotPassword = ref(false)
const form = ref({ email: '', password: '' })
const queryInProgress = ref(false)

function submit() {
  if(form.value.email === '') alert('Please, type your email in the corresponding field to be able to proceed')

  const emailIsValid = validateEmailFormat(form.value.email)
  if (!emailIsValid) return alert('The email format seems to be wrong, please check and try again')

  if(forgotPassword.value) {
    const recoveryIsConfirmed = confirm(`You have checked the "Forgot password" field. Please confirm to receive an email in ${form.value.email}`)
    if(recoveryIsConfirmed) return recoverPassword()
    else return forgotPassword.value = false
  }

  queryInProgress.value = true
  const loginStatus = store.tryLogin(form.value)
  alert(loginStatus.feedback)
  queryInProgress.value = false
  if(loginStatus.succeed) router.push('/dashboard')
}

function recoverPassword() {
  console.log('Recovering password');
  return
}

function validateEmailFormat(email) {
  let mailformat = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  let emailValidation = mailformat.test(email)
  return emailValidation
}

</script>