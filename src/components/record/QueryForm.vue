<template>
  <div class="border rounded-sm border-stone-300 dark:border-stone-500 p-2 2xl:w-2/3 mx-auto">
    <form @submit.prevent="submitQuery(filters)">
      <div class="flex space-x-1 items-center justify-start">
        <button
        :class="[
          { 'bg-purple-600 dark:bg-purple-600 text-white': currentMonthRange.filterApplied },
          'hover:text-white dark:hover:text-white dark:text-white bg-stone-300 hover:bg-purple-600 dark:bg-stone-700 dark:hover:bg-purple-600 font-bold text-xs py-1 px-3 rounded-full flex items-center justify-between gap-1'
        ]"
        @click="filterByThisMonth">
          <CalendarIcon class="w-4" />
          This month
        </button>
        <button
        :class="[
          { 'bg-purple-600 dark:bg-purple-600 text-white': currentYearRange.filterApplied },
          'hover:text-white dark:hover:text-white dark:text-white bg-stone-300 hover:bg-purple-600 dark:bg-stone-700 dark:hover:bg-purple-600 font-bold text-xs py-1 px-3 rounded-full flex items-center justify-between gap-1'
        ]"
        @click="filterByThisYear">
          <CalendarDaysIcon class="w-4" />
          This year
        </button>
        <button
        v-for="query, i in preferences.queries" :key="i"
        :class="[
          { 'bg-purple-600 dark:bg-purple-600 text-white': JSON.stringify(query.filters) === JSON.stringify(filters)   },
          'hover:text-white dark:hover:text-white dark:text-white bg-stone-300 hover:bg-purple-600 dark:bg-stone-700 dark:hover:bg-purple-600 font-bold text-xs py-1 px-3 rounded-full flex items-center justify-between gap-1'
        ]"
        @click="filters = query.filters">
          <FilledBookmarkIcon class="w-4" />
          {{ query.name }}
        </button>
      </div>
      <div class="md:flex md:space-x-2 items-center justify-between">
        <div class="grid lg:w-1/3 xl:w-1/4">
          <div class="flex items-center justify-between my-2">
            <small class="text-white text-xs font-bold">Find by type</small>
            <button class="hover:text-white text-stone-300 rounded-full" @click="filters.type = ''">
              <XCircleIcon class="w-5" />
            </button>
          </div>
          <select
          class="bg-transparent text-white focus:border-transparent focus:border-violet-300 focus:ring-0 border-stone-300 focus:bg-stone-700 transition-colors rounded-sm"
          v-model="filters.type"
          >
            <option v-for="type, i in typeOptions" :key="i" :value="type.value">{{ type.name }}</option>
          </select>
        </div>
        <div class="grid md:w-1/3 xl:w-1/4">
          <div class="flex items-center justify-between my-2">
            <label for="from-date" class="text-white text-xs font-bold">From date</label>
            <button class="hover:text-white text-stone-300 rounded-full" @click="filters.fromDate = ''">
              <XCircleIcon class="w-5" />
            </button>
          </div>
          <input
          id="from-date"
          class="bg-transparent text-white focus:border-transparent focus:border-violet-300 focus:ring-0 border-stone-300 focus:bg-stone-700 transition-colors rounded-sm"
          type="date"
          v-model="filters.fromDate"
          >
        </div>
        <div class="grid md:w-1/3 xl:w-1/4">
          <div class="flex items-center justify-between my-2">
            <label for="to-date" class="text-white text-xs font-bold">To date</label>
            <button class="hover:text-white text-stone-300 rounded-full" @click="filters.toDate = ''">
              <XCircleIcon class="w-5" />
            </button>
          </div>
          <input
          id="to-date"
          class="bg-transparent text-white focus:border-transparent focus:border-violet-300 focus:ring-0 border-stone-300 focus:bg-stone-700 transition-colors rounded-sm"
          type="date"
          v-model="filters.toDate"
          >
        </div>
      </div>
      <div class="md:flex items-center justify-between gap-1">
        <div class="grid md:w-1/3 xl:w-1/4">
          <div class="flex items-center justify-between my-2">
            <label for="to-date" class="text-white text-xs font-bold">Fund</label>
            <button class="hover:text-white text-stone-300 rounded-full" @click="filters.fundID = ''">
              <XCircleIcon class="w-5" />
            </button>
          </div>
          <select
          class="bg-transparent text-white focus:border-transparent focus:border-violet-300 focus:ring-0 border-stone-300 focus:bg-stone-700 transition-colors rounded-sm"
          v-model="filters.fundID"
          >
            <option v-for="fund in funds" :key="funds.id" :value="fund.id">{{ fund.name }}</option>
          </select>
        </div>
        <div class="grid lg:w-1/3 xl:w-1/4">
          <div class="flex items-center justify-between my-2">
            <small class="text-white text-xs font-bold">Find by tag</small>
            <button class="hover:text-white text-stone-300 rounded-full" @click="filters.tag = ''">
              <XCircleIcon class="w-5" />
            </button>
          </div>
        <select
        class="bg-transparent text-white focus:border-transparent focus:border-violet-300 focus:ring-0 border-stone-300 focus:bg-stone-700 transition-colors rounded-sm"
        v-model="filters.tag"
        >
        <option v-for="tag, i in tagOptions" :key="i">{{ tag }}</option>
      </select>
    </div>
    <div class="grid lg:w-1/3 xl:w-1/4">
      <small class="text-white text-xs font-bold my-2">Find by text in note</small>
      <input
      placeholder="Case insensitive"
      type="text"
      class="bg-transparent text-white border-transparent border-b-stone-300 focus:border-violet-300 focus:ring-0 focus:bg-stone-700 transition-colors rounded-sm"
      v-model="filters.note"
      >
    </div>
    </div>
    </form>
    <div class="flex items-end justify-between gap-1 mx-auto mt-6">
      <button
      class="rounded-sm gap-1 py-0.5 transition-colors flex items-center w-1/3 xl:w-1/4 justify-center bg-stone-200 hover:bg-stone-300 text-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600 dark:disabled:bg-stone-800 dark:text-white dark:disabled:text-stone-400 disabled:text-stone-400"
      type="button"
      :disabled="!filtersApplied"
      @click="clearFilters"
      >
        <ArrowUturnLeftIcon class="mb-1 w-4" />
        Clear filters
      </button>
      <button
      class="rounded-sm py-0.5 px-2 transition-colors font-bold flex w-1/3 xl:w-1/4 justify-center hover:bg-stone-600 border bg-stone-800 text-white"
      @click="submitQuery(filters)"
      >
        <span class="flex gap-1">
          <MagnifyingGlassIcon class="w-5" />
          Run Query
        </span>
      </button>
      <button
      class="rounded-sm gap-1 py-0.5 transition-colors flex items-center w-1/3 xl:w-1/4 justify-center bg-stone-200 hover:bg-stone-300 text-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600 dark:disabled:bg-stone-800 dark:text-white dark:disabled:text-stone-400 disabled:text-stone-400"
      type="button"
      :disabled="!filtersApplied"
      @click="updatePreferences(filters)"
      >
        <span v-if="queryIsSaved" class="flex gap-2">
          <FilledBookmarkIcon class="w-4 mb-0.5" />
          Saved
        </span>
        <span v-else class="flex gap-2">
          <BookmarkIcon class="w-4 mb-0.5" />
          Save Query
        </span>
      </button>
    </div>
    <Dialog :form-is-open="formIsOpen" @close-form="formIsOpen = false" title="Saving Query Config" :icon="CircleStackIcon">
    <div class="py-6 px-8">
      <form @submit.prevent="saveQuery({ filters, name: queryName })">
        <input
        type="text"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="Query Name"
        required
        :maxlength="20"
        v-model="queryName"
        >
        <button
        type="submit"
        class="flex justify-center items-center space-x-2 w-full my-2 py-1 outline-none font-bold rounded-sm text-white bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 dark:disabled:bg-stone-800 dark:disabled:text-stone-500 focus:outline-violet-500 outline-1"
        :disabled="queryName === ''"
        >
          Save
        </button>
      </form>
    </div>
  </Dialog>
  </div>
