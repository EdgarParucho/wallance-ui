import { defineStore } from "pinia";
import { ref } from "vue";
import { Create, Update, Delete, Find } from '../../placeholders/query/record'
import { Balance } from '../../placeholders/query/fund'
import { useFundStore } from "./fundStore";

export const useRecordStore = defineStore('records', () => {
  const records = ref([])
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }
  const fundStore = useFundStore()

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
      const updateFunds = Balance(record)
      fundStore.funds = [...updateFunds.data]
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
