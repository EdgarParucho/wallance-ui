<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div class="mt-12 px-8">
      <h3 class="text-2xl text-center">
        Deleting my account
      </h3>
      <form @submit.prevent="onSubmit(OTP)">
        <fieldset class="my-6">
          <input
          type="text"
          class="block my-2 p-3 w-72 mx-auto rounded-sm text-stone-800"
          placeholder="Validation"
          required
          v-model="OTP"
          >
        </fieldset>
        <button
        type="submit"
        class="flex w-full justify-center rounded-md bg-red-900 mt-2 p-2 text-sm text-red-200 shadow-sm opacity-70 hover:opacity-95 font-semibold disabled:bg-stone-900 disabled:hover:opacity-50 disabled:text-stone-600"
        :disabled="fieldIsEmpty || loading"
        >
          Delete my account
        </button>
        <button
        class="block rounded-sm my-2 px-3 mx-auto w-72 text-sm text-cyan-300 hover:text-cyan-100 bg-stone-800 disabled:text-stone-400 disabled:hover:bg-stone-800"
        @click="reSendOTP()"
        :disabled="loading || countDown > 0"
        type="button"
        >
          Request code again
          <span v-if="countDown > 0">
            ({{ countDown }})
          </span>
        </button>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue'
import { useAccountStore } from '../../stores/accountStore';
import { useCredentialStore } from '../../stores/credentialStore';
import Dialog from '../helper/Dialog.vue';


const accountStore = useAccountStore();
const credentialStore = useCredentialStore();
const emit = defineEmits(['close-form', 'request-otp'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const router = useRouter()

const OTP = ref('')
const loading = ref(false)
const countDown = ref(0);
const fieldIsEmpty = computed(() => OTP.value === '')

startCountDown();

function reSendOTP() {
  emit("request-otp");  
  startCountDown();
}

function onSubmit(OTP) {
  loading.value = true
  accountStore.erase({ OTP })
    .then((response) => {
      alert(response)
      logout()
    })
    .catch((error) => alert(error))
    .finally(() => loading.value = false)
}

function logout() {
  credentialStore.logout()
  router.replace('/')
}

function startCountDown() {
  countDown.value = 30;
  const counting = setInterval(function() {
    if (countDown.value === 0) clearInterval(counting)
    else countDown.value -= 1
  }, 1000);
};

</script>
