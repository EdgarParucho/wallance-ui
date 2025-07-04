<template>
  <main>
    <header class="mt-16">
      <Logo size="lg" />
      <h1 class="text-5xl font-bold text-center mt-16">Wallance</h1>
      <p class="text-lg text-center mt-4 font-medium">
        Track your records, then fix, plan, improve accordingly.
      </p>
      <div class="flex justify-center gap-10 mt-10">
        <button
        class="rounded-sm py-1 w-32 hover:scale-105 transition-all font-bold focus:outline-violet-500 focus:outline-1 bg-stone-800 text-white shadow-xl disabled:bg-stone-700 disabled:animate-pulse"
        @click="loginWithRedirect"
        :disabled="isLoading"
        >
          {{ isLoading ? '...loading' : 'Join' }}
        </button>
        <button
        class="rounded-sm py-1 w-32 hover:scale-105 transition-all border dark:border-stone-800 focus:outline-violet-500 focus:outline-1 shadow-xl disabled:bg-stone-700 disabled:animate-pulse"
        @click="loginToDemo"
        :disabled="isLoading"
        >
          Demo
        </button>
      </div>
    </header>
    <footer class="w-full absolute bottom-0 h-16 dark:bg-stone-800 flex items-center justify-between rounded-sm p-4">
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
  </main>
</template>

<script setup>
import { inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import { LinkIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/layout/Logo.vue';

const showToast = inject("showToast");

const router = useRouter();
const authStore = useAuthStore();
const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

const links = [
  {
    URL: 'https://www.linkedin.com/in/edgarparucho/',
    title: "Linkedin",
    icon: "https://img.icons8.com/ios-filled/50/linkedin-circled--v1.png",
  },
  {
    URL: 'mailto:e.parucho@outlook.com',
    title: "Email",
    icon: "https://img.icons8.com/ios-filled/50/circled-envelope.png",
  },
  {
    URL: 'https://www.github.com/EdgarParucho',
    title: "GitHub",
    icon: "https://img.icons8.com/ios-filled/50/github--v1.png",
  },
];

function loginToDemo() {
  authStore.login({ inDemoMode: true })
    .then(() => {
      showToast("Welcome! You are now in demo mode, try everything around.");
      router.replace("/demo");
    })
    .catch((message) => showToast(message));
}

watch(() => isAuthenticated.value, (isAuth) => {
  if (isAuth) {
    router.replace("/dashboard");
    showToast("It's great that you're here");
  }
  else if (authStore.accessToken !== "" || authStore.isAuthenticated) authStore.finishSession();
}, { immediate: true })

</script>

<style scoped>
.signature {
  font-family: 'Sriracha', cursive;
}
</style>