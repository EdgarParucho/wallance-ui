import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Find, Create, Update, Delete } from '../services/recordAPI'

export const useRecordStore = defineStore('records', () => {
  const records = ref([])

  async function getRecords(fundsIDs) {
    try {
      const response = await Find(fundsIDs)
      const feedback = { message: 'Your records were loaded.', succeed: true }
      records.value = [...response.data]
      return feedback
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not get your records.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }

  async function createRecord(record) {
    try {
      const response = await Create(record)
      const [createdRecord] = response.data
      records.value.push(createdRecord)
      const feedback = { message: 'Your record was created.', succeed: true }
      return feedback
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not create your record.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }
  
  async function updateRecord(record) {
    try {
      const response = await Update(record)
      const [updatedRecord] = response.data
      const index = records.value.findIndex(f => f._id === updatedRecord._id)
      records.value.splice(index, 1, updatedRecord)
      const feedback = { message: 'Your record was updated.', succeed: true }
      return feedback
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not update your record.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }
  const newPromise = (Service, arg, mutation, pastVerb) => {
    return new Promise((resolve, reject) => {
      Service(arg)
        .then((response) => {
          const { data } = response
          mutation(data)
        })
        .then(() => resolve(`Your record was ${pastVerb}.`))
        .catch((error) => {
          let feedback = `Your record could not be ${pastVerb}.\n`
          if (error.response !== undefined) feedback += error.response.data
          else feedback += error.message
          reject(feedback)
        })
    })
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
    return newPromise(Service, arg, mutation, pastVerb)
  }

  return { records, getRecords, createRecord, updateRecord, deleteRecord }
})