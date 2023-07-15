<template>
  <div>
    <div class="flex justify-center">
      <img class="w-52" src="../assets/vue.svg" alt="">
    </div>
    <h1 class="mt-6 text-4xl text-black dark:text-white font-bold text-center">
      Welcome to Wallance
    </h1>
    <p class="text-lg text-stone-500 dark:text-stone-300 text-center">
      <!-- A place to integrate your movements, your status, and facilitate your decisions. -->
      <!-- You may have your money in different places, but your decisions need to be centralized -->
      Make a real connection between your goals and your finances
    </p>
    <Login v-show="loginFormIsOpen" :form-is-open="loginFormIsOpen" @close-form="loginFormIsOpen = false" />
    <Sign
    v-show="signFormIsOpen"
    :form-is-open="signFormIsOpen"
    :action="recoveringPassword ? 'recovery' : 'sign'"
    @close-form="signFormIsOpen = false" />
    <div class="mt-10 flex justify-center">
      <button
      class="rounded-sm px-3 py-1 my-2 mx-2 w-52 border bg-stone-800 border-stone-600 hover:bg-stone-700 text-white font-bold disabled:bg-stone-700"
      @click="loginFormIsOpen = true"
      >
        Log In
      </button>
      <button
      class="rounded-sm px-3 py-1 my-2 mx-2 w-52 border bg-yellow-400 border-stone-600 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
      @click="signFormIsOpen = true"
      >
        Join
      </button>
    </div>
    <div class="flex justify-center my-2">
      <button
        class="px-3 py-1 text-xs rounded-md hover:border-stone-500 text-stone-400 font-semibold hover:text-white flex justify-between w-44"
        @click="recoverPassword"
        >
          <KeyIcon class="w-4" />
          Recover my password
      </button>
    </div>
  </div>
</template>

<script setup>
import { KeyIcon } from '@heroicons/vue/24/outline';
import Login from '../components/credential/Login.vue';
import Sign from '../components/credential/Sign.vue';
import { ref, watch } from 'vue';

const signFormIsOpen = ref(false);
const loginFormIsOpen = ref(false);
const recoveringPassword = ref(false);

function recoverPassword() {
  recoveringPassword.value = true;
  signFormIsOpen.value = true;
}

watch(() => signFormIsOpen.value,
(signFormIsOpen) => {
  if (!signFormIsOpen) recoveringPassword.value = false;
});

</script>
