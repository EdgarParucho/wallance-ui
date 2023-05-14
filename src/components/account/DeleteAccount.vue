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
          v-model.number="OTP"
          >
        </fieldset>
        <button
        type="submit"
        class="flex w-full justify-center rounded-md bg-red-900 mt-2 p-2 text-sm text-red-200 shadow-sm opacity-70 hover:opacity-95 font-semibold disabled:bg-stone-900 disabled:hover:opacity-50 disabled:text-stone-600"
        :disabled="fieldIsEmpty || loading"
        >
          Delete my account
        </button>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue'
import { useUserStore } from '../../stores/userStore';
import { useSessionStore } from '../../stores/sessionStore';
import Dialog from '../helper/Dialog.vue';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const sessionStore = useSessionStore();
const emit = defineEmits(['close-form'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const router = useRouter()

const loading = ref(false)
const OTP = ref('')
const { userID } = storeToRefs(userStore);
const fieldIsEmpty = computed(() => OTP.value === '')

function onSubmit(OTP) {
  loading.value = true
  userStore.erase({ userID: userID.value, OTP })
    .then((response) => {
      alert(response)
      logout()
    })
    .catch((error) => alert(error))
    .finally(() => loading.value = false)
}

function logout() {
  sessionStore.logout()
  router.replace('/')
}
</script>