</template>

<script setup>
import Dialog from '../layout/Dialog.vue';
import { XCircleIcon, BookmarkIcon, MagnifyingGlassIcon, ArrowUturnLeftIcon, CalendarIcon, CalendarDaysIcon, ArchiveBoxIcon, CircleStackIcon } from '@heroicons/vue/24/outline';
import { BookmarkIcon as FilledBookmarkIcon } from '@heroicons/vue/24/solid';
import { useAccountStore } from '../../stores/accountStore';
import { useRecordStore } from '../../stores/recordStore';
import { storeToRefs } from "pinia";
import { ref, computed } from 'vue'

const accountStore = useAccountStore();
const recordStore = useRecordStore();

const emit = defineEmits(["runQuery"]);
const props = defineProps(["funds"]);

const { preferences } = storeToRefs(accountStore);
const { recordTags } = storeToRefs(recordStore);

let formIsOpen = ref(false);
const typeOptions = [
  { name: "Credit", value: 1 },
  { name: "Debit", value: 2 },
  { name: "Assignment", value: 0 },
];

const filters = ref({
  tag: "",
  note: "",
  fromDate: null,
  toDate: null,
  type: null,
  fundID: ""
});

const queryName = ref("");

const filtersApplied = computed(() => Object.entries(filters.value)
  .filter(item => item[1] !== "" && item[1] !== null)
  .length > 0
);

