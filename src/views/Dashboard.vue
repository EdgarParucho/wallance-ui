<template>
  <div class="pt-26 pb-8">
    <Logo class="mx-auto" size="lg" />
    <blockquote class="text-center mt-20 italic" cite="http://www.worldwildlife.org/who/index.html">
      Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver. - Ayn Rand
    </blockquote>

    <h2 class="text-4xl font-bold text-center mt-20">Balance</h2>
    <p class="text-center text-sm text-stone-500">Your overall balance on date.</p>
    <div class="mt-4 md:w-1/2 lg:w-1/3 xl:w-1/4 my-6 mx-auto px-16 py-6 rounded-xl dark:shadow-[#101010] shadow-lg bg-white dark:bg-stone-800">
      <ScaleIcon class="w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
      <div class="my-8 flex justify-center items-center">
        <h2 class="text-5xl text-center">
          {{ amountFormatted(balance) }}
        </h2>
      </div>
    </div>
    <p class="block text-center font-bold">
      <div class="flex items-center justify-center mx-auto my-20 space-x-2">
        <h3 class="font-bold text-2xl">
          Not<span class="text-violet-500"> updated</span>?
        </h3>
        <button
        class="font-bold py-1 px-2 gap-1 rounded-md w-40 inline-flex items-center justify-center text-white hover:bg-violet-500 bg-violet-600"
        @click="recordFormIsOpen = true"
        >
          <PlusIcon class="w-5" />
          Add Record
        </button>
      </div>
    </p>

    <Stats class="my-20" :records="records" />

    <div class="mt-20 mb-8 flex items-end justify-center space-x-2">
      <h4 class="text-3xl font-bold flex items-center gap-2">
        <ArchiveBoxIcon class="w-12 p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        Funds
      </h4>
      <p class="text-center text-sm text-stone-500">Current status.</p>
    </div>
    <div class="md:w-1/2 lg:w-1/3 xl:w-1/4 my-6 mx-auto px-16 py-6 rounded-xl dark:shadow-[#101010] shadow-lg bg-white dark:bg-stone-800">
      <div class="mt-4 font-sans rounded-md lg:block mx-auto">
        <div class="flex justify-between items-center" v-for="fund in funds" :key="fund.id">
          <p class="font-bold">{{ fund.name }}</p>
          <div class="justify-end flex items-baseline my-2 mr-3">
            <span class="text-2xl">{{ amountFormatted(fund.balance) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-end justify-center mx-auto my-20 space-x-2">
      <h3 class="font-bold text-2xl">
        <span class="text-violet-500">Move balance </span>between funds through
      </h3>
      <button
      class="text-white hover:bg-violet-500 bg-violet-600 font-bold py-1 px-2 gap-1 rounded-md w-40 inline-flex items-center justify-center"
      @click="assignmentFormIsOpen = true"
      >
        <ArrowsRightLeftIcon class="w-5" />
        Assignment
      </button>
    </div>

    <div class="mt-20 mb-8 flex items-end justify-center space-x-2">
      <h4 class="text-3xl font-bold flex items-center gap-2">
        <TagIcon class="w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        Tags
      </h4>
      <p class="text-center text-sm text-stone-500">Track your records.</p>
    </div>
    
    <div class="lg:w-1/3 mx-auto text-sm bg-white p-4 dark:bg-stone-800 shadow-lg rounded-md">
      <ol class="space-y-0.5">
        <h4 class="text-start text-lg font-bold my-6">
          Credits
        </h4>
        <div class="flex justify-between w-1/3">
          <small>Showing: {{ creditsByTag.data.length }} / {{ creditsByTag.totalTags }}</small>
          <small>
            <button
            class="text-stone-500 hover:text-black dark:hover:text-white hover:disabled:text-stone-500 dark:hover:disabled:text-stone-500"
            :disabled="creditsByTag.totalTags < 5"
            @click="showAllCreditTags = !showAllCreditTags"
            >
              Show {{ showAllCreditTags ? 'top 5' : 'All' }}
            </button>
          </small>
        </div>
        <li class="flex justify-between items-end space-x-2" v-for="creditTag, i in creditsByTag.data" :key="i">
          <span class="font-bold w-1/3">{{ creditTag.tag }}</span>
          <div class="flex items-center space-x-1 justify-between w-1/3">
            <PlusIcon class="flex text-green-50 bg-green-700 p-0.5 rounded-full h-4 w-4" />
            <span>{{ amountFormatted(creditTag.balance) }}</span>
          </div>
          <span class="w-1/3 text-end">{{ creditTag.percentage }}%</span>
        </li>
      </ol>

      <ol class="space-y-0.5">
        <h4 class="text-start text-lg font-bold my-6">
          Debits
        </h4>
        <div class="flex items-center justify-between w-1/3">
          <small>Showing: {{ debitsByTag.data.length }} / {{ debitsByTag.totalTags }}</small>
          <small>
            <button
            class="text-stone-500 hover:text-black dark:hover:text-white hover:disabled:text-stone-500 dark:hover:disabled:text-stone-500"
            :disabled="debitsByTag.totalTags < 5"
            @click="showAllDebitTags = !showAllDebitTags"
            >
              Show {{ showAllDebitTags ? 'top 5' : 'All' }}
            </button>
          </small>
        </div>
        <li class="flex justify-between items-end space-x-2" v-for="debitTag, i in debitsByTag.data" :key="i">
          <span class="font-bold w-1/3">{{ debitTag.tag }}</span>
          <div class="flex items-center space-x-1 justify-between w-1/3">
            <MinusIcon class="flex text-red-50 bg-red-700 p-0.5 rounded-full h-4 w-4" />
            <span>{{ amountFormatted(debitTag.balance) }}</span>
          </div>
          <span class="w-1/3 text-end">{{ debitTag.percentage }}%</span>
        </li>
      </ol>
    </div>

    <div class="mt-20 mb-8 flex items-end justify-center space-x-2">
      <h4 class="text-3xl font-bold flex items-center gap-2">
        <BookmarkIcon class="w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        Queries
      </h4>
      <p class="text-center text-sm text-stone-500">From your preferences to your dashboard.</p>
    </div>
    
    <div class="text-center space-y-3">
      <button
      v-for="query, i in preferences.queries" :key="i"
      :class="[
        { 'bg-violet-500 dark:bg-violet-500 text-white hover:bg-violet-500 dark:hover:bg-violet-500': queryIsApplied(query) },
        'font-bold text-xs py-1 px-3 rounded-full mx-1 shadow-stone-400 shadow-sm'
      ]"
      @click="appliedFilters = query.filters"
      >
        {{ query.name }}
      </button>
      <FundsRecords :funds="funds" :filtered-records="filteredRecords" />
    </div>
    
    <div class="md:flex items-center justify-around mt-20 mb-20">
      <span class="justify-center flex items-center space-x-2">
        To edit or create funds
        <router-link to="/funds" class="flex gap-1 mx-2 underline font-bold text-violet-500">
          <LinkIcon class="w-5" />
          Go to funds
        </router-link>
      </span>
      <span class="justify-center flex items-center space-x-2">
        Looking for a specific record?
        <router-link to="/records" class="flex gap-1 mx-2 underline font-bold text-violet-500">
          <LinkIcon class="w-5" />
          Go to records
        </router-link>
      </span>
    </div>
    <RecordForm
    v-if="recordFormIsOpen" :form-is-open="recordFormIsOpen" @close-form="recordFormIsOpen = false" :editing="false" />
    <AssignmentForm
    v-if="assignmentFormIsOpen" :form-is-open="assignmentFormIsOpen" @close-form="assignmentFormIsOpen = false" />
  </div>
</template>

<script setup>
import { computed, ref, defineAsyncComponent } from 'vue';
import { useFundStore } from '../stores/fundStore';
import { useRecordStore } from '../stores/recordStore';
import { useAccountStore } from '../stores/accountStore';
import { storeToRefs } from 'pinia';
import { MinusIcon, PlusIcon, ArrowsRightLeftIcon, LinkIcon, ArchiveBoxIcon, ScaleIcon, TagIcon } from '@heroicons/vue/24/outline';
import { BookmarkIcon } from '@heroicons/vue/24/solid';
import Logo from '../components/layout/Logo.vue';
import FundsRecords from '../components/record/FundsRecords.vue';
import Stats from '../components/dashboard/Stats.vue';

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));
const AssignmentForm = defineAsyncComponent(() => import('../components/record/AssignmentForm.vue'));

