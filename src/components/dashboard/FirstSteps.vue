<template>
  <div class="my-20">

    <h1 class="font-bold text-4xl text-center">
      You need a<span class="text-violet-500"> starting point </span>
    </h1>

    <p class="text-center text-xl my-4">
      If you have some savings, there are a few key data that will help you a lot to start.
    </p>
    
    <p class="text-center text-xl">
      Let the following first steps guide you to save that data into records.
    </p>

    <div class="md:flex justify-center mx-auto my-16 grid gap-2">
      <div
      v-for="step, i in steps" :key="step.id"
      class="bg-white dark:bg-stone-800 shadow-md p-4 grid items-center mx-auto rounded-md w-11/12 lg:w-4/12 2xl:w-3/12 h-56"
      v-show="!StepIsHidden(step.id)"
      >
        <h4 class="mx-auto text-lg font-bold">{{ step.name }}</h4>
        <p class="text-center">
          {{ step.description }}
        </p>
        <div v-if="StepIsCompleted(step.id)">
          <div
          class="w-44 mx-auto text-center rounded-sm bg-violet-600 text-white"
          >
            <CheckIcon class="w-6 mx-auto" />
        </div>
        </div>
        <div class="grid space-y-4" v-else>
          <button
          class="w-44 mx-auto rounded-sm ring-1 ring-violet-600 text-violet-600 dark:text-violet-400 hover:bg-violet-900 hover:bg-opacity-20"
          @click="$emit('followStep', step)"
          >
            Set {{ step.name }}
          </button>
          <button
          class="w-44 mx-auto text-sm rounded-sm text-stone-500 dark:text-stone-200  hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          @click="dontShowAgain(step.id, 'Hidden')"
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>

    <div class="lg:flex justify-around">
      <div class="lg:w-1/3 my-10">
        <h3 class="text-center text-2xl my-4 font-bold">How is that going to help?</h3>
        <p class="text-justify text-xl my-4">
          By defining this, you will set not only your current balance, but the big picture of your movements (income-expenses) so far.
        </p>
      </div>

      <div class="lg:w-1/3 my-10">
        <h3 class="text-center text-2xl my-4 font-bold">If you don't have that data</h3>
        <p class="text-justify text-xl my-4">
          You can skip one, two or all three steps, the goal is to set your current balance with the most accuraccy possible.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { storeToRefs } from 'pinia';
import { CheckIcon } from '@heroicons/vue/24/solid';
import { useFundStore } from '../../stores/fundStore';
import { useUserStore } from '../../stores/userStore';

const emit = defineEmits(['followStep']);
const showToast = inject("showToast");

const fundStore = useFundStore();
const userStore = useUserStore();
const { defaultFund } = storeToRefs(fundStore);
const { preferences } = storeToRefs(userStore);

const lastYearLastDay = () => {
  const yyyy = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(new Date()) - 1;
  const lastDay = [yyyy, "12", "31"].join("-");
  return lastDay
};

const currentDate = computed(() => new Intl.DateTimeFormat("en-UK").format(new Date()).split("/").reverse().join("-"));
const dateFormatted = (date, time) => `${date}T${time}:01`;

const steps = ref([
  {
    id: 0,
    name: "Starting Balance",
    description: "If you started the year with a positive balance accumulated.",
    status: "Active",
    template: {
      amount: 1,
      date: dateFormatted(lastYearLastDay(), "23:59"),
      note: "Starting data: Balance accumulated from past dates.",
      tag: "Starting Balance",
      fundID: defaultFund.value.id,
      type: 1,
    }
  },
  {
    id: 1,
    name: "Revenue",
    description: "Record the sum of the income you earned this year.",
    status: "Active",
    template: {
      amount: 1,
      date: dateFormatted(currentDate.value, "00:01"),
      note: "Starting data: Total Revenue.",
      tag: "Accumulated income",
      fundID: defaultFund.value.id,
      type: 1,
    }
  },
  {
    id: 2,
    name: "Expenditures",
    description: "Save the sum of your expenses this year.",
    status: "Active",
    template: {
      amount: -1,
      date: dateFormatted(currentDate.value, "00:02"),
      note: "Starting data: Total Expenditures.",
      tag: "Accumulated expenses",
      fundID: defaultFund.value.id,
      type: 2,
    }
  }
]);

steps.value.forEach(step => step.status = preferences.value.FirstStepsStatus[step.id]);

function StepIsHidden(stepID) {
  return preferences.value.FirstStepsStatus[stepID] === 'Hidden';
}

function StepIsCompleted(stepID) {
  return preferences.value.FirstStepsStatus[stepID] === 'Completed';
}

async function dontShowAgain(stepNumber, stepStatus) {
  const payload = JSON.parse(JSON.stringify(preferences.value));
  payload.FirstStepsStatus[stepNumber] = stepStatus;
  userStore.updateUser({ OTP: null, updateEntries: { preferences: payload} })
    .then(({ message }) => {
      preferences.value = payload
      showToast(message);
    })
    .catch((error) => console.error(error))
}

</script>
