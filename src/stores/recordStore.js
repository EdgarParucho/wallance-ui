import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { useAuthStore } from './authStore';
import { useFundStore } from './fundStore';
import { Find, Create, Update, Delete } from '../services/recordAPI';
import router from '../router';
import { computed } from 'vue';

export const useRecordStore = defineStore('records', () => {

  const records = useLocalStorage('vueUseRecords', []);
  const authStore = useAuthStore();
  const fundStore = useFundStore();

  const mutations = {
    setRecords: ({ data, message }) => {
      records.value = [...data];
      return message;
    },
    createRecord: ({ data, message }) => {
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

  const useService = ({ service, payload, mutation }) => new Promise((resolve, reject) => service(payload)
    .then(({ data }) => resolve(
      mutation(data)
    ))
    .catch((error) => {
      if (error.response?.status === 401 && !authStore.isAuthenticated) {
        reject('For security reasons, your session finished.')
        authStore.finishSession();
        router.replace('/')
      } else {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      }
    })
  );

  const getRecords = (payload = { filters: {} }) => useService({
    service: Find,
    payload,
    mutation: mutations.setRecords,
  });

  const createRecord = (payload) => useService({
    service: Create,
    payload,
    mutation: mutations.createRecord
  });

  const updateRecord = (payload) => useService({
    service: Update,
    payload,
    mutation: mutations.updateRecord
  });

  const deleteRecord = (payload) => useService({
    service: Delete,
    payload,
    mutation: mutations.deleteRecord
  });

  const tagsByRecordType = computed(() => {
    let tags = { 0: [], 1: [], 2: [] };
    records.value.forEach(({ type, tag }) => tags[type].push(tag))
    for (let type in tags) tags[type] = [...new Set(tags[type])]
    return tags
  })

  return {
    records,
    getRecords,
    setRecords: mutations.setRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    tagsByRecordType,
  };
})
