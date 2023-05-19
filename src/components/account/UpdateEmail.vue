<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="mt-12 px-8">
      <h3 class="text-2xl text-center">
        Updating my email
      </h3>
      <form @submit.prevent="onSubmit">
        <fieldset class="my-6">
          <input
          type="email"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="newemail@example.com"
          autofocus
          required
          v-model.trim="email"
          >
          <input
          v-if="validatingEmail"
          type="number"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="OTP"
          required
          v-model.number="OTP"
          >
        </fieldset>
        <button
        type="submit"
        class="block rounded-sm px-3 py-1 mx-auto w-72 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold disabled:bg-stone-700"
        :disabled="loading || someFieldIsEmpty || !emailFormatIsValid"
        >
          {{ validatingEmail ? 'Update Now': 'Validate My Email' }}
        </button>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../../stores/userStore';
import Dialog from '../helper/Dialog.vue';

const userStore = useUserStore();
const emit = defineEmits(['close-form'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })

const loading = ref(false)

const userID = userStore.userID;
const email = ref('');
const someFieldIsEmpty = computed(() => {
  const emailFieldEmpty = email.value === ''
  const tokenFieldEmpty = validatingEmail.value && OTP.value === ''
  return emailFieldEmpty || tokenFieldEmpty
})
const currentEmail = computed(() => userStore.user.email)
const currentEqualsNew = computed(() => email.value === currentEmail.value)
const validatingEmail = ref(false)
const OTP = ref('');

function onSubmit() {
  if (validatingEmail.value) updateEmail(userID, OTP.value, email.value);
  else validateEmail({ email: email.value })
}

const emailFormatIsValid = computed(() => {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(email.value)
  return emailIsValid
})

function updateEmail(userID, OTP, email) {
  if (currentEqualsNew.value) return alert('The email you entered is already your current address.')
  loading.value = true
  userStore.updateEmail({ userID, OTP, body: { email } })
    .then((response) => {
      alert(response)
      emit('close-form')
    })
    .catch((error) => alert(error))
    .finally(() => loading.value = false)
}

function validateEmail({ email }) {
  loading.value = true
  userStore.preValidate({ email, mustBeNew: true })
    .then((response) => alert(response))
    .then(() => validatingEmail.value = true)
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
