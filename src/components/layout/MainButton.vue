<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const atHome = computed(() => route.fullPath === '/');

const RecordForm = defineAsyncComponent(() => import('../form/RecordForm.vue'));
let recordFormIsOpen = ref(false);

</script>

<template>
  <button
     v-if="!atHome" class="fixed right-10 bottom-10 shadow-lg focus:outline-none flex items-center rounded-full -mt-16 w-14 h-14 text-white hover:bg-opacity-80 bg-gradient-to-tr from-violet-700 to-violet-400 hover:scale-110 transition-transform"
    @click="recordFormIsOpen = true"
    >
      <PlusIcon class="w-10 mx-auto" />
    </button>
    <RecordForm v-if="recordFormIsOpen" :form-is-open="recordFormIsOpen" @close-form="recordFormIsOpen = false" :editing="false" />
</template>
