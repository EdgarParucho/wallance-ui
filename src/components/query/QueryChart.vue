<template>
  <Doughnut id="debits-tags-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import { useRecordStore } from '../../stores/recordStore.js';

ChartJS.register(Tooltip, Legend, ArcElement);
ChartJS.defaults = { responsive: true };

const props = defineProps({
  tagsDataRef: {
    type: Object,
    default: {
      type: 2,
      tagsData: [],
    },
  },
})

const recordStore = useRecordStore();
const { tagsByRecordType } = storeToRefs(recordStore);

const colors = [
  "#ddd6fe",
  "#a78bfa",
  "#8b5cf6",
  "#c084fc",
  "#a855f7",
  "#e879f9",
  "#d946ef",
  "#6366f1",
  "#60a5fa",
  "#38bdf8",
  "#f472b6",
  "#fb7185",
  "#fecaca",
  "#2dd4bf",
];

const chartData = computed(() => {
  return {
    labels: tagsByRecordType.value[props.tagsDataRef.type],
    datasets: [
      {
        label: " $",
        data: props.tagsDataRef.tagsData.map(([, balance]) => balance),
        backgroundColor: colors
      },
    ],
  }
});
const chartOptions = {
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#777" }
    }
  }
};

</script>
