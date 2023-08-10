<script setup>
import AppBar from './components/layout/AppBar.vue';
import NavBar from './components/layout/NavBar.vue';
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
  <router-view class="pt-12 px-2 bg-stone-900 min-h-screen" v-slot="{ Component }">
    <AppBar />
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
    <NavBar />
  </router-view>
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