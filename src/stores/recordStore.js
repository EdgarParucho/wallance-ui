import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Find, Create, Update, Delete } from '../services/recordAPI'

export const useRecordStore = defineStore('records', () => {
  const records = ref([])

  const useService = (Service, arg, mutation, pastVerb) => {
    return new Promise((resolve, reject) => {
      Service(arg)
        .then((response) => {
          const { data } = response
          mutation(data)
        })
        .then(() => resolve(`Record(s) ${pastVerb}.`))
        .catch((error) => {
          let feedback = `Your record(s) could not be ${pastVerb}.\n`
          if (error.response !== undefined) feedback += error.response.data
          else feedback += error.message
          reject(feedback)
        })
    })
  }

  function getRecords(fundsIDs) {
    const Service = Find
    const arg = fundsIDs
    const mutation = (data) => records.value = [...data]
    const pastVerb = 'loaded'
    return useService(Service, arg, mutation, pastVerb)
  }

  function createRecord(record) {
    const Service = Create
    const arg = record
    const mutation = (data) => {
      const [createdRecord] = data
      records.value.push(createdRecord)
    }
    const pastVerb = 'created'
    return useService(Service, arg, mutation, pastVerb)
  }
  
  function updateRecord(record) {
    const Service = Update
    const arg = record
    const mutation = (data) => {
      const [updatedRecord] = data
      const index = records.value.findIndex(f => f._id === updatedRecord._id)
      records.value.splice(index, 1, updatedRecord)
    }
    const pastVerb = 'updated'
    return useService(Service, arg, mutation, pastVerb)
  }
  
  function deleteRecord(recordID) {
    const Service = Delete
    const arg = recordID
    const mutation = (data) => {
      const [deletedRecord] = data
      const index = records.value.findIndex(f => f._id === deletedRecord._id)
      records.value.splice(index, 1)
    }
    const pastVerb = 'deleted'
    return useService(Service, arg, mutation, pastVerb)
  }

  return { records, getRecords, createRecord, updateRecord, deleteRecord }
})