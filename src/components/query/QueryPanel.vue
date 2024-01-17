<template>
  <div>
    <div class="mb-8">
      <DocumentMagnifyingGlassIcon class="text-stone-600 dark:text-white w-8 mx-auto p-1 bg-white dark:bg-stone-800 rounded-full shadow-md" />
      <h2 class="font-bold text-lg text-center">What are we looking for?</h2>
      <p class="text-sm text-center text-stone-500">Define your query in the following form.</p>
    </div>
    <QueryPanelForm />
  </div>
</template>

<script setup>
import { DocumentMagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import QueryPanelForm from './QueryPanelForm.vue';
</script>
