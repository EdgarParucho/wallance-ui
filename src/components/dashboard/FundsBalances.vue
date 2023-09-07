<script setup>
import { ArchiveBoxIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['funds']);

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

</script>

<template>
  <dl class="md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto">
    <div v-for="fund in funds" :key="fund.id" class="my-1 rounded-md shadow-md bg-white dark:bg-stone-800 flex justify-between items-center">
      <dt class="text-lg font-bold flex items-center gap-4 p-3">
        <ArchiveBoxIcon class="w-8 mx-auto p-1.5 rounded-full shadow-md text-stone-500 dark:text-stone-400 dark:shadow-[#101010] bg-stone-100 dark:bg-stone-800" />
        {{ fund.name }}
      </dt>
      <dd class="justify-end flex items-baseline my-2 mr-3 text-2xl">
        {{ amountFormatted(fund.balance) }}
      </dd>
    </div>
  </dl>
</template>