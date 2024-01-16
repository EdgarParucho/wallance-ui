<script setup>
import { provide, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "vue-toastification";
import { CheckIcon } from '@heroicons/vue/24/outline';
import swal from "sweetalert";
import AppBar from './components/layout/AppBar.vue';
import NavBar from './components/layout/NavBar.vue';
import { useUserStore } from './stores/userStore';

const userStore = useUserStore();
const { activeTheme } = storeToRefs(userStore);

const alertTitleOnType = {
  info: "Attention",
  error: "Something went wrong",
};

const toast = useToast();

provide("showToast", (text) => toast(text, { icon: CheckIcon }));
provide("showAlert", ({ type, text }) => swal({
  icon: type,
  title: alertTitleOnType[type],
  text,
  button: "Dismiss",
  timer: null,
}));

watch(activeTheme, (theme) => document.querySelector("html").className = theme, { immediate: true })

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