const fundStore = useFundStore();
const accountStore = useAccountStore();
const recordStore = useRecordStore();

const { funds } = storeToRefs(fundStore);
const { records } = storeToRefs(recordStore);
const { preferences } = storeToRefs(accountStore);
const recordFormIsOpen = ref(false);
const assignmentFormIsOpen = ref(false);

const showAllCreditTags = ref(false);
const showAllDebitTags = ref(false);
const appliedFilters = ref({
  tag: "",
  note: "",
  fromDate: null,
  toDate: null,
  type: null,
});

if (preferences.value.queries[0] !== undefined) appliedFilters.value = preferences.value.queries[0].filters;

const balance = computed(() => funds.value.reduce((totalBalance, { balance }) => totalBalance + Number(balance), 0));
const creditsBalance = computed(() => records.value
  .filter(record => record.type === 1)
  .reduce((totalCredits, { amount }) => totalCredits + Number(amount), 0)
);
const debitsBalance = computed(() => records.value
  .filter(record => record.type === 2)
  .reduce((totalCredits, { amount }) => totalCredits + Number(amount), 0)
);

const creditsByTag = computed(() => {
  const tagsRecords = [];
  const creditRecords = records.value.filter(record => record.type === 1);
  const creditTags = Array.from(new Set([...creditRecords.map(record => record.tag)]));
  creditTags.forEach(tag => {
    const balance = creditRecords
      .filter(record => record.tag === tag)
      .reduce((balance, { amount }) => balance + amount, 0)
      .toFixed();
    const percentage = (balance / creditsBalance.value * 100).toFixed();
    tagsRecords.push({ tag, balance, percentage });
  })
  tagsRecords.sort((a, b) => b.balance - a.balance);
  if (!showAllCreditTags.value && tagsRecords.length > 5) tagsRecords.slice(0, 5)
  return { data: tagsRecords, totalTags: creditTags.length };
});

