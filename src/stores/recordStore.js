import { defineStore } from "pinia";
import { ref } from "vue";
import records from '../../placeholders/records.json'

export const useRecordStore = defineStore('records', () => {
  const dummyID = (() => records.value.length.toString())
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }
  const sourceOptions = [
    { _id: '1', name: 'Main', isCredit: true },
    { _id: '2', name: 'Secondary', isCredit: true },
    { _id: '3', name: 'Occassional', isCredit: true },
    { _id: '4', name: 'Bucket 1', isCredit: false },
    { _id: '5', name: 'Bucket 2', isCredit: false },
    { _id: '6', name: 'Bucket 3', isCredit: false },
  ]  

  function addRecord(record) {
    try {
      record._id = dummyID()
      records.value.push(record)
      return queryStatus(true, 'The new record has been created successfully.')
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Create process failed. ${error.message}`)
    }
  }
  function editRecord(editingRecord) {
    try {
      const recordIndex = records.value.findIndex(record => record._id === editingRecord._id)
      records.value.splice(recordIndex, 1, editingRecord)
      return queryStatus(true, 'The record has been modified successfully.')
    } catch (error) {
      return queryStatus(false, `Edit process failed. ${error.message}`)
    }
  }
  function deleteRecord(recordID) {
    try {
      const recordIndex = records.value.findIndex(record => record._id === recordID)
      records.value.splice(recordIndex, 1)
      return queryStatus(true, 'The record has been deleted successfully.')
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Delete process failed. ${error.message}`)
    }
  }
  return { records, sourceOptions, addRecord, editRecord, deleteRecord }
})
