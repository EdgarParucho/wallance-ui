<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '../../stores/authStore';
import { storeToRefs } from 'pinia';

const route = useRoute();
const authStore = useAuthStore();

const atHome = computed(() => route.fullPath === '/');
const { loggingIn } = storeToRefs(authStore);
const RecordForm = defineAsyncComponent(() => import('../form/RecordForm.vue'));
const recordFormIsOpen = ref(false);

</script>

<template>
  <button
  v-if="!atHome"
  class="fixed right-10 bottom-10 shadow-lg focus:outline-none flex items-center rounded-full -mt-16 w-14 h-14 text-white hover:bg-opacity-80 bg-gradient-to-tr from-violet-700 to-violet-400 hover:scale-110 transition-transform disabled:bg-stone-600"
  @click="recordFormIsOpen = true"
  :disabled="loggingIn">
    <PlusIcon class="w-10 mx-auto" />
  </button>
  <transition name="fade" mode="out-in">
    <RecordForm v-if="recordFormIsOpen" :form-is-open="recordFormIsOpen" @close-form="recordFormIsOpen = false" :editing="false" />
  </transition>
</template>
