<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon, CircleStackIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const atHome = computed(() => route.fullPath === '/');

const RecordForm = defineAsyncComponent(() => import('../record/RecordForm.vue'));
let recordFormIsOpen = ref(false);

function scrollToTop() {
  setTimeout(() => {
    window.scrollTo(0,0);
  }, 250)
}

</script>

<template>
  <div v-if="!atHome" class="sticky flex justify-around items-center w-full bottom-0 shadow-lg bg-stone-100 border border-stone-300 dark:border-stone-700 dark:bg-stone-800">
    <router-link
    @click.native="scrollToTop"
    to="/funds"
    class="text-center pt-1 w-full hover:bg-stone-200 dark:hover:bg-stone-900"
    :class="{ 'bg-stone-200 dark:bg-stone-700': (route.fullPath === '/funds') }"
    >
      <component :is="ArchiveBoxIcon" class="w-6 mx-auto" />
      <small>Funds</small>
    </router-link>
    <button
    class="focus:outline-none flex items-center rounded-full -mt-4 w-14 h-14 absolute text-white hover:bg-opacity-80 bg-gradient-to-tr from-violet-700 to-violet-400 hover:scale-110 transition-transform"
    @click="recordFormIsOpen = true"
    >
      <PlusIcon class="w-10 mx-auto" />
    </button>
    <router-link
    @click.native="scrollToTop"
    to="/records"
    class="text-center pt-1 w-full hover:bg-stone-200 dark:hover:bg-stone-900"
    :class="{ 'bg-stone-200 dark:bg-stone-700': (route.fullPath === '/records') }"
    >
      <component :is="CircleStackIcon" class="w-6 mx-auto" />
      <small>Records</small>
    </router-link>
    <RecordForm v-if="recordFormIsOpen" :form-is-open="recordFormIsOpen" @close-form="recordFormIsOpen = false" :editing="false" />
  </div>
</template>
