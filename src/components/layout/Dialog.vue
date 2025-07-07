<template>
  <div class="w-screen h-screen fixed top-0 grid place-items-center bg-stone-900 bg-opacity-80 overflow-hidden z-10" role="dialog">
    <div class="w-11/12 md:w-1/2 lg:w-1/3 pt-4 rounded-sm bg-stone-100 dark:bg-stone-800 sticky">
      <header class="flex items-center justify-center gap-2">
        <h3 class="text-xl font-bold">{{ title }}</h3>
      </header>
      <hr class="my-4 mx-auto border-stone-300 w-2/3">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>

import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  }
})

const emit = defineEmits(['close-form'])

onMounted(() => hideOverflowOnBody())
onUnmounted(() => showOverflowOnBody())

function hideOverflowOnBody() {
  document.getElementsByTagName("body")[0].setAttribute("style", "overflow: hidden;");
}

function showOverflowOnBody() {
  document.getElementsByTagName("body")[0].setAttribute("style", "overflow: auto;");
}

</script>