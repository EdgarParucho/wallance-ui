import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Find, Create, Update, Delete } from '../services/recordAPI';

export const useRecordStore = defineStore('records', () => {
  const records = ref([]);

  const mutations = {
    getRecords: (data) => {
      records.value = [...data]
      return 'Your records were loaded.'
    },
    createRecord: (data) => {
      records.value.push(data)
      return 'Your record was created.'
    },
    updateRecord: (data) => {
      const index = records.value.findIndex(record => record._id === data._id)
      records.value.splice(index, 1, data)
      return 'Your record was updated.'
    },
    deleteRecord: (data) => {
      const index = records.value.findIndex(record => record._id === data)
      records.value.splice(index, 1)
      return 'Your record was deleted.'
    }
  };

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then((response) => resolve(
      mutation(response.data)
    ))
    .catch((error) => {
      let feedback = 'An error was detected while operating your records.\n'
      if (error.response !== undefined) feedback += error.response.data
      else if (error.message !== undefined) feedback += error.message
      else feedback += error
      reject(feedback)
    })
  );

  const getRecords = (data) => useService({
    service: Find,
    data,
    mutation: mutations.getRecords
  });

  const createRecord = (data) => useService({
    service: Create,
    data,
    mutation: mutations.createRecord
  });

  const updateRecord = (data) => useService({
    service: Update,
    data,
    mutation: mutations.updateRecord
  });

  const deleteRecord = (data) => useService({
    service: Delete,
    data,
    mutation: mutations.deleteRecord
  });

  return { records, getRecords, createRecord, updateRecord, deleteRecord };
})
