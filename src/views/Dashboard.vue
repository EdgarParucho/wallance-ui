<template>
  <div class="py-26 pb-8">
    <Logo class="mx-auto" size="lg" />

    <FirstSteps v-if="firstStepsVisible" @follow-step="step => useFirstSteps(step)" />

    <section class="mt-20">
      <h2 class="text-4xl font-bold text-center mt-20">Balance</h2>
      <p class="text-center text-lg text-stone-500 dark:text-stone-400 mb-6">Overall result of your management</p>
      <div class="mt-4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-16 mx-auto rounded-xl text-center shadow-md bg-white dark:bg-stone-800">
        <h2 class="text-5xl">{{ balance }}</h2>
      </div>
      <FundsList class="md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto" />
    </section>

    <div class="flex items-end justify-center mx-auto my-20 space-x-2">
      <h3 class="font-bold text-2xl">Not updated?</h3>
      <button class="text-white hover:bg-violet-600 bg-violet-500 font-bold py-1 px-2 rounded-md w-36 inline-flex items-center" @click="recordFormIsOpen = true">
        <PlusIcon class="w-5 text-left" />
        <span class="mx-auto">Add Record</span>
      </button>
    </div>

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

    <section v-if="preferences.templates.length > 0" class="my-20 lg:flex lg:items-center dark:shadow-black shadow-md rounded-sm py-24 px-4">
      <div class="text-center lg:text-left mx-auto lg:w-1/3 lg:ml-20 mb-10">
        <div class="text-center lg:text-left items-start justify-center lg:justify-between gap-2">
          <DocumentDuplicateIcon class="mx-auto lg:mx-0 my-4 w-12 p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          <div>
            <h2 class="text-4xl font-bold">Templates</h2>
            <p class="text-lg text-stone-500 dark:text-stone-400 mb-6">Simplify. Time is priceless.</p>
          </div>
        </div>
        <p>Find here a shortcut to add frequent records.</p>
      </div>

      <div class="lg:w-2/3">
        <Templates @use-template="(template) => useTemplate(template)" :templates="preferences.templates" />
      </div>
    </section>

    <div class="grid gap-2 sm:flex items-center justify-around my-28">

      <div
      v-for="link, i in links"
      :key="i"
      class="h-56 w-72 bg-white dark:bg-stone-800 p-4 rounded-md shadow-md text-center"
      >
        <component :is="link.icon" class="my-4 w-12 mx-auto p-2.5 rounded-full shadow-lg text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        <p class="my-8">{{ link.hint }}</p>
        <router-link :to="link.path" class="justify-center flex gap-2 underline font-bold text-violet-500 hover:bg-violet-900 hover:bg-opacity-20 transition-colors" @click.native="scrollToTop">
          <LinkIcon class="w-5" />
          {{ link.text }}
        </router-link>
      </div>
    </div>
    <RecordForm
    v-if="recordFormIsOpen"
    @close-form="resetRecordForm"
    :meta="recordFormOptions.meta"
    :form-is-open="recordFormIsOpen"
    :preset="recordFormOptions.preset"
    />

  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref, defineAsyncComponent } from 'vue';
import { CircleStackIcon, PlusIcon, LinkIcon, ArchiveBoxIcon, DocumentDuplicateIcon } from '@heroicons/vue/24/solid';
import Logo from '../components/layout/Logo.vue';
import Templates from '../components/dashboard/Templates.vue';
import FundsList from '../components/fund/FundsList.vue';
import { useFundStore } from '../stores/fundStore';
import { useUserStore } from '../stores/userStore';

const FirstSteps = defineAsyncComponent(() => import('../components/dashboard/FirstSteps.vue'));
const RecordForm = defineAsyncComponent(() => import('../components/record/RecordForm.vue'));

const fundStore = useFundStore();
const userStore = useUserStore();

const { funds } = storeToRefs(fundStore);
const { preferences } = storeToRefs(userStore);
const recordFormIsOpen = ref(false);

let recordFormOptions = {
  meta: {},
  preset: null,
}

const links = [
  {
    path: '/funds',
    hint: 'To manage your funds',
    text: 'Go to funds',
    icon: ArchiveBoxIcon,
  },
  {
    path: '/records',
    hint: 'For queries stats',
    text: 'Go to records',
    icon: CircleStackIcon,
  }
];

const balance = computed(() => {
  const total = funds.value.reduce((totalBalance, { balance }) => totalBalance + Number(balance), 0);
  return amountFormatted(total)
});
const firstStepsVisible = computed(() => preferences.value.FirstStepsStatus.some(step => step === "Active"));

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

function useFirstSteps(step) {
  recordFormOptions = {
    meta: {
      firstSteps: true,
      stepIndex: step.id,
    },
    preset: step.template,
  };
  recordFormIsOpen.value = true;
}

function useTemplate({ fields }) {
  recordFormOptions = {
    meta: {},
    preset: fields,
  };
  recordFormIsOpen.value = true;
}

function resetRecordForm() {
  recordFormOptions = {
    meta: {},
    preset: null,
  };
  recordFormIsOpen.value = false;
}

function scrollToTop() {
  setTimeout(() => {
    window.scrollTo(0,0);
  }, 250)
}

</script>
