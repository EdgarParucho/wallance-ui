<template>
  <div class="pt-32">
    <Logo size="lg" />
    <h1 class="text-5xl font-bold text-center mt-16">Wallance</h1>
    <p class="text-lg text-center mt-4 font-medium">
      Track your records, then fix, plan, improve accordingly.
    </p>
    <div class="mt-10 flex justify-center my-2 space-x-4">
      <button
      class="rounded-sm py-1 w-52 hover:scale-105 transition-all font-bold focus:outline-violet-500 focus:outline-1 bg-stone-800 text-white shadow-lg disabled:bg-stone-700 disabled:animate-pulse"
      @click="onSubmit"
      :disabled="loading"
      >
        {{ loading ? '...loading' : 'Join' }}
      </button>
    </div>
    <div class="flex justify-center">
      <footer class="absolute h-16 dark:bg-stone-800 w-11/12 lg:w-5/12 flex items-center justify-between rounded-sm p-4">
        <div class="grid">
          <div class="text-zinc-600 dark:text-zinc-400 sm:text-xs">
            <h1 class="tracking-tight">
              Made by
              <span class="text-zinc-900 dark:text-zinc-100 signature">Edgar Parucho</span>
            </h1>
            <a href="https://edgarparucho.github.io/" target="_blank" class="text-zinc-900 dark:text-zinc-100 underline flex gap-1">
              <LinkIcon class="w-4" />
              edgarparucho.github.io
            </a>
          </div>
        </div>
        <div class="flex items-center justify-center space-x-2">
          <a
          v-for="link, k in links" :key="k"
          :href="link.URL"
          target="_blank"
          :title="link.title"
          class="rounded-full border border-transparent shadow-sm shadow-zinc-900 bg-white hover:scale-110 transition-all"
          >
            <img width="32" height="32" :src="link.icon" :alt="link.title">
          </a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import { LinkIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import Logo from '../components/layout/Logo.vue';
import API from '../services/API';

const showAlert = inject("showAlert");
const showToast = inject("showToast");

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();

const loading = ref(false);

const links = [
  {
    URL: 'https://www.linkedin.com/in/edgarparucho/',
    title: "Linkedin",
    icon: "https://img.icons8.com/ios-filled/50/linkedin-circled--v1.png",
  },
  {
    URL: 'mailto:parucho.edgar@outlook.es',
    title: "Email",
    icon: "https://img.icons8.com/ios-filled/50/circled-envelope.png",
  },
  {
    URL: 'https://www.github.com/EdgarParucho',
    title: "GitHub",
    icon: "https://img.icons8.com/ios-filled/50/github--v1.png",
  },
];

function onSubmit() {
  loginWithRedirect();
}

async function getUserData(data) {
  loading.value = true;
  const accessToken = await getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: import.meta.env.VITE_AUTH0_SCOPE,
    }
  });
  API.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
  authStore.login(data)
    .then((message) => {
      authStore.accessToken = accessToken;
      userStore.setActiveTheme(user.value.theme);
      router.replace('/dashboard');
      showToast(message);
    })
    .catch((message) => showAlert({
      title: "Couldn't authenticate you",
      type: "error", text: message
    }))
    .finally(() => loading.value = false)
}

watch(() => isAuthenticated.value, (isAuth) => {
  if (isAuth) {
    if (!user.value.email_verified) showAlert({
      type: "info",
      text: "Please use the verification link sent to the provided email so you can keep your access.",
    });
    getUserData({ email: user.value.email });
}
}, { immediate: true })

</script>

<style scoped>
.signature {
  font-family: 'Sriracha', cursive;
}
</style>