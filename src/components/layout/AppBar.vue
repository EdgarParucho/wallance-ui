<template>
  <div v-if="!atHome" class="flex justify-between items-center w-full shadow-stone-300 shadow-md dark:shadow-md bg-stone-200 dark:bg-stone-800">

    <router-link :to="authStore.inDemoMode ? '/demo' : '/dashboard'" class="m-1 flex items-center gap-1">
      <ScaleIcon class="w-7" />
      <span class="text-lg first-letter:font-serif first-letter:text-stone-400 first-letter:text-3xl font-bold">
        Wallance
      </span>
    </router-link>

    <div class="m-1 flex space-x-4 text-stone-400">
      <Menu as="div" class="relative inline-block text-left">
        <MenuButton class="inline-flex justify-center rounded-full p-1 text-sm font-semibold shadow-sm bg-stone-500 text-white hover:bg-stone-600 dark:text-white dark:bg-stone-700 dark:hover:bg-stone-600">
          <UserIcon class="w-6" />
        </MenuButton>
        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
          <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-stone-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-white">
            <MenuItem v-slot="{ active }">
              <button
              @click="toggleDarkMode"
              :class="[{ 'bg-stone-700': active }, 'block w-full px-4 py-2 text-left text-sm']"
              >
                Toggle Dark Mode
              </button>
            </MenuItem>
            <MenuItem v-if="!authStore.inDemoMode" v-slot="{ active }">
              <button
              @click="emailFormIsOpen = true"
              :class="[{ 'bg-stone-700': active }, 'block w-full px-4 py-2 text-left text-sm']"
              :disabled="requestingOTP"
              >
                Update My E-mail
              </button>
            </MenuItem>
            <MenuItem v-if="!authStore.inDemoMode" v-slot="{ active }">
              <button
              @click="passwordFormIsOpen = true"
              :class="[{ 'bg-stone-700': active }, 'block w-full px-4 py-2 text-left text-sm']"
              :disabled="requestingOTP"
              >
                Update My Password
              </button>
            </MenuItem>
            <MenuItem v-if="!authStore.inDemoMode" v-slot="{ active }">
              <button
              @click="deleteFormIsOpen = true"
              :class="[{ 'bg-stone-700': active }, 'block w-full px-4 py-2 text-left text-sm']"
              :disabled="requestingOTP"
              >
                Delete My Account
              </button>
            </MenuItem>
          <div>
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
    <transition name="fade" mode="out-in">
      <UpdateEmail v-if="emailFormIsOpen" :form-is-open="emailFormIsOpen" @close-form="emailFormIsOpen = false" />
    </transition>

    <transition name="fade" mode="out-in">
      <UpdatePassword
      v-if="passwordFormIsOpen"
      :form-is-open="passwordFormIsOpen"
      @close-form="passwordFormIsOpen = false"
      />
    </transition>

    <transition name="fade" mode="out-in">
      <DeleteAccount
      v-if="deleteFormIsOpen"
      :form-is-open="deleteFormIsOpen"
      @close-form="deleteFormIsOpen = false"
      />
    </transition>

  </div>
</template>

<script setup>
import { defineAsyncComponent, inject, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { UserIcon, ScaleIcon } from '@heroicons/vue/24/outline';
import { useAuth0 } from '@auth0/auth0-vue';

const UpdateEmail = defineAsyncComponent(() => import('../form/UpdateEmail.vue'));
const UpdatePassword = defineAsyncComponent(() => import('../form/UpdatePassword.vue'));
const DeleteAccount = defineAsyncComponent(() => import('../form/DeleteAccount.vue'));

const showToast = inject("showToast");
const route = useRoute();
const router = useRouter();

const { logout } = useAuth0();
const userStore = useUserStore();
const authStore = useAuthStore();

const requestingOTP = ref(false);
const emailFormIsOpen = ref(false);
const passwordFormIsOpen = ref(false);
const deleteFormIsOpen = ref(false);

const atHome = computed(() => route.fullPath === '/');

function onLogout() {
  if (!authStore.inDemoMode) logout();
  authStore.finishSession();
  router.replace('/');
}

function toggleDarkMode() {
  const currentMode = document.querySelector("html").getAttribute('class');
  const newMode = currentMode == 'dark' ? 'light' : 'dark';
  document.querySelector("html").className = newMode;
  if (authStore.inDemoMode) return;
  const payload = { user_metadata: { theme: newMode } };
  userStore.updateUser(payload)
    .then(() => {
      userStore.setActiveTheme(newMode);
      showToast("Preferences updated");
    })
    .catch((error) => console.error(error))
}

</script>

<style>
input:checked ~ .toggle-circle {
    transform: translateX(100%);
}
</style>