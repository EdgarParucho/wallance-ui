<script setup>
import { provide, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "vue-toastification";
import { CheckIcon } from '@heroicons/vue/24/outline';
import { useAuth0 } from '@auth0/auth0-vue';
import swal from "sweetalert";
import API from './services/API';
import AppBar from './components/layout/AppBar.vue';
import NavBar from './components/layout/NavBar.vue';
import { useUserStore } from './stores/userStore';
import { useAuthStore } from './stores/authStore';

const userStore = useUserStore();
const authStore = useAuthStore();
const { activeTheme } = storeToRefs(userStore);
const { accessToken } = storeToRefs(authStore);
const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

const alertTitleOnType = {
  info: "Attention",
  error: "Something went wrong",
};

const toast = useToast();

const showToast = (text) => toast(text, { icon: CheckIcon });

const showAlert = ({ type, text }) => swal({
  icon: type,
  title: alertTitleOnType[type],
  text,
  button: "Dismiss",
  timer: null,
});

provide("showToast", showToast);
provide("showAlert", showAlert);

async function getUserData(data) {
  const APIAccessToken = await getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: import.meta.env.VITE_AUTH0_SCOPE,
    }
  });
  API.defaults.headers.common['Authorization'] = "Bearer " + APIAccessToken;
  authStore.login(data)
    .then(() => {
      accessToken.value = APIAccessToken;
      userStore.setActiveTheme(user.value.theme);
    })
    .catch((message) => showAlert({
      title: "Couldn't authenticate you",
      type: "error", text: message
    }))
}

watch(activeTheme, (theme) => document.querySelector("html").className = theme, { immediate: true })

watch(() => isLoading.value, (isLoading) => {
  if (isLoading) return;
  if (!isAuthenticated.value) {
    if (accessToken.value !== "" || authStore.isAuthenticated) authStore.finishSession();
    return;
  }
  if (accessToken.value === "") getUserData({ email: user.value.email });
}, { immediate: true })


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