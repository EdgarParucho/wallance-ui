<template>
  <div>
    <form class="my-10 p-8 shadow-md bg-white dark:bg-stone-800 2xl:w-2/5 mx-auto">
      <div>
        <QuestionMarkCircleIcon class="text-stone-600 dark:text-white w-10 mx-auto my-4 p-2 bg-white dark:bg-stone-800 rounded-full shadow-md" />
        <h2 class="font-bold text-lg text-center">What are we looking for?</h2>
      </div>

      <div class="my-6">
        <div class="sm:flex sm:items-center sm:space-x-1 sm:justify-center">
          <div
            v-for="query, i in preferences.queries" :key="i"
            class="text-sm my-2 h-6 w-full shadow-sm sm:w-auto dark:bg-stone-900 font-bold rounded-full flex items-center justify-between pl-2"
          >
            <label :for="'query' + i" class="mx-2">{{ query.name }}</label>
            <div class="flex">
              <button :id="'query' + i" type="button" class="px-1" @click="queryFromPreset(query.filters)">
                <MagnifyingGlassIcon class="w-4" />
              </button>
              <button type="button" class="px-1" @click="removePreferredQuery(i)">
                <XMarkIcon class="text-red-500 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <fieldset class="grid space-y-4 justify-center">
        <div class="sm:flex sm:flex-row space-y-4 sm:space-y-0 w-full gap-2">
          <div class="flex items-center gap-2">
            <span class="italic">All my</span>
            <select class="py-0 w-40 text-center bg-transparent border-transparent border-b-stone-500 font-bold" v-model="filters.type">
              <option class="bg-stone-700 text-white" :value="null">records</option>
              <option v-for="type, k in types" :key="k" class="bg-stone-700 text-white" :value="type.value">
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <span class="italic">related to</span>
            <select class="py-0 w-52 text-center bg-transparent border-transparent border-b-stone-500 font-bold" v-model="filters.fundID">
              <option class="bg-stone-700 text-white" :value="null">no particular fund</option>
              <option v-for="fund in funds" :key="fund.id" class="bg-stone-700 text-white" :value="fund.id">
                {{ fund.name }}
              </option>
            </select>
          </div>

        </div>

        <div class="sm:flex sm:flex-row space-y-4 sm:space-y-0 w-full gap-2">
          <div class="flex items-center gap-2">
            <span class="italic">from</span>
            <span class="py-0 w-36 text-center font-bold border border-transparent border-b-stone-500">
              {{ filters.fromDate || "origin" }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="italic">to</span>
            <span class="py-0 w-36 text-center font-bold border border-transparent border-b-stone-500">
              {{ filters.toDate || "present" }}
            </span>
            <button
            class="bg-stone-700 hover:scale-110 transition-transform text-white p-1 rounded-md"
            @click="dateFormIsOpen = true"
            type="button"
            >
              <CalendarIcon class="text-stone-200 w-4" />
            </button>
          </div>

          <Dialog :form-is-open="dateFormIsOpen" @close-form="dateFormIsOpen = false" title="Set Period" subtitle="Define one or both as you need" :icon="CalendarDaysIcon">
            <div class="py-6 px-8">
              <form>
                <input
                type="date"
                class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
                v-model="filters.fromDate"
                >
                <input
                type="date"
                class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
                v-model="filters.toDate"
                >
                <button
                type="button"
                class="flex justify-center items-center space-x-2 w-full my-2 py-1 outline-none font-bold rounded-sm text-white bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 dark:disabled:bg-stone-800 dark:disabled:text-stone-500 focus:outline-violet-500 outline-1"
                @click="dateFormIsOpen = false"
                >
                  Close
                </button>
              </form>
            </div>
          </Dialog>
        </div>

        <div class="sm:flex sm:flex-row space-y-4 sm:space-y-0 w-full gap-2">

          <div class="flex items-center gap-2">
            <span class="italic">with</span>
            <select class="py-0 bg-transparent border-transparent border-b-stone-500 font-bold" v-model="filters.tag">
              <option class="bg-stone-700 text-white" :value="null">any</option>
              <option v-for="tag, k in tags" :key="k" class="bg-stone-700 text-white" :value="tag">
                {{ tag }}
              </option>
            </select>
            <span class="italic">tag</span>
          </div>
        </div>

        <div class="sm:flex sm:flex-row space-y-4 sm:space-y-0 w-full gap-2">
          <span class="italic">and</span>
          <div class="flex flex-col md:flex-row gap-2">
            <div class="flex">
              <input class="w-2/5 sm:w-1/3 2xl:w-1/3 px-2 bg-transparent border-transparent border-b mx-0.5 border-b-stone-500 font-bold placeholder:text-center placeholder:text-stone-600 dark:placeholder:text-white"
              placeholder="whatever"
              v-model="filters.note"
              >
              <span class="italic">in its note.</span>
            </div>
          </div>
        </div>
      </fieldset>

      <div class="sm:flex sm:justify-center sm:gap-2 mt-10">
        <button type="button" class="w-full sm:w-36 flex items-center bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-sm px-4" @click="resetForm">
          <ArrowUturnLeftIcon class="w-4 text-left" />
          <span class="mx-auto">Reset form</span>
        </button>
        <button type="button" class="w-full sm:w-36 bg-violet-500 hover:bg-violet-600 text-white rounded-sm px-4" @click="submitQuery(appliedFilters)">
          <div class="flex items-center gap-1" v-if="loading">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading" class="mx-auto">Processing...</span>
          </div>
          <div v-else class="flex justify-center items-center gap-2">
            <MagnifyingGlassIcon class="w-4 text-left" />
            <span class="mx-auto">Search</span>
          </div>
        </button>
        <button type="button" class="w-full sm:w-36 flex items-center bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-sm px-4" @click="savingQueryFormIsOpen = true">
          <BookmarkIcon class="w-4 text-left" />
          <span class="mx-auto">Save config</span>
        </button>
        <Dialog :form-is-open="savingQueryFormIsOpen" @close-form="savingQueryFormIsOpen = false" title="Saving Query Config" subtitle="Name and confirm to save" :icon="BookmarkIcon">
          <div class="py-6 px-8">
            <form @submit.prevent="savePreferredQuery({ filters, name: queryName })">
              <input
              type="text"
              class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
              placeholder="Query Name"
              required
              :maxlength="20"
              v-model="queryName"
              >
              <div class="flex items-center gap-2">
                <button
                type="submit"
                class="flex justify-center items-center space-x-2 w-full my-2 py-1 outline-none font-bold rounded-sm text-white bg-violet-500 hover:bg-violet-400 disabled:bg-stone-300 dark:disabled:bg-stone-800 dark:disabled:text-stone-500 focus:outline-violet-500 outline-1"
                :disabled="queryName === ''"
                >
                  Confirm
                </button>
                
                <button
                type="button"
                class="flex justify-center items-center space-x-2 w-full my-2 py-1 outline-none font-bold rounded-sm dark:text-white dark:bg-stone-800 hover:dark:bg-stone-700 hover:bg-stone-200 bg-stone-300 focus:outline-violet-500 outline-1"
                @click="savingQueryFormIsOpen = false"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Dialog>        
      </div>
    </form>

  </div>
</template>

<script setup>
import { CalendarIcon, MagnifyingGlassIcon, QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { BookmarkIcon } from '@heroicons/vue/24/solid';
import { ref, computed, inject } from 'vue';
import { storeToRefs } from "pinia";

import { useAccountStore } from '../../stores/accountStore';
import { useRecordStore } from '../../stores/recordStore';
import { useFundStore } from '../../stores/fundStore';

import Dialog from '../layout/Dialog.vue';
import { ArrowUturnLeftIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline';

const displayAlert = inject("alert");

const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const recordStore = useRecordStore();
const { recordTags } = storeToRefs(recordStore);

const accountStore = useAccountStore();
const { preferences } = storeToRefs(accountStore);

const filters = ref({
  tag: null,
  note: null,
  fromDate: null,
  toDate: null,
  type: null,
  fundID: null,
});

const dateFormIsOpen = ref(false);
const savingQueryFormIsOpen = ref(false);
const queryName = ref("");
const loading = ref(false);

const types = [{ name: "debits", value: 2 }, { name: "credits", value: 1 }, { name: "assignments", value: 0 }];

const tags = computed(() => {
  const typeTags = (filters.value.type === null) ? Object.values(recordTags.value).flat() : recordTags.value[filters.value.type];
  return typeTags.sort();
});

const appliedFilters = computed(() => {
  const filtersEntries = Object.entries(filters.value);
  const validEntries = filtersEntries.filter(([key, value]) => value !== "" && value !== null);
  return Object.fromEntries(validEntries);
});

function submitQuery(filters) {
  loading.value = true;
  recordStore.getRecords({ filters })
    .then((recordsLength) => {
      const text = recordsLength > 0 ? 'Your records were loaded.' : "Filters didn't match any record.";
      const type = recordsLength > 0 ? 'success' : "info";
      displayAlert({ title: "Done", type, text })
    })
    .catch((message) => displayAlert({ title: "Something went wrong", type: "error", text: message }))
    .finally(() => loading.value = false)
}

function resetForm() {
  filters.value = {
    tag: null,
    note: null,
    fromDate: null,
    toDate: null,
    type: null,
    fundID: null,
  };
}

function savePreferredQuery(query) {
  preferences.value.queries.push(query);
  accountStore.updateAccount({ OTP: null, updateEntries: { preferences: preferences.value } });
  savingQueryFormIsOpen.value = false;
}

function removePreferredQuery(queryIndex) {
  const queryDeletionConfirmed = confirm("Please confirm to remove this query from your preferences");
  if (!queryDeletionConfirmed) return
  preferences.value.queries.splice(queryIndex, 1);
  accountStore.updateAccount({ OTP: null, updateEntries: { preferences: preferences.value } })
}

function queryFromPreset(queryFilters) {
  filters.value = { ...filters.value, ...queryFilters };
  submitQuery(appliedFilters.value);
}

</script>