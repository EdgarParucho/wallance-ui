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

      <button
      class="bg-yellow-400 text-stone-900 font-bold rounded-sm px-6 py-1"
      @click="formIsOpen = true"
      >
        Add a new record
      </button>
      <div class="flex justify-center space-x-12 items-center mt-4">
        <router-link
        class="text-stone-300 hover:underline hover:text-white font-semibold"
        to="/funds"
        >
          Manage my savings
        </router-link>
        <router-link
        class="text-stone-300 hover:underline hover:text-white font-semibold"
        to="/records">
          Check my records
        </router-link>
      </div>
    </div>
    <RecordForm v-if="formIsOpen" :form-is-open="formIsOpen" @close-form="formIsOpen = false" :editing="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineAsyncComponent } from 'vue'

const RecordForm = defineAsyncComponent(
  () => import('../components/record/RecordForm.vue')
)

let formIsOpen = ref(false)
</script>