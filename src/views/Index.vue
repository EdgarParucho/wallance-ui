<template>
  <div class="pt-32">
    <Logo size="lg" />
    <h1 class="text-5xl font-bold text-center mt-16">
      Wallance
    </h1>
    <p class="text-lg text-center mt-4 font-medium">
      A bridge between your goals and your finances
    </p>
    <div class="mt-10 flex justify-center my-2 space-x-4">
      <button
      class="rounded-md py-1 w-52 hover:scale-105 transition-all font-bold focus:outline-violet-500 focus:outline-1 bg-white dark:bg-stone-800 shadow-lg"
      @click="loginFormIsOpen = true"
      >
        Log In
      </button>
      <button
      class="rounded-md py-1 w-52 hover:scale-105 transition-all focus:outline-1 focus:outline-violet-500 font-bold bg-stone-800 dark:bg-white text-white dark:text-black"
      @click="signFormIsOpen = true"
      >
        Join
      </button>
    </div>
    <div class="flex justify-center mt-10">
      <button
      class="flex items-center gap-1 mx-auto mb-3 px-3 py-1 text-xs hover:scale-110 transition-all hover:text-black hover:border-stone-500 text-stone-600 dark:text-stone-400 dark:hover:text-white"
      @click="resetPassword"
      >
        <KeyIcon class="w-4" />
        Recover my password
      </button>
    </div>
    <Login v-show="loginFormIsOpen" :form-is-open="loginFormIsOpen" @close-form="loginFormIsOpen = false" />
    <Sign
      v-if="signFormIsOpen"
      :form-is-open="signFormIsOpen"
      :action="recoveringPassword ? 'recovery' : 'sign'"
      @close-form="signFormIsOpen = false"
    />
    <div class="flex justify-center">
      <footer class="bottom-0 absolute h-16 dark:bg-stone-800 w-11/12 lg:w-5/12 flex items-center justify-between rounded-sm p-4">

        <div class="grid">
          <div class="text-zinc-600 dark:text-zinc-400 sm:text-xs">
            <h1 class="tracking-tight">
              Made by
              <span class="text-zinc-900 dark:text-zinc-100 sign text-xl">Edgar Parucho</span>
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
import { KeyIcon, LinkIcon } from '@heroicons/vue/24/outline';
import Login from '../components/auth/Login.vue';
import Logo from '../components/layout/Logo.vue';
import Sign from '../components/auth/Sign.vue';
import { ref, watch } from 'vue';

const signFormIsOpen = ref(false);
const loginFormIsOpen = ref(false);
const recoveringPassword = ref(false);

const links = [
  { URL: 'https://www.linkedin.com/in/edgarparucho/', title: "Linkedin", icon: "https://img.icons8.com/ios-filled/50/linkedin-circled--v1.png" },
  { URL: 'mailto:parucho.edgar@outlook.es', title: "Email", icon: "https://img.icons8.com/ios-filled/50/circled-envelope.png" },
  { URL: 'https://www.github.com/EdgarParucho', title: "GitHub", icon: "https://img.icons8.com/ios-filled/50/github--v1.png",  }
]        
        
 function resetPassword() {
  recoveringPassword.value = true;
  signFormIsOpen.value = true;
}

watch(() => signFormIsOpen.value,
(signFormIsOpen) => {
  if (!signFormIsOpen) recoveringPassword.value = false;
});

</script>

<style scoped>
.sign {
  /* font-family: 'Parisienne', cursive; */
  font-family: 'Sriracha', cursive;
}
</style>