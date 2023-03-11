import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { Create, Update, Delete, Find } from '../../placeholders/query/fund'

export const useFundStore = defineStore('funds', () => {
  const funds = ref([])
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }

  function getUserFunds(userID) {
    const response = Find(userID)
    funds.value = [...response.data]
    return response
  }
  function addFund(fund) {
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
      return queryStatus(false, `Error editing fund: ${error.message}`)
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
  return { funds, getUserFunds, addFund, updateFund, deleteFund }
})