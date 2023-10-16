<template>
  <div class="py-26 pb-8">
    <Logo class="mx-auto" size="lg" />
    <blockquote class="text-center mt-20 italic" cite="http://www.worldwildlife.org/who/index.html">
      Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver. - Ayn Rand
    </blockquote>

    <FirstSteps v-if="gettingStarted" @follow-step="step => followStep(step)" />

    <section class="my-20">
      <h2 class="text-4xl font-bold text-center mt-20">Balance</h2>
      <h4 class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">Your overall balance on date.</h4>
      <Balance :balance="balance" />
    </section>
    <div class="flex items-end justify-center mx-auto my-20 space-x-2">
      <h3 class="font-bold text-2xl">
        Not<span class="text-violet-500"> updated</span>?
      </h3>
      <button
      class="text-white hover:bg-violet-500 bg-violet-600 font-bold py-1 px-2 rounded-md w-36 inline-flex items-center"
      @click="newRecord"
      >
        <PlusIcon class="w-5 text-left" />
        <span class="mx-auto">Add Record</span>
      </button>
    </div>

    <section class="my-28">
      <h2 class="text-4xl font-bold text-center mt-20">Let's check some stats</h2>
      <h4 class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">Numbers from this year.</h4>
      <Stats class="mt-4" :records="records" />
    </section>

    <section class="my-28">
      <ArchiveBoxIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
      <h2 class="text-4xl font-bold text-center">Funds status</h2>
      <h3 class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">This is how you group your assets.</h3>
      <FundsBalances :funds="funds" />
    </section>

    <div v-if="funds.length < 2" class="flex items-end justify-center mx-auto mb-20 space-x-2">
      <h3 class="font-bold text-2xl">
        Grouping into funds can<span class="text-violet-500"> illuminate </span>your management.
      </h3>
      <a
      class="text-white hover:bg-violet-500 bg-violet-600 font-bold py-1 px-2 gap-1 rounded-md w-36 inline-flex items-center justify-center"
      href="/funds"
      >
        <LinkIcon class="w-5 text-left" />
        <span class="mx-auto">Learn</span>
      </a>
    </div>

    <div v-else class="flex items-end justify-center mx-auto mb-20 space-x-2">
      <h3 class="font-bold text-2xl">
        <span class="text-violet-500">Move balance </span>between funds through
      </h3>
      <button
      class="text-white hover:bg-violet-500 bg-violet-600 font-bold py-1 px-2 gap-1 rounded-md w-36 inline-flex items-center justify-center"
      @click="assignmentFormIsOpen = true"
      >
        <ArrowsRightLeftIcon class="w-5 text-left" />
        <span class="mx-auto">Assignment</span>
      </button>
    </div>

    <section class="my-28">
      <TagIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
      <h2 class="text-4xl font-bold text-center">Tags usage</h2>
      <h3 class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">Track your records.</h3>

      <div v-if="creditsByTag.totalTags < 1 && debitsByTag.totalTags < 1" class="text-center my-20">
        <h3 class="font-bold text-2xl mb-4">
          You may want to<span class="text-violet-500"> start using Tags </span>
        </h3>
        <p>This feature is intended to mark recurrent records, so you can measure, track and find them easier.</p>
        <p><span class="font-bold">Check the following examples </span>to take advantage of Tags.</p>
        <div class="mt-10 2xl:flex 2xl:items-start 2xl:justify-around">
          <TopTags
          :tags="{
            data: [
              { name: 'Salary', balance: 700, percentage: 58 },
              { name: 'Bonifications', balance: 500, percentage: 42 },
            ],
            totalTags: 2
          }"
          title="Credits"
          :show-all-tags="false"
          :icon="PlusIcon"/>
          <TopTags
          :tags="{
            data: [
              { name: 'Rent', balance: 300, percentage: 53 },
              { name: 'Car repairs', balance: 150, percentage: 26 },
              { name: 'School', balance: 120, percentage: 21 },
            ],
            totalTags: 3
          }"
          title="Debits"
          :show-all-tags="false"
          :icon="MinusIcon" />
        </div>
      </div>

      <div v-else class="2xl:flex 2xl:items-start 2xl:justify-around">
        <TopTags
        :tags="creditsByTag"
        title="Credits"
        :show-all-tags="showAllCreditTags"
        @alternate-limit="showAllCreditTags = !showAllCreditTags"
        :icon="PlusIcon" />
        <TopTags
        :tags="debitsByTag"
        title="Debits"
        :show-all-tags="showAllDebitTags"
        @alternate-limit="showAllDebitTags = !showAllDebitTags"
        :icon="MinusIcon" />
      </div>
    </section>

    <section class="my-28">

      <BookmarkIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
      <h2 class="text-4xl font-bold text-center">Saved Queries</h2>
      <h3 class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">From your preferences to your dashboard.</h3>

      <div v-if="preferences.queries.length > 0">
        <div class="text-center my-4">
          <button
          v-for="query, i in preferences.queries" :key="i"
          :class="[
            { 'bg-violet-500 dark:bg-violet-500 text-white hover:bg-violet-500 dark:hover:bg-violet-500': queryIsApplied(query) },
            'font-bold text-xs py-1 px-3 rounded-full mx-1 shadow-stone-600 shadow-sm'
          ]"
          @click="appliedFilters = query.filters"
          >
            {{ query.name }}
          </button>
        </div>
        <FundsRecords :funds="funds" :filtered-records="filteredRecords" />
      </div>

      <div v-else class="text-center my-20">
        <h3 class="font-bold text-2xl mb-4">Did you know you can<span class="text-violet-500"> save queries</span>?</h3>
        <p>Just go to Records, set the parameters in the query panel, and name it.</p>
        <p>
          Mix the properties as needed:
          <span class="italic">Credits this year</span>, <span class="italic">Records tagged with &quot;bills&quot; and the word &quot;cash&quot; within the note.</span>
        </p>
        <p>Plus, the overall results will be here in your dashboard.</p>
      </div>

    </section>

    <section class="my-28">

      <ClipboardDocumentListIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
      <h2 class="text-4xl font-bold text-center">Templates</h2>
      <h3 class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">Simplify. Time is priceless.</h3>

      <div v-if="preferences.templates.length > 0">
        <Templates @use-template="(template) => useTemplate(template)" :templates="preferences.templates" />
      </div>

      <div v-else class="text-center mb-20">
        <h3 class="font-bold text-2xl mb-4">For your frequent records.</h3>
        <p>At the bottom of the record form you'll find a field to name it. Write, save, then find it here to reuse.</p>
      </div>

    </section>

    <div class="grid gap-2 sm:flex items-center justify-around my-28">

      <div class="h-56 w-72 bg-white dark:bg-stone-800 p-4 rounded-md shadow-md text-center">
        <ArchiveBoxIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        <p class="my-8">To manage your funds</p>
        <router-link to="/funds" class="justify-center flex gap-2 underline font-bold text-violet-500 hover:bg-violet-900 hover:bg-opacity-20 transition-colors">
          <LinkIcon class="w-5" />
          Go to funds
        </router-link>
      </div>

      <div class="h-56 w-72 bg-white dark:bg-stone-800 p-4 rounded-md shadow-md text-center">
        <CircleStackIcon class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        <p class="my-8">For records details and queries</p>
        <router-link to="/records" class="justify-center flex gap-2 underline font-bold text-violet-500 hover:bg-violet-900 hover:bg-opacity-20 transition-colors">
          <LinkIcon class="w-5" />
          Go to records
        </router-link>
      </div>

    </div>
    <RecordForm
    v-if="recordFormIsOpen"
    :form-is-open="recordFormIsOpen" @close-form="closeForm" :editing="false" :preset-data="presetData" :following-step="followingStep" />
    <AssignmentForm v-if="assignmentFormIsOpen" :form-is-open="assignmentFormIsOpen" @close-form="closeForm" :preset-data="presetData" />
  </div>
