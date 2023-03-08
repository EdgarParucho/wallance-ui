import { defineStore } from "pinia";
import { reactive } from "vue";
import testRecords from '../../placeholders/records.json'

export const useRecordStore = defineStore('records', () => {
  const records = reactive(testRecords)
  const dummyID = () => `r${records.length}`
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }

  function addRecord(record) {
    try {
      record._id = dummyID()
      records.push(record)
      return queryStatus(true, 'The new record has been created successfully.')
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error creating record: ${error.message}`)
    }
  }
  function editRecord(editingRecord) {
    try {
      const recordIndex = records.findIndex(record => record._id === editingRecord._id)
      records.splice(recordIndex, 1, editingRecord)
      return queryStatus(true, 'The record has been modified successfully.')
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error editing record: ${error.message}`)
    }
  }
  function deleteRecord(recordID) {
    try {
      const recordIndex = records.findIndex(record => record._id === recordID)
      records.splice(recordIndex, 1)
      return queryStatus(true, 'The record has been deleted successfully.')
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error deleting record: ${error.message}`)
    }
  }
  return { records, addRecord, editRecord, deleteRecord }
})
