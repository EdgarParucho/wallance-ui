<script setup>
import AppBar from './components/helper/AppBar.vue';
import swal from "sweetalert";
import { provide } from 'vue';

provide("alert", ({ type = "error", title, text, button = false, timer = 2000 }) => swal({
  icon: type,
  title,
  text,
  button: type !== "success" ? "Dismiss" : button,
  timer: type !== "success" ? null : timer
}));
</script>

<template>
  <div class="px-2 pt-8">
    <AppBar />
    <router-view v-slot="{ Component }" class="mt-12">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}
</style>