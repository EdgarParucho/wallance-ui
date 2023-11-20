<script setup>
import AppBar from './components/layout/AppBar.vue';
import NavBar from './components/layout/NavBar.vue';
import swal from "sweetalert";
import { provide } from 'vue';

const alertTitleOnType = {
  success: "Done!",
  info: "Attention",
  error: "Something went wrong",
};

provide("alert", ({ type, text, button = false, timer = 1500 }) => swal({
  icon: type,
  title: alertTitleOnType[type],
  text,
  button: type !== "success" ? "Dismiss" : button,
  timer: type !== "success" ? null : timer
}));

</script>

<template>
  <AppBar />
  <router-view class="pb-28 pt-12 px-2" v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <NavBar />
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

.dark ::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

/* Remove the default arrows from input number fields */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: inherit;
}

</style>