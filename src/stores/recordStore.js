import { defineStore } from "pinia";
import { ref } from "vue";
import { Create, Update, Delete, Find } from '../../placeholders/query/record'

export const useRecordStore = defineStore('records', () => {
  const records = ref([])
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }

  function getRecords() {
    try {
      const response = Find()
      records.value = [...response.data]
      return response
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error getting records: ${error.message}`)
    }
  }
  function createRecord(record) {
    try {
      const response = Create(record)
      records.value.push(response.data)
      return response
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error creating record: ${error.message}`)
    }
  }
  function updateRecord(record) {
    try {
      const response = Update(record)
      const index = records.value.findIndex(f => f._id === record._id)
      records.value.splice(index, 1, response.data)
      return response
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error updating record: ${error.message}`)
    }
  }
  function deleteRecord(id) {
    try {
      const response = Delete(id)
      const index = records.value.findIndex(f => f._id === id)
      records.value.splice(index, 1)
      return response
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error deleting record: ${error.message}`)
    }
  }
  return { records, getRecords, createRecord, updateRecord, deleteRecord }
})
