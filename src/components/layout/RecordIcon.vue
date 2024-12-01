<template>
  <component :is="icon.component" :class="['bg-opacity-20 p-1 rounded-full h-5 w-5', icon.class]" />
</template>

<script setup>
import { computed } from "vue";
import {
  MinusIcon,
  PlusIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  recordType: {
    type: Number,
    required: true,
  },
});

const icon = computed(() => {
  if (props.recordType === 0) return { component: ArrowsRightLeftIcon, class: "text-stone-500 bg-stone-600" };
  else if (props.recordType === 1) return { component: PlusIcon, class: "text-green-500 bg-green-600" };
  else return { component: MinusIcon, class: "text-red-500 bg-red-600" };
});

</script>