import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Find, Create, Update, Delete } from '../services/recordAPI'

export const useRecordStore = defineStore('records', () => {
  const records = ref([])

  const mutations = {
    getRecords: (data) => {
      records.value = [...data]
      return 'Your records were loaded.'
    },
    createRecord: (data) => {
      const [createdRecord] = data
      records.value.push(createdRecord)
      return 'Your record was created.'
    },
    updateRecord: (data) => {
      const [updatedRecord] = data
      const index = records.value.findIndex(record => record._id === updatedRecord._id)
      records.value.splice(index, 1, updatedRecord)
      return 'Your record was updated.'
    },
    deleteRecord: (data) => {
      const [deletedRecord] = data
      const index = records.value.findIndex(f => f._id === deletedRecord._id)
      records.value.splice(index, 1)
      return 'Your record was deleted.'
    }
  }
  
  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then((response) => resolve(
      mutation(response.data)
    ))
    .catch((error) => {
      let feedback = 'An error was detected while operating your records.\n'
      if (error.response !== undefined) feedback += error.response.data
      else feedback += error.message
      reject(feedback)
    })
  )

  const getRecords = (fundsIDs) => useService({
    service: Find,
    data: fundsIDs,
    mutation: mutations.getRecords
  })

  const createRecord = (record) => useService({
    service: Create,
    data: record,
    mutation: mutations.createRecord
  })

  const updateRecord = (record) => useService({
    service: Update,
    data: record,
    mutation: mutations.updateRecord
  })
  
  const deleteRecord = (recordID) => useService ({
    service: Delete,
    data: recordID,
    mutation: mutations.deleteRecord
  })
  
  return { records, getRecords, createRecord, updateRecord, deleteRecord }
})