<script setup>
import AppBar from './components/helper/AppBar.vue';
</script>

<template>
  <div class="px-2 pt-8">
    <AppBar />
    <router-view class="mt-12"></router-view>
  </div>
</template>
