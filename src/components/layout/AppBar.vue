<template>
  <div v-if="!atHome" class="flex justify-between items-center px-4 py-2 w-full shadow-stone-300 shadow-md dark:shadow-md bg-stone-200 dark:bg-stone-800">
    <router-link to="/dashboard" class="flex items-center gap-2">
      <ScaleIcon class="w-7" />
      <span class="text-lg first-letter:font-serif first-letter:text-stone-400 first-letter:text-3xl font-bold">
        Wallance
      </span>
    </router-link>

    <div class="flex space-x-4 text-stone-400">
      <Menu as="div" class="relative inline-block text-left">
        <MenuButton class="inline-flex justify-center rounded-full p-1 text-sm font-semibold shadow-sm bg-stone-500 text-white hover:bg-stone-600 dark:text-white dark:bg-stone-700 dark:hover:bg-stone-600">
          <UserIcon class="w-6" />
        </MenuButton>
        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
          <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-stone-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-white">
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <RouterLink to="/account" :class="[{ 'bg-stone-700': active }, 'block w-full px-4 py-2 text-left text-sm']">
                  My Account
                </RouterLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                type="button" :class="[{ 'bg-stone-700': active }, 'block w-full px-4 py-2 text-left text-sm']"
                @click="onLogout">
                  Log out
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { UserIcon, ScaleIcon } from '@heroicons/vue/24/outline';
import { useAuth0 } from '@auth0/auth0-vue';

const route = useRoute();
const authStore = useAuthStore();
const { logout } = useAuth0();

const atHome = computed(() => route.fullPath === '/');

function onLogout() {
  logout();
  authStore.logout();
}

</script>

<style>
.toggle-path {
    transition: background 0.3s ease-in-out;
}
.toggle-circle {
    top: 0.2rem;
    left: 0.25rem;
    transition: all 0.3s ease-in-out;
}
input:checked ~ .toggle-circle {
    transform: translateX(100%);
}
</style>