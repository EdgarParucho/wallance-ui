<template>
  <div
  class="neumorphism mx-auto flex"
  :class="{ 'w-40 h-40': size === 'lg', 'w-12 h-12': size === 'md', 'w-8 h-8': size === 'sm' }"
  >
    <ScaleIcon
    class="flex text-stone-400 mx-auto"
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
  background: #171717;
  box-shadow:  36px 36px 72px #0e0e0e, -36px -36px 72px #1f1f1f;
}
</style>
