<template>
  <div
  class="neumorphism mx-auto flex bg-white shadow-xl shadow-stone-300 text-stone-400 dark:bg-stone-800 dark:shadow-[#101010]"
  :class="{ 'w-40 h-40': size === 'lg', 'w-12 h-12': size === 'md', 'w-8 h-8': size === 'sm' }"
  >
    <ScaleIcon
    class="flex mx-auto"
    :class="{ 'w-16': size === 'lg', 'w-7': size === 'md', 'w-5': size === 'sm' }"
    />
  </div>
</template>

<script setup>
import { ScaleIcon } from '@heroicons/vue/24/outline';
const props = defineProps(['size']);
</script>

<style scoped>
.neumorphism {
  border-radius: 50px;
}
</style>
