<script setup>
import { TagIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useRecordStore } from '../../stores/recordStore';
import { computed, ref } from 'vue';

const props = defineProps({
  type: {
    type: Number,
    default: 2
  },
  showAllTags: {
    type: Boolean,
    default: false
  },
  records: {
    type: Array,
    required: true,
  }
});

const recordStore = useRecordStore();
const { requestingRecords } = storeToRefs(recordStore);

const showingAll = ref(false);
const icon = computed(() => props.type === 1 ? PlusIcon : MinusIcon);
const title = computed(() => props.type === 1 ? 'Credits' : 'Debits');

const typeRecords = computed(() => props.records.filter(record => record.type === props.type));

const typeBalance = computed(() => typeRecords.value
  .reduce((balance, { amount }) => balance + amount, 0)
);

const tagsSortedByBalance = computed(() => {
  const tagsInfo = [];

  for (const tag of uniqueTags.value) {
    const tagInfo = { name: tag, balance: 0, percentage: 0 };
    tagInfo.balance = typeRecords.value
      .filter(record => record.tag === tag)
      .reduce((balance, { amount }) => balance + amount, 0)
      .toFixed();
    tagInfo.percentage = (tagInfo.balance / typeBalance.value * 100).toFixed();
    tagsInfo.push(tagInfo);
  }
  tagsInfo.sort((t1, t2) => t1.balance - t2.balance);
  return tagsInfo;
});

const topTags = computed(() => {
  const limit = showingAll ? tagsSortedByBalance.length : 5;
  const limitedTags = tagsSortedByBalance.value.slice(0, limit);
  return limitedTags;
});

const uniqueTags = computed(() => {
  const recordsTags = typeRecords.value.map(record => record.tag);
  const uniqueTags = Array.from(new Set([...recordsTags]));
  return uniqueTags;
})

function getAmountFormatted(amount) {
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

</script>

<template>
  <dl>

    <div class="flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <component
        :class="[props.type === 1 ? 'text-green-500 bg-green-600' : 'text-red-500 bg-red-600', ' bg-opacity-20 flex p-0.5 rounded-full h-5 w-5']"
        :is="icon"></component>
        <h4 class="text-center text-xl font-bold">{{ title }}</h4>
      </div>
      <span class="text-sm">Total: {{ tagsSortedByBalance.length }}</span>
      <label
        for="toggleFour"
        class="flex items-center cursor-pointer select-none text-dark dark:text-white text-sm"
        >
        <div class="relative">
          <input
            type="checkbox"
            id="toggleFour"
            class="peer sr-only"
            />
          <div
            class="block h-8 rounded-full box bg-dark dark:bg-dark-2 w-14 peer-checked:bg-primary"
            ></div>
          <div
            class="absolute flex items-center justify-center w-6 h-6 transition bg-violet-500 rounded-full dot left-1 top-1 dark:bg-dark-5 peer-checked:translate-x-full peer-checked:dark:bg-white"
            :class="{ 'bg-stone-300': showAllTags }"
          ></div>
        </div>
        Show All
      </label>
      <!-- <small>
        <input
        type=""
        :disabled="uniqueTags <= 5"
        v-model="showingAll"
        >
          Show All
      </small> -->
    </div>
    <div v-for="tag, i in topTags" :key="i" class="my-1 rounded-md shadow-md bg-white dark:bg-stone-800 flex justify-between items-center">
      <dt class="flex items-center gap-4 p-3">
        <TagIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />

        <div v-if="requestingRecords" class="w-44 h-8 p-4 rounded-sm bg-stone-300 animate-pulse" />
        <span v-else>{{ tag.name }}</span>

      </dt>
      <dd class="justify-end flex items-baseline my-2 mr-3">
        <div v-if="requestingRecords" class="w-20 h-8 p-4 rounded-sm bg-stone-300 animate-pulse" />
        <span v-else class="text-stone-500 dark:text-stone-300">{{ getAmountFormatted(tag.balance) }}</span>
        <div v-if="requestingRecords" class="mx-2 w-10 h-8 p-4 rounded-sm bg-stone-300 animate-pulse" />
        <strong v-else class="bg-stone-100 dark:bg-stone-900 rounded-sm px-2 w-16 text-center mx-4">{{ tag.percentage }}%</strong>
      </dd>
    </div>
  </dl>
</template>