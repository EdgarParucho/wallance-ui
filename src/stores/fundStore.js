import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Create, Update, Delete, Find } from '../../placeholders/query/fund'
import { Balance } from '../../placeholders/query/fund'
import { useRecordStore } from './recordStore'

export const useFundStore = defineStore('funds', () => {
  const funds = ref([])
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }
  const recordStore = useRecordStore()

  function getFunds(userID) {
    try {
      const response = Find(userID)
      funds.value = [...response.data]
      return response
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error getting funds: ${error.message}`)
    }
  }
  function createFund(fund) {
    try {
      const response = Create(fund)
      funds.value.push(response.data)
      return response
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error creating fund: ${error.message}`)
    }
  }
  function updateFund(fund) {
    try {
      const response = Update(fund)
      const index = funds.value.findIndex(f => f._id === fund._id)
      funds.value.splice(index, 1, response.data)
      return response
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error updating fund: ${error.message}`)
    }
  }
  function deleteFund(id) {
    try {
      const response = Delete(id)
      const index = funds.value.findIndex(f => f._id === id)
      funds.value.splice(index, 1)
      return response
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error deleting fund: ${error.message}`)
    }
  }
  function balanceFunds(record) {
    try {
      const response = Balance(record)
      funds.value = [...response.data]
      return recordStore.createRecord(record)
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error balancing funds: ${error.message}`)
    }
  }

  return { funds, getFunds, createFund, updateFund, deleteFund, balanceFunds }
})