<template>
  <div>
    <dl>
      <div class="flex items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <component
          :class="[iconStyles, ' bg-opacity-20 flex p-0.5 rounded-full h-5 w-5']"
          :is="icon"></component>
          <select class="font-bold flex my-4 mx-auto text-lg border-none bg-transparent shadow-md rounded-full focus:ring-violet-500 focus:outline-none" v-model="type">
            <option class="bg-stone-700 text-white" :value="2">Debits</option>
            <option class="bg-stone-700 text-white" :value="1">Credits</option>
            <option class="bg-stone-700 text-white" :value="0">Assignments</option>
          </select>
        </div>
        <span class="text-sm">Total: {{ tagsData.length }}</span>
      </div>
      <div v-for="tag, i in tagsData" :key="i" class="my-1 rounded-md shadow-md bg-white dark:bg-stone-800 flex justify-between items-center">
        <dt class="flex items-center gap-4 p-3">
          <TagIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
          <span>{{ tag.name }}</span>
        </dt>
        <dd class="justify-end flex items-baseline my-2 mr-3">
          <span class="text-stone-500 dark:text-stone-300">{{ getAmountFormatted(tag.balance) }}</span>
          <strong class="bg-stone-100 dark:bg-stone-900 rounded-sm px-2 w-16 text-center mx-4">{{ tag.percentage }}%</strong>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { TagIcon, PlusIcon, MinusIcon, ArrowsRightLeftIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';

const props = defineProps({
  records: {
    type: Array,
    required: true,
  }
});

const type = ref(2);

const icon = computed(() => {
  if (type.value === 2) return MinusIcon
  else if (type.value === 1) return PlusIcon
  else return ArrowsRightLeftIcon
});


const iconStyles = computed(() => {
  if (type.value === 2) return 'text-red-500 bg-red-600'
  else if (type.value === 1) return 'text-green-500 bg-green-600'
  else return 'text-stone-500 bg-stone-600'
});
const typeRecords = computed(() => props.records.filter(record => record.type === type.value));

const typeBalance = computed(() => typeRecords.value
  .reduce((balance, { amount }) => balance + amount, 0)
);

const tagsData = computed(() => {
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
  tagsInfo.sort((t1, t2) => type.value === 1 ? (t2.balance - t1.balance) : (t1.balance - t2.balance));
  return tagsInfo;
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

defineExpose({ tagsData });
</script>
