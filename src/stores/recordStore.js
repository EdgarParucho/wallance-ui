import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import { useAuthStore } from "./authStore";
import { useFundStore } from './fundStore';
import { Find, Create, Update, Delete } from '../services/recordAPI';

export const useRecordStore = defineStore('records', () => {
  const records = useLocalStorage('vueUseRecords', []);
  const authStore = useAuthStore();
  const fundStore = useFundStore();
  const requestingRecords = ref(false);

  const tags = computed(() => {
    const recordWithTags = records.value.filter(r => r.tag);
    const filteredRecords = { 0: [], 1: [], 2: [] };
    recordWithTags.forEach(record => {
      const notIncluded = !filteredRecords[record.type].includes(record.tag);
      if (notIncluded) filteredRecords[record.type].push(record.tag)
    })
    return filteredRecords;
  });

  const mutations = {
    setRecords: ({ data, message }) => {
      if (data.length > 0) records.value = [...data];
      requestingRecords.value = false;
      return message;
    },
    createRecord: ({ data, message }) => {
      records.value.push(data.record)
      data.funds.forEach((fund) => fundStore.mutations.updateFund({ data: fund }));
      return message;
    },
    updateRecord: ({ data, message }) => {
      const index = records.value.findIndex(r => r.id === data.record.id)
      records.value.splice(index, 1, data.record);
      data.funds.forEach((fund) => fundStore.mutations.updateFund({ data: fund }));
      return message;
    },
    deleteRecord: ({ data, message }) => {
      const index = records.value.findIndex(r => r.id === data.record.id)
      records.value.splice(index, 1);
      data.funds.forEach((fund) => fundStore.mutations.updateFund({ data: fund }));
      return message;
    }
  };

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then(({ data }) => resolve(
      mutation(data)
    ))
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      requestingRecords.value = false;
      reject(feedback);
    })
  );

  const getRecords = (data = { filters: {} }) => {
    requestingRecords.value = true;
    return useService({
      service: Find,
      data: { ...data, token: authStore.auth.token },
      mutation: mutations.setRecords,
    })};

  const createRecord = (data) => useService({
    service: Create,
    data: { ...data, token: authStore.auth.token },
    mutation: mutations.createRecord
  });

  const updateRecord = (data) => useService({
    service: Update,
    data: { ...data, token: authStore.auth.token },
    mutation: mutations.updateRecord
  });

  const deleteRecord = (data) => useService({
    service: Delete,
    data: { ...data, token: authStore.auth.token  },
    mutation: mutations.deleteRecord
  });

  watch(records, () => {
    records.value.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, { immediate: true })

  return {
    records,
    tags,
    getRecords,
    setRecords: mutations.setRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    requestingRecords,
  };
})
