<template>
  <div v-if="!(record.type === 0 && record.amount > 0)" class="bg-stone-800 text-white font-sans rounded-md lg:block h-38 my-4 lg:w-2/3 mx-auto">
    <div class="flex justify-between">
      <span class="text-white ml-2">{{ recordDate }}</span>
      <div class="flex items-center bg-stone-700">
        <span class="rounded-sm font-bold flex items-center h-6 px-3 text-sm">
          {{ fundName }}
        </span>
        <span v-if="record.type === 0" :class="[typeStyles, 'px-1']">
          <ArrowRightIcon class="h-5 w-5" />
        </span>
        <span
        v-if="record.type === 0"
        class="rounded-sm font-bold flex items-center h-6 px-3 text-sm">
        {{ otherFundName }}
      </span>
    </div>
    </div>
    <div class="justify-end flex items-center my-2 mr-3 space-x-2">
      <span class="text-3xl">{{ recordAmount }}</span>
      <div :class="[typeStyles, 'p-1 rounded-full']">
        <component class="h-5 w-5" :is="typeIcon" />
      </div>
    </div>
    <p class="ml-2 text-md h-8">{{ record.note }}</p>
    <p class="text-small text-white flex text-sm">
      <TagIcon class="w-4 mx-2 text-yellow-400" aria-hidden="true" />
      {{ record.tag }}
    </p>

    <div class="flex align-bottom">
      <button
      class="w-1/2 py-1 text-white bg-stone-800 active:bg-stone-800 hover:bg-stone-700 focus:bg-stone-700 focus:outline-none transition-colors"
      @click="$emit('edit-record', record)"
      >
        <PencilSquareIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
      <button
      class="w-1/2 py-1 text-red-500 bg-stone-800 active:bg-red-800 hover:bg-red-900 focus:bg-red-900 focus:outline-none transition-colors"
      @click="confirmDeletion(record)"
      >
        <TrashIcon class="w-4 mx-auto" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ArrowsRightLeftIcon, ArrowRightIcon, MinusIcon, PencilSquareIcon, PlusIcon, TagIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue';
import { useFundStore } from '../../stores/fundStore';
import swal from "sweetalert";
import { storeToRefs } from 'pinia';

const props = defineProps(['record'])
const emit = defineEmits(['edit-record', 'delete-record'])
const fundStore = useFundStore();
const { funds } = storeToRefs(fundStore);

const recordDate = computed(() => new Date(props.record.date).toDateString());
const recordAmount = computed(() => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  roundingIncrement: 5,
}).format(props.record.amount));

const fundName = computed(() => funds.value
  .find(fund => fund.id === props.record.fundID)
  .name
);

const otherFundName = computed(() => funds.value
  .find(fund => fund.id === props.record.otherFundID)
  .name
);

const typeIcon = computed(() => {
  if (props.record.type === 0) return ArrowsRightLeftIcon
  else if (props.record.type === 1) return PlusIcon
  else return MinusIcon
});

const typeStyles = computed(() => {
  if (props.record.type === 0) return 'text-white bg-stone-700'
  else if (props.record.type === 1) return 'text-green-400 bg-green-900'
  else return 'text-red-400 bg-red-900'
});

async function confirmDeletion(record) {
  const deletionIsConfirmed = await swal({
    icon: "warning",
    title: "Caution",
    text: 'Please confirm if you want to delete the record. The action is irreversible.',
    buttons: true,
    timer: null,
  });
  if (deletionIsConfirmed) emit('delete-record', record)
}
</script>
