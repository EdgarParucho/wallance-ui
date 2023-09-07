<template>
  <div class="pt-32">
    <Logo size="lg" />
    <h1 class="text-5xl font-bold text-center mt-16">
      Wallance
    </h1>
    <p class="text-lg text-center mt-4 font-medium">
      A bridge between your goals and your finances
    </p>
    <div class="mt-10 flex justify-center my-2 space-x-4">
      <button
      class="rounded-md py-1 w-52 hover:scale-105 transition-all font-bold focus:outline-violet-500 focus:outline-1 bg-white dark:bg-stone-800 shadow-lg"
      @click="loginFormIsOpen = true"
      >
        Log In
      </button>
      <button
      class="rounded-md py-1 w-52 hover:scale-105 transition-all focus:outline-1 focus:outline-violet-500 font-bold bg-stone-800 dark:bg-white text-white dark:text-black"
      @click="signFormIsOpen = true"
      >
        Join
      </button>
    </div>
    <div class="flex justify-center mt-10">
      <button
      class="flex items-center gap-1 mx-auto mb-3 px-3 py-1 text-xs hover:scale-110 transition-all hover:text-black hover:border-stone-500 text-stone-600 dark:text-stone-400 dark:hover:text-white"
      @click="recoverPassword"
      >
        <KeyIcon class="w-4" />
        Recover my password
      </button>
    </div>
    <Login v-show="loginFormIsOpen" :form-is-open="loginFormIsOpen" @close-form="loginFormIsOpen = false" />
    <Sign
      v-if="signFormIsOpen"
      :form-is-open="signFormIsOpen"
      :action="recoveringPassword ? 'recovery' : 'sign'"
      @close-form="signFormIsOpen = false"
    />
  </div>
</template>

<script setup>
import { KeyIcon } from '@heroicons/vue/24/outline';
import Login from '../components/credential/Login.vue';
import Logo from '../components/layout/Logo.vue';
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
