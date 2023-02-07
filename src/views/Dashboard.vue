<template>
  <div class="text-center">
    <!-- logo -->
    <span class="text-6xl dark:text-white font-bold">
      Wallance
    </span>
    <p class="text-stone-500 dark:text-stone-400">
      Measure your finances, draw your plans, track your movements.
    </p>
    <!-- call to action -->
    <div class="mt-20">
      <h2 class="mt-10 text-2xl font-bold mb-6 dark:text-white">
        Control is yours, what do you want to do?
      </h2>
      <button class="bg-stone-100 dark:bg-stone-800 dark:text-white mx-6 my-1 font-bold rounded-md px-5 py-2">
        Check my savings
      </button>
      <RecordForm />
      <router-link to="/history">
        <button class="bg-stone-100 dark:bg-stone-800 dark:text-white mx-6 my-1 font-bold rounded-md px-5 py-2">
          Check my records
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RecordForm from '../components/RecordForm.vue';

let open = ref(true)
function toggle () {
  open = !open
  console.log(open);
}
</script>