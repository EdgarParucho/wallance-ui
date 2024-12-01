<template>
  <div>
    <div class="flex items-center justify-between px-4 w">
      <div class="flex items-center gap-2">
        <RecordIcon :recordType="type" />
        <select class="font-bold flex my-4 mx-auto text-lg border-none bg-transparent shadow-sm rounded-full focus:shadow-violet-200 focus:ring-0 focus:outline-none" v-model="type">
          <option class="bg-stone-700 text-white" :value="2">Debits</option>
          <option class="bg-stone-700 text-white" :value="1">Credits</option>
        </select>
      </div>
    </div>
    <div class="flex justify-start text-xs font-bold">
      <div class="w-1/12"></div>
      <div class="w-5/12">Tag</div>
      <div class="w-2/12">Balance</div>
      <div class="w-2/12">Equivalence</div>
    </div>
    <dl>
      <div v-for="([tag, balance]) in tagsData" :key="tag" class="my-1 rounded-md shadow-md bg-white dark:bg-stone-800 flex items-center">
        <div class="w-1/12">
          <TagIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        </div>
        <dt class="ml-2 w-5/12 text-sm">{{ tag || 'Not tagged' }}</dt>
        <dd class="w-2/12 flex items-baseline my-2 mr-3 text-sm">
          ${{ getAmountFormatted(balance) }}
        </dd>
        <span class="w-2/12 text-center text-stone-500 dark:text-stone-300">{{ getTagEquivalence(balance) }} %</span>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { TagIcon } from '@heroicons/vue/24/outline';
import { useRecordStore } from '../../stores/recordStore.js';
import RecordIcon from '../layout/RecordIcon.vue';

const recordStore = useRecordStore();
const { tagsByRecordType } = storeToRefs(recordStore);

const type = ref(2);
const tagsData = ref([]);
const typeBalance = ref(0);

function getTagEquivalence(tagBalance) {
  return ((tagBalance / typeBalance.value) * 100).toFixed(1);
}

function updateTagsData(type) {
  const tagList = tagsByRecordType.value[type];
  const tagData = (tags, tag) => Object({...tags, [tag]: getTagBalance(tag) });
  const tagsBalance = tagList.reduce(tagData, {});
  tagsData.value = Object.entries(tagsBalance);
}

function updateTypeBalance(records, type) {
  typeBalance.value = records
    .filter(record => record.type == type)
    .reduce((acc, { amount }) => acc += type == 2 ? -(amount) : amount, 0);
}

function getTagBalance(tag) {
  return recordStore.records
    .filter(record => record.tag == tag && record.type == type.value)
    .reduce((acc, { amount }) => acc += type.value == 2 ? -(amount) : amount, 0);
}

function getAmountFormatted(amount) {
  return (amount < 0) ? String(Number(-amount).toFixed(2)) : String(Number(amount).toFixed(2));
}

watch([recordStore.records, type], ([records, type]) => {
  updateTypeBalance(records, type);
  updateTagsData(type);
}, { immediate: true })

defineExpose({ type, tagsData });

</script>
