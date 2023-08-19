<template>
  <div class="mx-auto mt-20 p-3 w-96 h-96 2xl:w-1/4 bg-white dark:bg-stone-800 shadow-lg rounded-md">
    <div class="flex items-center justify-center h-12 w-12 rounded-full mx-auto bg-stone-100 dark:bg-stone-800 text-stone-500 shadow-sm shadow-stone-400">
      <Cog6ToothIcon class="h-6 w-6" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-bold text-center mt-8">
      Account Settings
    </h3>
    <p class="text-sm text-center">
      Check and update what you need from the form
    </p>
    <div aria-hidden="true">
      <div class="my-5">
        <div class="mx-10 border-t border-stone-400 dark:border-white" />
      </div>
    </div>
    <div class="my-4">
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

    <div class="my-4">
      <button
      @click="requestOTP('update')"
      class="flex w-full justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
      :disabled="requestingOTP"
      >
        Update My Password
      </button>
      <UpdatePassword
      v-if="passwordFormIsOpen"
      :form-is-open="passwordFormIsOpen"
      @close-form="passwordFormIsOpen = false"
      @request-otp="requestOTP('update')" />
    </div>

    <div class="my-4">
      <button
      @click="requestOTP('delete')"
      class="flex w-full justify-center rounded-md dark:bg-stone-800 mt-2 p-2 text-sm shadow-md bg-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 font-semibold disabled:text-stone-500"
      :disabled="requestingOTP"
      >
        Delete My Account
      </button>
      <DeleteAccount v-if="deleteFormIsOpen" :form-is-open="deleteFormIsOpen" @close-form="deleteFormIsOpen = false" @request-otp="requestOTP('delete')" />
    </div>
    <div v-if="requestingOTP" class="flex justify-center space-x-3 border border-yellow-500 py-2 font-bold bg-stone-900">
      <KeyIcon class="w-5 text-yellow-500" aria-hidden="true" />
      <span class="text-sm">
        Requesting validation code
      </span>
    </div>

  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { Cog6ToothIcon, KeyIcon } from '@heroicons/vue/24/outline'
import { useCredentialStore } from '../stores/credentialStore';
import UpdateEmail from '../components/account/UpdateEmail.vue';
import UpdatePassword from '../components/account/UpdatePassword.vue';
import DeleteAccount from '../components/account/DeleteAccount.vue';

const credentialStore = useCredentialStore();
const displayAlert = inject("alert");

const emailFormIsOpen = ref(false);
const passwordFormIsOpen = ref(false);
const deleteFormIsOpen = ref(false);
const requestingOTP = ref(false);

async function requestOTP(action) {
  const deletionIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: 'Please confirm to continue, you will receive a code to complete this action.',
    buttons: true,
    timer: null,
  });
  if (!deletionIsConfirmed) return
  requestingOTP.value = true;
  credentialStore.requestOTPValidation({
    action,
    emailShouldBeStored: true
  })
    .then((message) => {
      displayAlert({ title: "Check your inbox", type: "info", text: message });
      if (action === "delete") deleteFormIsOpen.value = true;
      else passwordFormIsOpen.value = true;
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => requestingOTP.value = false)
}
</script>
