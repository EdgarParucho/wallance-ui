<template>
  <div class="text-center">
    <span class="text-6xl dark:text-white font-bold">
      Wallance
    </span>
    <p class="text-stone-500 dark:text-stone-400">
      Measure your finances, draw your plans, track your movements.
    </p>
    <div class="mt-20">
      <h2 class="mt-10 text-2xl font-bold mb-6 dark:text-white">
        Control is yours, what do you want to do?
      </h2>
      <router-link class="bg-stone-100 dark:bg-stone-800 dark:text-white mx-6 my-1 font-bold rounded-md px-5 py-2" to="#">
        Check my savings
      </router-link>
      <button
        class="bg-yellow-400 text-stone-900 mx-6 my-1 font-bold rounded-md px-5 py-2"
        @click="open = true"
      >
        Add a new record
      </button>
      <router-link class="bg-stone-100 dark:bg-stone-800 dark:text-white mx-6 my-1 font-bold rounded-md px-5 py-2" to="/history">
        Check my records
      </router-link>
    </div>

    <RecordForm :open="open" @close-form="open = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RecordForm from '../components/record/RecordForm.vue';

let open = ref(false)
</script>