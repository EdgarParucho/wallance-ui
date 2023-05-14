<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '../../stores/sessionStore';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const atHome = computed(() => route.fullPath === '/');

function logout() {
  sessionStore.logout()
  router.replace('/')
}
</script>

<template>
  <div v-if="!atHome" class="flex justify-between items-center px-4 rounded-md bg-stone-900 w-full fixed left-0 top-0 h-16">
    <router-link to="/dashboard" class="font-bold">Wallance</router-link>
    <Menu as="div" class="relative inline-block text-left">
        <MenuButton class="inline-flex justify-center rounded-full bg-stone-800 p-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700">
          <Bars3Icon class="w-8" />
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
              @click="logout">
                Log out
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
