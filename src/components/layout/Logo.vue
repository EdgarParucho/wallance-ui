<template>
  <div class="neumorphism w-40 h-40 mx-auto align-middle flex">
    <ScaleIcon class="w-16 text-stone-400 mx-auto" />
  </div>
</template>

<script setup>
import { ScaleIcon } from '@heroicons/vue/24/outline';
</script>

<style scoped>
.neumorphism {
  border-radius: 50px;
  background: #171717;
  box-shadow:  36px 36px 72px #0e0e0e, -36px -36px 72px #1f1f1f;
}
</style>
