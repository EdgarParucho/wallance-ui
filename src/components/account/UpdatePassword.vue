<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="mt-12 px-8">
      <h3 class="text-2xl text-center">
        Updating my password
      </h3>
      <form @submit.prevent="onSubmit(form)">
        <fieldset class="my-6">
          <input
          type="number"
          min="1000"
          max="9999"
          class="block my-2 p-3 w-72 mx-auto rounded-sm bg-transparent text-white"
          placeholder="OTP"
          required
          v-model.number="form.OTP"
          >
          <input
          type="password"
          class="block my-2 p-3 w-72 mx-auto rounded-sm bg-transparent text-white"
          placeholder="Password"
          required
          v-model="form.newPassword"
          >
          <input
          type="password"
          class="block my-2 p-3 w-72 mx-auto rounded-sm bg-transparent text-white"
          placeholder="Password"
          required
          v-model="reEnteredPassword"
          >
        </fieldset>
        <button
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
        type="submit"
        :disabled="loading || passwordMismatch || someFieldIsEmpty"
        >
          Update Now
        </button>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../../stores/userStore';
import Dialog from '../helper/Dialog.vue';

const userStore = useUserStore()
const emit = defineEmits(['close-form'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })

const form = ref({ OTP: 0, newPassword: '' })
const reEnteredPassword = ref('')
const loading = ref(false)
const userID = userStore.userID;

const passwordMismatch = computed(() => form.value.newPassword !== reEnteredPassword.value)
const someFieldIsEmpty = computed(() => {
  return form.value.OTP === '' || form.value.newPassword === '' || reEnteredPassword.value === ''
})

function onSubmit({ OTP, newPassword }) {
  loading.value = true
  userStore.updatePassword({ OTP, userID, body: { password: newPassword } })
    .then((response) => {
      alert(response)
      emit('close-form')
    })
    .catch((error) => alert(error))
    .finally(() => loading.value = false)
}
</script>

<style scoped>
/* Remove the default arrows from input number fields */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: inherit;
}
</style>
