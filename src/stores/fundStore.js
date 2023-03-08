import { defineStore } from 'pinia'
import { reactive } from 'vue'
import testFunds from '../../placeholders/funds.json'

export const useFundStore = defineStore('funds', () => {
  const funds = reactive(testFunds)
  const dummyID = () => `f${funds.length}`
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }

  function addFund(fund) {
    try {
      fund._id = dummyID()
      funds.push(fund)
      return queryStatus(true, 'The new fund has been created successfully.')
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error creating fund: ${error.message}`)
    }
  }
  function editFund(editingFund) {
    try {
      const fundIndex = funds.findIndex(fund => fund._id === editingFund._id)
      funds.splice(fundIndex, 1, editingFund)
      return queryStatus(true, 'The fund has been modified successfully.')
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error editing fund: ${error.message}`)
    }
  }
  function deleteFund(fundID) {
    try {
      const fundIndex = funds.findIndex(fund => fund._id === fundID)
      funds.splice(fundIndex, 1)
      return queryStatus(true, 'The fund has been deleted successfully.')
    } catch (error) {
      console.error(error)
      return queryStatus(false, `Error deleting fund: ${error.message}`)
    }
  }
  return { funds, addFund, editFund, deleteFund }
})