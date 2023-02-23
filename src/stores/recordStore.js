import { defineStore } from "pinia";
import { ref } from "vue";

export const useRecordStore = defineStore('records', () => {
  const records = ref([
    { amount: 8, type: 'Debit', note: 'Paying services: electricity, condominium)', date: '2023-02-17' },
    { amount: 300, type: 'Credit', note: 'Salary', date: '2023-02-14' }
  ])

  function addRecord(record) {
    let queryStatus = { succeed: false, feedback: '' }
    try {
      const queryStatus = (succeed, feedback) => { return { succeed, feedback } }
      records.value.push(record)
      return queryStatus(true, 'A new record has been created.')

    } catch (error) {
      console.error(error)
      queryStatus = { succeed: false, feedback: `The saving process failed. ${error.message}` }
      return queryStatus
    }
  }
  return { records, addRecord }
})
