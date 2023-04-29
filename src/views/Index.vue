<template>
  <div>
    <div class="flex justify-center">
      <img class="w-52" src="../assets/vue.svg" alt="">
    </div>
    <h1 class="mt-6 text-4xl text-black dark:text-white font-bold text-center">
      Welcome to Wallance
    </h1>
    <p class="text-lg text-stone-500 dark:text-stone-300 text-center">
      <!-- Money is somewhere else, here is financial command center -->
      <!-- A place to integrate your movements, your status, and facilitate your decisions. -->
      <!-- You may have your money in different places, but your decisions need to be centralized -->
      Make a real connection between your goals and your finances
    </p>
    <Login v-show="loginFormIsOpen" :form-is-open="loginFormIsOpen" @close-form="loginFormIsOpen = false"  />
    <Sign v-show="signFormIsOpen" :form-is-open="signFormIsOpen" @close-form="signFormIsOpen = false" />
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
  </div>
</template>

<script setup>
import Login from '../components/index/Login.vue';
import Sign from '../components/index/Sign.vue';
import { ref } from 'vue'
const signFormIsOpen = ref(false)
const loginFormIsOpen = ref(false)
</script>
