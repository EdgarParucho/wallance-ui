<template>
  <div class="w-screen h-screen fixed top-0 grid place-items-center bg-stone-900 bg-opacity-80 overflow-hidden">
    <div class="w-11/12 lg:w-1/3 rounded-sm bg-stone-100 dark:bg-stone-800 sticky">
      <header class="flex items-end text-left justify-center px-10 gap-4">
        <div class="flex items-center justify-around h-12 w-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 shadow-sm shadow-stone-400">
          <component :is="icon" class="h-8 w-8" aria-hidden="true" />
        </div>
        <div>
          <h3 class="text-lg font-bold mt-8">{{ title }}</h3>
          <p class="text-sm">{{ subtitle }}</p>
        </div>
      </header>
      <hr class="my-6 border-stone-500">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>

import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  document.getElementsByTagName("body")[0].setAttribute("style", "overflow: hidden;");
})

onUnmounted(() => {
  document.getElementsByTagName("body")[0].setAttribute("style", "overflow: auto;");
})

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    default: false,
  },
  icon: {
    required: true,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
})
const emit = defineEmits(['close-form'])
</script>