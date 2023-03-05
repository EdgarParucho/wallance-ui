import { defineStore } from 'pinia'
import funds from '../../placeholders/funds.json'

export const useFundStore = defineStore('funds', () => {
  const dummyID = () => `f${funds.length}`
  const queryStatus = (succeed, feedback) => { return { succeed, feedback } }
  function addFund(fund) {
    try {
      fund._id = dummyID()
      funds.push(fund)
      return queryStatus(true, 'The new fund has been created successfully.')
    } catch (error) {
      console.error(error)
      queryStatus = { succeed: false, feedback: `Error creating fund: ${error.message}` }
      return queryStatus
    }
  }
  function editFund(editingFund) {
    try {
      const fundIndex = funds.findIndex(fund => fund._id === editingFund._id)
      funds.splice(fundIndex, 1, editingFund)
      return queryStatus(true, 'The fund has been modified successfully.')
    } catch (error) {
      console.error(error)
      queryStatus = { succeed: false, feedback: `Error editing fund. ${error.message}` }
      return queryStatus
    }
  }
  function deleteFund(fundID) {
    try {
      const fundIndex = funds.findIndex(fund => fund._id === fundID)
      funds.splice(fundIndex, 1)
      return queryStatus(true, 'The fund has been deleted successfully.')
    } catch (error) {
      console.error(error)
      queryStatus = { succeed: false, feedback: `Error deleting fund. ${error.message}` }
      return queryStatus
    }
  }
  return { funds, addFund, editFund, deleteFund }
})