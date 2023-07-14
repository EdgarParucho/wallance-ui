import { defineStore } from 'pinia';
import { useCredentialStore } from "./credentialStore";
import { Find, Create, Update, Delete } from '../services/recordAPI';
import { useLocalStorage } from '@vueuse/core';

export const useRecordStore = defineStore('records', () => {
  const records = useLocalStorage('vueUseRecords', []);
  const credentialStore = useCredentialStore();

  const mutations = {
    getRecords: (data) => {
      records.value = [...data]
      return 'Your records were loaded.'
    },
    setRecords: (data) => {
      records.value = [...data]
      return 'Your records were loaded.'
    },
    createRecord: (data) => {
      records.value.push(...data)
      return 'Your record was created.'
    },
    updateRecord: (data) => {
      for (const record of data) {
        const index = records.value.findIndex(r => r.id === record.id)
        records.value.splice(index, 1, record)
      }
      return 'Your record was updated.'
    },
    deleteRecord: (data) => {
      const index = records.value.findIndex(record => record.id === data)
      records.value.splice(index, 1)
      return 'Your record was deleted.'
    }
  };

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then((response) => resolve(
      mutation(response.data)
    ))
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  );

  const getRecords = () => useService({
    service: Find,
    data: { token: credentialStore.credential.token },
    mutation: mutations.getRecords,
  });

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

  return { records, getRecords, setRecords: mutations.setRecords, createRecord, updateRecord, deleteRecord };
})