const queryIsSaved = computed(() => preferences.value.queries.some(query => JSON.stringify(query.filters).toLocaleLowerCase() === JSON.stringify(filters.value).toLocaleLowerCase()));
const tagOptions = computed(() => {
  const typeTags = (filters.value.type === null) ? Object.values(recordTags.value).flat() : recordTags.value[filters.value.type];
  return typeTags
});

const currentMonthRange = computed(() => {
  const yyyy = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(new Date())
  const MM = new Intl.DateTimeFormat("en-US", { month: "2-digit" }).format(new Date())
  const dd = "01";
  let nextMonth = MM === "12" ? "01" : Number(MM) + 1;
  if (typeof nextMonth !== "string") nextMonth = nextMonth < 10 ? "0" + nextMonth : nextMonth;
  const start = [yyyy, MM, dd].join("-");
  const end = [yyyy, nextMonth, dd].join("-");
  const filterApplied = (filters.value.fromDate === start && filters.value.toDate === end);
  return { start, end, filterApplied }
});

const currentYearRange = computed(() => {
  const yyyy = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(new Date())
  const start = [yyyy, "01", "01"].join("-");
  const end = [Number(yyyy) + 1, "01", "01"].join("-");
  const filterApplied = (filters.value.fromDate === start && filters.value.toDate === end);
  return { start, end, filterApplied }
});

function clearFilters() {
  filters.value = { tag: "", note: "", fromDate: null, toDate: null, type: null };
  submitQuery(filters.value);
}

function submitQuery(filters) {
  emit('runQuery', JSON.parse(JSON.stringify(filters)))
}

function filterByThisMonth() {
  filters.value.fromDate = currentMonthRange.value.start;
  filters.value.toDate = currentMonthRange.value.end;
}

function filterByThisYear() {
  filters.value.fromDate = currentYearRange.value.start;
  filters.value.toDate = currentYearRange.value.end;
}

function updatePreferences(updatingFilters) {
  if (queryIsSaved.value) removeFromPreferences(updatingFilters);
  else formIsOpen.value = true;
}

function saveQuery(query) {
  preferences.value.queries.push(query);
  accountStore.updateAccount({ OTP: null, updateEntries: { preferences: preferences.value } });
  formIsOpen.value = false;
}

function removeFromPreferences(filtersApplied) {
  const queryIndex = preferences.value.queries.findIndex(query => JSON.stringify(query.filters) === JSON.stringify(filtersApplied))
  if (queryIndex === -1) return;
  preferences.value.queries.splice(queryIndex, 1);
  accountStore.updateAccount({ OTP: null, updateEntries: { preferences: preferences.value } })
}

</script>
