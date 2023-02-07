<template>
  <div class="py-4">
    <router-link class="hover:underline font-bold text-white" to="/">Home</router-link>
    <h1 class="dark:text-white text-4xl font-bold">
      Records History
    </h1>
    <div class="flex space-x-1">
      <small class="font-bold">Filters</small>
      <button class="bg-yellow-500 font-bold rounded-lg px-2">Debit</button>
      <button>Credit</button>
    </div>
    <RecordCard />
  </div>
</template>

<script setup>
import RecordCard from '../components/RecordCard.vue';
</script>