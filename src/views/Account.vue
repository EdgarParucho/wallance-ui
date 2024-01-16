<template>
  <div class="mx-auto my-20 w-96 h-96 2xl:w-1/4 bg-white dark:bg-stone-800 shadow-lg rounded-md">
    <div class="flex items-center justify-center h-12 w-12 rounded-full mx-auto bg-stone-100 dark:bg-stone-800 text-stone-500 shadow-sm shadow-stone-400">
      <Cog6ToothIcon class="h-6 w-6" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-bold text-center mt-8">
      User Settings
    </h3>
    <p class="text-sm text-center">
      Check and update what you need from the form
    </p>
    <div aria-hidden="true">
      <div class="my-5">
        <div class="mx-10 border-t border-stone-400 dark:border-white" />
      </div>
    </div>
    <div class="my-2">
      <select
      v-model="themePreference"
      class="border-0 focus:ring-violet-500 text-center flex w-full mx-auto justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <div class="flex items-center justify-between">
        <UpdateEmail v-if="emailFormIsOpen" :form-is-open="emailFormIsOpen" @close-form="emailFormIsOpen = false" />
      </div>
    </div>

    <div class="my-2">
      <button
      @click="emailFormIsOpen = true"
      class="focus:outline-none focus:outline-1 focus:outline-violet-500 flex w-full justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
      :disabled="requestingOTP"
      >
        Update My E-mail
      </button>
      <div class="flex items-center justify-between">
        <UpdateEmail v-if="emailFormIsOpen" :form-is-open="emailFormIsOpen" @close-form="emailFormIsOpen = false" />
      </div>
    </div>

    <div class="my-2">
      <button
      @click="passwordFormIsOpen = true"
      class="focus:outline-none focus:outline-1 focus:outline-violet-500 flex w-full justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
      >
        Update My Password
      </button>
      <UpdatePassword
      v-if="passwordFormIsOpen"
      :form-is-open="passwordFormIsOpen"
      @close-form="passwordFormIsOpen = false"
      />
    </div>

    <div class="my-2">
      <button
      @click="deleteFormIsOpen = true"
      class="focus:outline-none focus:outline-1 focus:outline-violet-500 flex w-full justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
      >
        Delete My Account 
      </button>
      <DeleteAccount
      v-if="deleteFormIsOpen"
      :form-is-open="deleteFormIsOpen"
      @close-form="deleteFormIsOpen = false"
      />
    </div>

  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, inject, watch } from 'vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '../stores/userStore';
import UpdateEmail from '../components/user/UpdateEmail.vue';
import UpdatePassword from '../components/user/UpdatePassword.vue';
import DeleteAccount from '../components/user/DeleteAccount.vue';

const showToast = inject("showToast");
const userStore = useUserStore();
const { activeTheme } = storeToRefs(userStore);

const requestingOTP = ref(false);
const emailFormIsOpen = ref(false);
const passwordFormIsOpen = ref(false);
const deleteFormIsOpen = ref(false);
const themePreference = ref(activeTheme.value);

function updateThemePreference(theme) {
  const payload = { user_metadata: { theme } };
  document.querySelector("html").className = theme;
  userStore.updateUser(payload)
    .then(() => {
      userStore.setActiveTheme(theme);
      showToast("Preferences updated");
    })
    .catch((error) => console.error(error))
}

watch(themePreference, (themePref) => updateThemePreference(themePref))

</script>
