<template>
  <div>
    <div class="mb-8">
      <DocumentMagnifyingGlassIcon class="text-stone-600 dark:text-white w-8 mx-auto p-1 bg-white dark:bg-stone-800 rounded-full shadow-md" />
      <h2 class="font-bold text-lg text-center">What are we looking for?</h2>
      <p class="text-sm text-center text-stone-500">Define your query in the following form.</p>
    </div>
    <div class="my-6">
      <div class="sm:flex sm:items-center sm:space-x-1 sm:justify-center">
        <div
          v-for="query, i in preferences.queries" :key="i"
          class="text-sm h-6 px-2 my-1 py-4 w-full shadow-sm sm:w-auto bg-white dark:bg-stone-800 font-bold rounded-full flex items-center justify-between"
        >
          <label :for="'query' + i" class="mx-2">{{ query.name }}</label>
          <div class="flex gap-1">
            <button :id="'query' + i" type="button" class="hover:scale-110 transition-transform rounded-full shadow-sm bg-stone-100 dark:bg-stone-700 p-1" @click="queryFromPreset(query.filters)">
              <MagnifyingGlassIcon class="w-4" />
            </button>
            <button type="button" class="hover:scale-110 transition-transform rounded-full bg-red-800 bg-opacity-25 px-1" @click="removePreferredQuery(i)">
              <XMarkIcon class="text-red-500 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <QueryPanelForm />
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon, XMarkIcon, DocumentMagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { ref, computed, inject } from 'vue';
import { storeToRefs } from "pinia";
import { useUserStore } from '../../stores/userStore';
import { useRecordStore } from '../../stores/recordStore';
import QueryPanelForm from './QueryPanelForm.vue';

const showAlert = inject("showAlert");
const showToast = inject("showToast");

const recordStore = useRecordStore();
const userStore = useUserStore();
const { preferences } = storeToRefs(userStore);

const filters = ref({
  tag: null,
  note: null,
  fromDate: null,
  toDate: null,
  type: null,
  fundID: null,
});

const loading = ref(false);

const appliedFilters = computed(() => {
  const filtersEntries = Object.entries(filters.value);
  const validEntries = filtersEntries.filter(([key, value]) => value !== "" && value !== null);
  return Object.fromEntries(validEntries);
});

function submitQuery(filters) {
  loading.value = true;
  recordStore.getRecords({ filters })
    .then((recordsLength) => {
      if (recordsLength > 0) showToast('Your records were loaded.');
      else showAlert({ type: "info", text: "Filters didn't match any record." });
    })
    .catch((message) => showAlert({ type: "error", text: message }))
    .finally(() => loading.value = false)
}

function removePreferredQuery(queryIndex) {
  const queryDeletionConfirmed = confirm("Please confirm to remove this query from your preferences");
  if (!queryDeletionConfirmed) return
  const payload = JSON.parse(JSON.stringify(preferences.value));
  payload.queries.splice(queryIndex, 1);
  userStore.updateUser({ OTP: null, updateEntries: { preferences: payload } })
    .then(() => preferences.value = payload)
    .catch((error) => console.log(error))
}

function queryFromPreset(queryFilters) {
  filters.value = { ...filters.value, ...queryFilters };
  submitQuery(appliedFilters.value);
}

</script>