<template>
  <div class="mx-auto mt-20 w-96 h-96 2xl:w-1/4 bg-white dark:bg-stone-800 shadow-lg rounded-md">
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
      <button
      @click="emailFormIsOpen = true"
      class="flex w-full justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
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
      @click="requestOTP"
      class="flex w-full justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
      :disabled="requestingOTP"
      >
        Update My Password
      </button>
      <UpdatePassword
      v-if="passwordFormIsOpen"
      :form-is-open="passwordFormIsOpen"
      @close-form="passwordFormIsOpen = false"
      @request-otp="requestOTP" />
    </div>

    <div class="my-2">
      <button
      @click="requestOTP({ deleting: true })"
      class="flex w-full justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
      :disabled="requestingOTP"
      >
        Delete My Account
      </button>
      <DeleteAccount v-if="deleteFormIsOpen" :form-is-open="deleteFormIsOpen" @close-form="deleteFormIsOpen = false" @request-otp="requestOTP({ deleting: true })" />
    </div>
    <div v-if="requestingOTP" class="flex items-center justify-center space-x-3 py-1 font-bold bg-stone-900">
      <svg
      class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-sm text-white">
        Requesting validation code
      </span>
    </div>
    
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/authStore';
import UpdateEmail from '../components/user/UpdateEmail.vue';
import UpdatePassword from '../components/user/UpdatePassword.vue';
import DeleteAccount from '../components/user/DeleteAccount.vue';

const authStore = useAuthStore();
const showAlert = inject("showAlert");

const emailFormIsOpen = ref(false);
const passwordFormIsOpen = ref(false);
const deleteFormIsOpen = ref(false);
const requestingOTP = ref(false);

async function requestOTP({ deleting = false }) {
  const deletionIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: 'Please confirm to continue, you will receive a code to complete this action.',
    buttons: true,
    timer: null,
  });
  if (!deletionIsConfirmed) return
  requestingOTP.value = true;
  authStore.requestOTP({ emailShouldBeStored: true })
    .then(({ message }) => {
      showAlert({ type: "info", text: message });
      if (deleting) deleteFormIsOpen.value = true;
      else passwordFormIsOpen.value = true;
    })
    .catch((message) => showAlert({ type: "error", text: message }))
    .finally(() => requestingOTP.value = false)
}
</script>
