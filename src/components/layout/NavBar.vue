<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon, ArrowsRightLeftIcon, CircleStackIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useFundStore } from '../../stores/fundStore';

const route = useRoute();
const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);
const atHome = computed(() => route.fullPath === '/');

const RecordForm = defineAsyncComponent(() => import('../record/RecordForm.vue'));
const AssignmentForm = defineAsyncComponent(() => import('../record/AssignmentForm.vue'));

const links = [
  { hint: "Funds", path: "/funds", icon: ArchiveBoxIcon },
  { hint: "Records", path: "/records", icon: CircleStackIcon },
];
let recordFormIsOpen = ref(false);
let assignmentFormIsOpen = ref(false);
</script>

<template>
  <div v-if="!atHome" class="flex justify-around items-center w-full fixed bottom-0 shadow-lg bg-stone-100 border border-stone-300 dark:border-stone-700 dark:bg-stone-800">
    <button
    class="grid justify-center pt-1 h-full w-full font-semibold hover:bg-white dark:hover:bg-stone-700"
    @click="recordFormIsOpen = true"
    >
      <PlusIcon class="text-violet-500 w-6 mx-auto" />
      <small>Record</small>
    </button>

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
    @click="assignmentFormIsOpen = true"
    :disabled="funds.length < 2"
    class="grid justify-center pt-1 h-full w-full font-semibold hover:bg-white dark:hover:bg-stone-700 disabled:text-stone-400 disabled:dark:text-stone-500"
    >
      <ArrowsRightLeftIcon :class="[(funds.length < 2) ?'text-stone-400 dark:text-stone-500' : 'text-violet-500', 'w-6 mx-auto']" />
      <small>Assign</small>
    </button>
    <RecordForm v-if="recordFormIsOpen" :form-is-open="recordFormIsOpen" @close-form="recordFormIsOpen = false" :editing="false" />
    <AssignmentForm v-if="assignmentFormIsOpen" :form-is-open="assignmentFormIsOpen" @close-form="assignmentFormIsOpen = false" />
  </div>
</template>
