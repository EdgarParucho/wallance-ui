<template>
  <div class="pt-26">
    <Logo />
    <p class="text-white text-center mt-16">
      <blockquote class="italic" cite="http://www.worldwildlife.org/who/index.html">
        Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver. - Ayn Rand
      </blockquote>
    </p>
    <h1 class="text-3xl font-bold text-center mt-6 text-white">
      What's your next action?
    </h1>
    
    <div class="mt-10 my-2">
      <div class="flex justify-center">
        <button
        class="rounded-sm px-3 py-1 outline-none w-52 bg-yellow-400 hover:bg-yellow-300 text-black font-bold flex items-center"
        @click="formIsOpen = true"
        >
          <PlusIcon class="relative left-0 w-5" />
          <span class="mx-auto">Add Record</span>
        </button>
      </div>

      <div class="flex justify-center space-x-12 items-center mt-4">
        <router-link
        class="text-stone-300 hover:underline hover:text-white font-semibold"
        to="/funds"
        >
          Manage my funds
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
import { PlusIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue'
import { defineAsyncComponent } from 'vue'
import Logo from '../components/layout/Logo.vue';

const RecordForm = defineAsyncComponent(
  () => import('../components/record/RecordForm.vue')
)

let formIsOpen = ref(false)
</script>