<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="mt-12 px-8">
      <h3 class="text-2xl text-center">
        Time is priceless, let's log!
      </h3>
      <form @submit.prevent="handleSubmit(form)">
        <div class="mt-6">
          <input
          type="email"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="email@example.com"
          autofocus
          required
          v-model="form.email"
          >
          <input
          type="password"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="password"
          required
          v-model="form.password"
          >
          <button
          class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
          type="submit"
          :disabled="loading"
          >Log In</button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useCredentialStore } from '../../stores/credentialStore';
import Dialog from '../helper/Dialog.vue';

const props = defineProps({ formIsOpen: { type: Boolean, required: true } });
const emit = defineEmits(['close-form']);
const displayAlert = inject("alert");
const credentialStore = useCredentialStore();

const router = useRouter();

const form = ref({ email: '', password: '' });
let loading = ref(false);

const emailFormatIsValid = computed(() => {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(form.value.email);
  return emailIsValid;
});

function handleSubmit(data) {
  loading.value = true;
  credentialStore.login(data)
    .then((message) => {
      displayAlert({ title: "You're in", type: "success", text: message });
      router.replace('/dashboard');
    })
    .catch((message) => displayAlert({ title: "Couldn't authenticate you", type: "error", text: message }))
    .finally(() => loading.value = false)
}

</script>
