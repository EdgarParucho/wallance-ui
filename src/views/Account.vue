<template>
  <div class="lg:w-1/4 sm:w-11/12 bg-stone-900 mx-auto">
    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2">
      <Cog6ToothIcon class="h-6 w-6 text-white" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium leading-6 text-stone-900 dark:text-white pl-2">
      Account Settings
    </h3>
    <p class="text-sm text-stone-500 dark:text-stone-300 pl-2">
      Check and update what you need from the form
    </p>
    <div aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-stone-400" />
      </div>
    </div>

    <div class="p-3">

      <div class="my-4">
        <h6 class="font-semibold">My Email</h6>
        <div class="flex items-center justify-between">
          <span>{{ user.email }}</span>
          <button
          @click="emailFormIsOpen = true"
          class="w-10 rounded-md bg-stone-800 p-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700"
          >
            <PencilIcon class="w-5 mx-auto text-yellow-400" aria-hidden="true" />
          </button>
          <UpdateEmail v-if="emailFormIsOpen" :form-is-open="emailFormIsOpen" @close-form="emailFormIsOpen = false" />
        </div>
      </div>
      
      <div class="my-4">
        <h6 class="font-semibold">My Credit Sources</h6>
        <div class="flex items-center justify-between my-2" v-for="creditSource, i in user.creditSources" :key="i">
          <span class="w-4/6">{{ creditSource.name }}</span>
          <button class="w-10 rounded-md bg-stone-800 p-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700">
            <PencilIcon class="w-5 mx-auto text-yellow-400" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="my-4">
        <h6 class="font-semibold">My Password</h6>
        <button
        @click="updatePassword"
        class="flex w-full justify-center rounded-md bg-stone-800 mt-2 p-2 text-sm text-white shadow-sm hover:bg-stone-700 font-semibold"
        >
          Update My Password
        </button>
        <UpdatePassword v-if="passwordFormIsOpen" :form-is-open="passwordFormIsOpen" @close-form="passwordFormIsOpen = false" />
      </div>

      <div class="my-4">
        <h6 class="font-semibold">My Account</h6>
        <button
        @click="onDelete"
        class="flex w-full justify-center rounded-md bg-stone-800 mt-2 p-2 text-sm text-white shadow-sm hover:bg-stone-700 font-semibold"
        >
          Delete My Account
        </button>
        <DeleteAccount v-if="deleteFormIsOpen" :form-is-open="deleteFormIsOpen" @close-form="deleteFormIsOpen = false" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Cog6ToothIcon, PencilIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '../stores/userStore';
import UpdateEmail from '../components/account/UpdateEmail.vue';
import UpdatePassword from '../components/account/UpdatePassword.vue';
import DeleteAccount from '../components/account/DeleteAccount.vue'
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const emailFormIsOpen = ref(false)
const passwordFormIsOpen = ref(false)
const deleteFormIsOpen = ref(false)

function onDelete() {
  userStore.preValidate({ email: user.value.email, mustBeNew: false })
    .then((response) => alert(response))
    .then(() => deleteFormIsOpen.value = true)
    .catch((error) => alert(error))
}

function updatePassword() {
  userStore.preValidate({ email: user.value.email, mustBeNew: false })
    .then((response) => alert(response))
    .then(() => passwordFormIsOpen.value = true)
    .catch((error) => alert(error))
}
</script>
