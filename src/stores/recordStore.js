import { defineStore } from "pinia";
import { ref } from "vue";

export const useRecordStore = defineStore('records', () => {
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }
  const records = ref([
    { _id: '0', amount: 8, type: 'Debit', note: 'Paying services: electricity, condominium)', date: '2023-02-17', sourceID: '1' },
    { _id: '1', amount: 300, type: 'Credit', note: 'Salary', date: '2023-02-14', sourceID: '2' }
  ])
  const dummyID = (() => records.value.length.toString())

  function addRecord(record) {
    try {
      record._id = dummyID()
      records.value.push(record)
      return queryStatus(true, 'The new record has been created successfully.')
    } catch (error) {
      console.error(error)
      queryStatus = { succeed: false, feedback: `Create process failed. ${error.message}` }
      return queryStatus
    }
  }
  function editRecord(editingRecord) {
    try {
      const recordIndex = records.value.findIndex(record => record._id === editingRecord._id)
      records.value.splice(recordIndex, 1, editingRecord)
      return queryStatus(true, 'The record has been modified successfully.')
    } catch (error) {
      console.error(error)
      queryStatus = { succeed: false, feedback: `Edit process failed. ${error.message}` }
      return queryStatus
    }
  }
  function deleteRecord(recordID) {
    try {
      const recordIndex = records.value.findIndex(record => record._id === recordID)
      records.value.splice(recordIndex, 1)
      return queryStatus(true, 'The record has been deleted successfully.')
    } catch (error) {
      console.error(error)
      queryStatus = { succeed: false, feedback: `Delete process failed. ${error.message}` }
      return queryStatus
    }
  }
  return { records, addRecord, editRecord, deleteRecord }
})