</template>

<script setup>
import { computed, ref, defineAsyncComponent } from 'vue';
import { useFundStore } from '../stores/fundStore';
import { useRecordStore } from '../stores/recordStore';
import { useAccountStore } from '../stores/accountStore';
import { storeToRefs } from 'pinia';
import { CircleStackIcon, BookmarkIcon, MinusIcon, PlusIcon, ArrowsRightLeftIcon, LinkIcon, TagIcon, ArchiveBoxIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/solid';
import Logo from '../components/layout/Logo.vue';
import FundsRecords from '../components/record/FundsRecords.vue';
import Templates from '../components/dashboard/Templates.vue';
import Stats from '../components/dashboard/Stats.vue';
import Balance from '../components/dashboard/Balance.vue';
import FundsBalances from '../components/dashboard/FundsBalances.vue';
import TopTags from '../components/dashboard/TopTags.vue';
import FirstSteps from '../components/dashboard/FirstSteps.vue'

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

let presetData = null;
let followingStep = null;

if (preferences.value.queries[0] !== undefined) appliedFilters.value = preferences.value.queries[0].filters;

const balance = computed(() => {
  const total = funds.value.reduce((totalBalance, { balance }) => totalBalance + Number(balance), 0);
  return amountFormatted(total)
});
const creditsBalance = computed(() => records.value
  .filter(record => record.type === 1)
  .reduce((totalCredits, { amount }) => totalCredits + Number(amount), 0)
);
const debitsBalance = computed(() => records.value
  .filter(record => record.type === 2)
  .reduce((totalCredits, { amount }) => totalCredits + Number(amount), 0)
);

const gettingStarted = computed(() => preferences.value.FirstStepsStatus === undefined || preferences.value.FirstStepsStatus?.some(step => step === "Active"))
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
    tagsRecords.push({ name: tag, balance, percentage });
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
    tagsRecords.push({ name: tag, balance, percentage });
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

function newRecord() {
  presetData = undefined;
  recordFormIsOpen.value = true
}

function closeForm() {
  presetData = undefined;
  recordFormIsOpen.value = false;
  assignmentFormIsOpen.value = false;
}

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

function queryIsApplied({ filters }) {
  return JSON.stringify(filters) === JSON.stringify(appliedFilters.value)
}

function followStep({ id, preset }) {
  followingStep = id;
  presetData = preset;
  recordFormIsOpen.value = true;
}

function useTemplate({ fields }) {
  presetData = fields;
  if (fields.type !== 0) recordFormIsOpen.value = true;
  else assignmentFormIsOpen.value = true;
}

</script>
