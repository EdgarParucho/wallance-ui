<template>
  <div class="pt-32">
    <Logo size="lg" />
    <h1 class="text-5xl font-bold text-center mt-16 text-white">
      Wallance
    </h1>
    <p class="text-lg text-white text-center mt-4">
      The connection between your goals and your finances
    </p>
    <div class="mt-10 flex justify-center my-2 space-x-2">
      <button
      class="rounded-sm px-3 py-1 outline-none w-52 bg-stone-800 hover:bg-stone-700 transition-colors text-white font-bold focus:outline-white focus:outline-1"
      @click="loginFormIsOpen = true"
      >
        Log In
      </button>
      <button
      class="rounded-sm px-3 py-1 outline-none w-52 bg-yellow-400 hover:bg-yellow-300 transition-colors text-black font-bold focus:outline-white focus:outline-1"
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
