<template>
  <main class="mt-18 text-white text-center h-screen">
    <h1 class="text-8xl">404</h1>
    <h3 class="text-xl">The page you're looking for is not here.</h3>
    <router-link class="text-violet-500 hover:text-violet-600" :to="{ name: 'Dashboard' }">Back to dashboard</router-link>
  </main>
</template>

<script setup>
</script>