const debitsByTag = computed(() => {
  let tagsRecords = [];
  const debitRecords = records.value.filter(record => record.type === 2);
  const debitTags = Array.from(new Set([...debitRecords.map(record => record.tag)]));
  debitTags.forEach(tag => {
    const balance = debitRecords
      .filter(record => record.tag === tag)
      .reduce((balance, { amount }) => balance + amount, 0)
      .toFixed();
    const percentage = (balance / debitsBalance.value * 100).toFixed();
    tagsRecords.push({ tag, balance, percentage });
  })
  tagsRecords.sort((a, b) => a.balance - b.balance);
  if (!showAllDebitTags.value && tagsRecords.length > 5) tagsRecords = tagsRecords.slice(0, 5)
  return { data: tagsRecords, totalTags: debitTags.length };
});

const filteredRecords = computed(() => {
  const activeFiltersKeys = Object.entries(appliedFilters.value)
  .filter(item => item[1] !== "" && item[1] !== null)
  .map(entry => entry[0]);
  if (activeFiltersKeys.length === 0 ) return records.value

  const resultingRecords = activeFiltersKeys.reduce((resultingArray, filterKey) => {
    const filterIsDate = (appliedFilters.value[filterKey] === "fromDate" || appliedFilters.value[filterKey] === "toDate");
    if (filterIsDate) appliedFilters.value[filterKey] = new Date(appliedFilters.value[filterKey]);
    const filterValue = appliedFilters.value[filterKey];
    if (filterKey === "fromDate") return resultingArray.filter(record => new Date(record.date) > new Date(appliedFilters.value[filterKey]))
    else if (filterKey === "toDate") return resultingArray.filter(record => new Date(record.date) < new Date(appliedFilters.value[filterKey]))
    else if (typeof filterValue === "string") return resultingArray.filter(record => record[filterKey]?.toLowerCase().includes(filterValue.toLowerCase()))
    else return resultingArray.filter(record => record[filterKey] === appliedFilters.value[filterKey])
  }, JSON.parse(JSON.stringify(records.value)));
  
  resultingRecords.forEach(r => r.date = new Date(r.date))
  return resultingRecords;
});

function amountFormatted(amount) {
  const integer = Math.floor(amount);
  const fractions = amount
    .toString()
    .split('.')[1] || "0";
  const recomposed = [integer, fractions.slice(0, 2)].join(".")
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(recomposed)
}

function queryIsApplied({ filters, name }) {
  return JSON.stringify(filters) === JSON.stringify(appliedFilters.value)
}

function clearFilters() {
  appliedFilters.value = { tag: "", note: "", fromDate: null, toDate: null, type: null, name: "" };
}

</script>
