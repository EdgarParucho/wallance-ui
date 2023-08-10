<template>
  <div class="pt-26 pb-8">
    <Logo class="mx-auto" size="lg" />
    <blockquote class="text-white text-center mt-16 italic" cite="http://www.worldwildlife.org/who/index.html">
      Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver. - Ayn Rand
    </blockquote>

    <h2 class="text-4xl font-bold text-center mt-16 mb-4 text-white">My Balance</h2>
    <div class="space-x-1 text-white">
      <div class="flex items-center">
        <div class="md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto px-16 py-6 rounded-md bg-stone-800">
          <Logo size="md" />
          <div class="my-4 flex justify-center items-center">
            <h2 class="text-5xl text-center">
              {{ amountFormatted(balance) }}
            </h2>
          </div>
        </div>
      </div>
      <p class="block text-center mt-3 mb-6 text-white">
        You current balance represents the
        <span class="text-black bg-white py-1 px-1.5 rounded-md font-bold">{{ savingsIndex }}%</span>
        of your total income.
      </p>

    </div>

    <div class=" flex items-center justify-center mx-auto my-16 space-x-2">
      <h3 class="font-bold text-white text-2xl">
        To<span class="text-yellow-300"> update </span>your balance
      </h3>
      <button
      class="text-black hover:bg-yellow-300 bg-yellow-400 font-bold py-1 px-2 rounded-md w-36 inline-flex items-center justify-between"
      @click="recordFormIsOpen = true">
        <PlusIcon class="w-5" />
        Add a Record
      </button>
    </div>
    
    <div class="md:w-6/12 lg:w-4/12 xl:w-3/12 mx-auto px-6 rounded-md py-4 my-16 shadow-black transition-shadow bg-stone-800 justify-center">
      <ArchiveBoxIcon class="w-12 text-white mx-auto bg-stone-900 p-2.5 rounded-full" />
      <h4 class="text-2xl font-bold text-center mt-4 text-white">
        Funds Status
      </h4>
      <div class="mt-4 bg-stone-800 text-white font-sans rounded-md lg:block mx-auto">
        <div class="flex justify-between items-center" v-for="fund in funds" :key="fund.id">
          <p class="text-white font-bold">{{ fund.name }}</p>
          <div class="justify-end flex items-baseline my-2 mr-3">
            <span class="text-2xl">{{ amountFormatted(fund.balance) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class=" flex items-center justify-center mx-auto mt-10 space-x-2">
      <h3 class="font-bold text-white text-2xl">
        Do you want to<span class="text-yellow-300"> move balance </span>between funds?
      </h3>
      <button
      class="text-black hover:bg-yellow-300 bg-yellow-400 font-bold py-1 px-2 rounded-md w-24 inline-flex items-center justify-between"
      @click="assignmentFormIsOpen = true">
        <ArrowsRightLeftIcon class="w-5" />
        Assign
      </button>
    </div>

    <h4 class="text-2xl font-bold text-center mt-16 mb-4 text-white">
      My top tags on Records
    </h4>

    <ol class="text-white lg:w-1/3 mx-auto space-y-0.5 text-sm">
      <h4 class="text-start text-lg font-bold my-6 text-white">
        Credits
      </h4>
      <div class="flex justify-between w-1/3">
        <small>Showing: {{ creditsByTag.data.length }} / {{ creditsByTag.totalTags }}</small>
        <small>
          <button
          class="py-0.5 px-1 rounded-md text-stone-300  hover:text-white disabled:text-stone-500"
          :disabled="creditsByTag.totalTags < 5"
          @click="showAllCreditTags = !showAllCreditTags"
          >
            Show {{ showAllCreditTags ? 'top 5' : 'All' }}
          </button>
        </small>
      </div>
      <li class="flex justify-between items-end space-x-2" v-for="creditTag, i in creditsByTag.data" :key="i">
        <span class="bg-stone-700 px-2 py-0.5 rounded-sm font-bold w-1/3">{{ creditTag.tag }}</span>
        <div class="flex items-center space-x-1 justify-between w-1/3">
          <PlusIcon class="flex text-green-400 bg-green-900 p-0.5 rounded-full h-4 w-4" />
          <span>{{ amountFormatted(creditTag.balance) }}</span>
        </div>
        <span class="w-1/3 text-end">{{ creditTag.percentage }}%</span>
      </li>
    </ol>

    <ol class="text-white lg:w-1/3 mx-auto space-y-0.5 text-sm">
      <h4 class="text-start text-lg font-bold my-6 text-white">
        Debits
      </h4>
      <div class="flex items-center justify-between w-1/3">
        <small>Showing: {{ debitsByTag.data.length }} / {{ debitsByTag.totalTags }}</small>
        <small>
          <button
          class="py-0.5 px-1 rounded-md text-stone-300  hover:text-white disabled:text-stone-500"
          :disabled="debitsByTag.totalTags < 5"
          @click="showAllDebitTags = !showAllDebitTags"
          >
            Show {{ showAllDebitTags ? 'top 5' : 'All' }}
          </button>
        </small>
      </div>
      <li class="flex justify-between items-end space-x-2" v-for="debitTag, i in debitsByTag.data" :key="i">
        <span class="bg-stone-700 px-2 py-0.5 rounded-sm font-bold w-1/3">{{ debitTag.tag }}</span>
        <div class="flex items-center space-x-1 justify-between w-1/3">
          <MinusIcon class="flex text-red-400 bg-red-900 p-0.5 rounded-full h-4 w-4" />
          <span>{{ amountFormatted(debitTag.balance) }}</span>
        </div>
        <span class="w-1/3 text-end">{{ debitTag.percentage }}%</span>
      </li>
    </ol>
    <div class="mt-28 md:flex items-center justify-around">
      <span class="text-white justify-center flex items-center space-x-2">
        To edit or create funds
        <router-link to="/funds" class="flex gap-1 mx-2 underline text-white font-bold">
          <LinkIcon class="w-5" />
          Go to funds
        </router-link>
      </span>
      <span class="text-white justify-center flex items-center space-x-2">
        Looking for a specific record?
        <router-link to="/records" class="flex gap-1 mx-2 underline text-white font-bold">
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
import Logo from '../components/layout/Logo.vue';
import { useFundStore } from '../stores/fundStore';
import { useRecordStore } from '../stores/recordStore';
import { storeToRefs } from 'pinia';
import { MinusIcon, PlusIcon, ArrowsRightLeftIcon, LinkIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline';

const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));
const AssignmentForm = defineAsyncComponent(() => import('../components/record/AssignmentForm.vue'));
const recordFormIsOpen = ref(false);
const assignmentFormIsOpen = ref(false);
const fundStore = useFundStore();
const recordStore = useRecordStore();
const { funds } = storeToRefs(fundStore);
const { records } = storeToRefs(recordStore);

const showAllCreditTags = ref(false);
const showAllDebitTags = ref(false);

const balance = computed(() => funds.value.reduce((totalBalance, { balance }) => totalBalance + Number(balance), 0));
const creditsBalance = computed(() => records.value
  .filter(record => record.type === 1)
  .reduce((totalCredits, { amount }) => totalCredits + Number(amount), 0)
);
const debitsBalance = computed(() => records.value
  .filter(record => record.type === 2)
  .reduce((totalCredits, { amount }) => totalCredits + Number(amount), 0)
);

const savingsIndex = computed(() => ((balance.value / creditsBalance.value) * 100 ).toFixed());

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

function amountFormatted(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount)
}

</script>