import { defineStore } from 'pinia';
import { useCredentialStore } from "./credentialStore";
import { Find, Create, Update, Delete } from '../services/recordAPI';
import { useLocalStorage } from '@vueuse/core';
import { ref, computed, watch } from 'vue';
import { useFundStore } from './fundStore';

export const useRecordStore = defineStore('records', () => {
  const records = useLocalStorage('vueUseRecords', []);
  const credentialStore = useCredentialStore();
  const fundStore = useFundStore();
  const requestingRecords = ref(false);

  const assignmentTags = computed(() => Array.from(new Set(records.value
    .filter(r => r.type === 0)
    .map(r => r.tag)))
  );

  const creditTags = computed(() => Array.from(new Set(records.value
    .filter(r => r.type === 1)
    .map(r => r.tag)))
  );

  const debitTags = computed(() => Array.from(new Set(records.value
    .filter(r => r.type === 2)
    .map(r => r.tag)))
  );

  const recordTags = computed(() => {
    return { 0: assignmentTags.value, 1: creditTags.value, 2: debitTags.value }
  });

  const mutations = {
    setRecords: (data) => {
      if (data.length > 0) records.value = [...data];
      requestingRecords.value = false;
      return data.length;
    },
    createRecord: (data) => {
      records.value.push(data.record)
      data.funds.forEach((fund) => fundStore.mutations.updateFund(fund));
      return 'Your record was created.'
    },
    updateRecord: (data) => {
      const index = records.value.findIndex(r => r.id === data.record.id)
      records.value.splice(index, 1, data.record);
      data.funds.forEach((fund) => fundStore.mutations.updateFund(fund));
      return 'Your record was updated.'
    },
    deleteRecord: (data) => {
      const index = records.value.findIndex(r => r.id === data.record.id)
      records.value.splice(index, 1);
      data.funds.forEach((fund) => fundStore.mutations.updateFund(fund));
      return 'Your record was deleted.'
    }
  };

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then((response) => resolve(
      mutation(response.data)
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
      data: { ...data, token: credentialStore.credential.token },
      mutation: mutations.setRecords,
    })};

  const createRecord = (data) => useService({
    service: Create,
    data: { ...data, token: credentialStore.credential.token },
    mutation: mutations.createRecord
  });

  const updateRecord = (data) => useService({
    service: Update,
    data: { ...data, token: credentialStore.credential.token },
    mutation: mutations.updateRecord
  });

  const deleteRecord = (data) => useService({
    service: Delete,
    data: { ...data, token: credentialStore.credential.token  },
    mutation: mutations.deleteRecord
  });

  watch(records, () => {
    records.value.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, { immediate: true })

  return {
    records,
    recordTags,
    getRecords,
    setRecords: mutations.setRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    requestingRecords,
  };
})
