<template>
  <div>
    <!-- logo -->
    <div class="flex justify-center">
      <img class="w-52" src="../assets/vue.svg" alt="">
    </div>
    <!-- welcome -->
    <h1 class="mt-6 text-4xl text-black dark:text-white font-bold text-center">
      Welcome to Wallance
    </h1>
    <p class="text-lg text-stone-500 dark:text-stone-300 text-center">
      <!-- Let's start a new session to organize your finances. -->
      <!-- A place to organize your movements, centralize your status, and facilitate your decisions. -->
      <!-- A place to integrate your movements, your status, and facilitate your decisions. -->
      <!-- A place to organize your movements, your status, and connect  -->
      <!-- A place to organize your movements, your status, and clarify  -->
      <!-- A place to organize your movements, your status, and clear the noise -->
      <!-- A place to organize your movements, your status, and clear the noise around for better decisions. -->
      <!-- Do you feel you have more plans than you can cover? -->
      <!-- Do you want to connect your ultimate goals with your financial status? -->
      <!-- Do you want to know how much is going to take you to your goals? -->
      <!-- Our goal is to help you connect with your goals. -->
      Make a real connection between your goals and your finances
    </p>
    <Login />
  </div>
</template>

<script setup>
import Login from '../components/index/Login.vue';
</script>
