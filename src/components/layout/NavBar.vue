<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon, CircleStackIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const atHome = computed(() => route.fullPath === '/');

const RecordForm = defineAsyncComponent(() => import('../record/RecordForm.vue'));

const links = [
  { hint: "Funds", path: "/funds", icon: ArchiveBoxIcon },
  { hint: "Records", path: "/records", icon: CircleStackIcon },
];
let recordFormIsOpen = ref(false);
</script>

<template>
  <div v-if="!atHome" class="flex justify-around items-center w-full fixed bottom-0 shadow-lg bg-stone-100 border border-stone-300 dark:border-stone-700 dark:bg-stone-800">
    <router-link
    v-for="link, i in links" :key="i"
    :to="link.path"
    class="grid justify-center pt-1 h-full w-full hover:bg-violet-600 hover:text-white dark:hover:bg-stone-700"
    :class="{ 'bg-violet-500 text-white': (route.fullPath === link.path) }"
    >
      <component :is="link.icon" class="w-6 mx-auto" />
      <small>{{ link.hint }}</small>
    </router-link>
    <button
    class="grid justify-center pt-1 h-full w-full font-semibold hover:text-white hover:bg-violet-500"
    @click="recordFormIsOpen = true"
    >
      <PlusIcon class="w-6 mx-auto" />
      <small>Record</small>
    </button><RecordForm v-if="recordFormIsOpen" :form-is-open="recordFormIsOpen" @close-form="recordFormIsOpen = false" :editing="false" />
  </div>
</template>
