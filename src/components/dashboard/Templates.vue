<template>
  <div>
    <dl class="md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto">
      <div v-for="template, index in templates" :key="index" class="my-1 rounded-sm shadow-lg bg-white dark:bg-stone-800 flex justify-between items-center px-2">
        <dt class="flex items-center gap-4 p-3">
          <DocumentTextIcon class="w-8 mx-auto p-1.5 rounded-full shadow-sm text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          {{ template.name }}
        </dt>
        <div class="flex gap-1">
          <button class="text-xs shadow-sm bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-opacity-50 transition-opacity px-2 py-0.5 rounded-sm" @click="$emit('useTemplate', template)">
            <PlusIcon class="w-4 mx-auto text-stone-500 dark:text-stone-400" />
          </button>
          <button class="text-xs shadow-sm bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-opacity-50 transition-opacity px-2 py-0.5 rounded-sm" @click="confirmDeletion(index)">
            <TrashIcon class="w-4 mx-auto shadow-sm text-stone-500 dark:text-stone-400" />
          </button>
        </div>
      </div>
    </dl>

  </div>
</template>

<script setup>
import { DocumentTextIcon } from "@heroicons/vue/24/outline";
import { useAccountStore } from '../../stores/accountStore';
import { storeToRefs } from 'pinia';
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/solid";

const props = defineProps(["templates"]);
const emit = defineEmits(['useTemplate']);

const accountStore = useAccountStore();
const { preferences } = storeToRefs(accountStore);

async function confirmDeletion(index) {
  const deletionIsConfirmed = await swal({
    icon: "warning",
    title: "Removing template",
    text: 'Please confirm to delete the selected template.',
    buttons: true,
    timer: null,
  });
  if (deletionIsConfirmed) removeTemplate(index)
}

async function removeTemplate(index) {
  preferences.value.templates.splice(index, 1)
  await accountStore.updateAccount({ OTP: null, updateEntries: { preferences: preferences.value } });
}

</script>