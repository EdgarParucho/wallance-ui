<template>
  <div class="lg:w-1/4 sm:w-11/12 bg-stone-900 text-white mx-auto">
    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2 bg-stone-700 text-yellow-400">
      <Cog6ToothIcon class="h-6 w-6 text-white" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium text-white text-center mt-4">
      Account Settings
    </h3>
    <p class="text-sm text-white text-center">
      Check and update what you need from the form
    </p>
    <div aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-white" />
      </div>
    </div>

    <div class="p-3">

      <div class="my-4">
        <h6 class="font-semibold">My Email</h6>
        <button
        @click="emailFormIsOpen = true"
        class="flex w-full justify-center rounded-md bg-stone-800 mt-2 p-2 text-sm text-white shadow-sm hover:bg-stone-700 font-semibold disabled:text-stone-500"
        :disabled="requestingOTP"
        >
          Update My E-mail
        </button>
        <div class="flex items-center justify-between">
          <UpdateEmail v-if="emailFormIsOpen" :form-is-open="emailFormIsOpen" @close-form="emailFormIsOpen = false" />
        </div>
      </div>

      <div class="my-4">
        <h6 class="font-semibold">My Password</h6>
        <button
        @click="requestOTP('update')"
        class="flex w-full justify-center rounded-md bg-stone-800 mt-2 p-2 text-sm text-white shadow-sm hover:bg-stone-700 font-semibold disabled:text-stone-500"
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
        <h6 class="font-semibold">My Account</h6>
        <button
        @click="requestOTP('delete')"
        class="flex w-full justify-center rounded-md bg-stone-800 mt-2 p-2 text-sm text-white shadow-sm hover:bg-stone-700 font-semibold disabled:text-stone-500"
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
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { Cog6ToothIcon, PencilIcon, KeyIcon } from '@heroicons/vue/24/outline'
import { useAccountStore } from '../stores/accountStore';
import { useCredentialStore } from '../stores/credentialStore';
import UpdateEmail from '../components/account/UpdateEmail.vue';
import UpdatePassword from '../components/account/UpdatePassword.vue';
import DeleteAccount from '../components/account/DeleteAccount.vue'
import { storeToRefs } from 'pinia';

const accountStore = useAccountStore();
const credentialStore = useCredentialStore();
const displayAlert = inject("alert");

const { account } = storeToRefs(accountStore);
const emailFormIsOpen = ref(false)
const passwordFormIsOpen = ref(false)
const deleteFormIsOpen = ref(false)
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
    email: account.value.email,
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
