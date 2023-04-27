import { defineStore } from 'pinia'
import { computed } from 'vue'
import { Find, Create, Update, Delete } from '../services/fundAPI'
import { useLocalStorage } from '@vueuse/core'
import { useRecordStore } from './recordStore'

export const useFundStore = defineStore('fund', () => {
  const funds = useLocalStorage('vueUseFunds', [])
  const defaultFund = computed(() => funds.value.find(fund => fund.isDefault))
  const recordStore = useRecordStore()
  async function getFunds(userID) {
    try {
      const response = await Find(userID)
      const feedback = { message: 'Your funds were loaded.', succeed: true }
      funds.value = [...response.data]
      return feedback
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not get your funds.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }
  async function createFund(fund) {
    try {
      const response = await Create(fund)
      const [createdFund] = response.data
      funds.value.push(createdFund)
      const feedback = { message: 'Your fund was created.', succeed: true }
      return feedback
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not create your fund.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }
  async function updateFund(fund) {
    try {
      const response = await Update(fund)
      const [updatedFund] = response.data
      const index = funds.value.findIndex(f => f._id === fund._id)
      funds.value.splice(index, 1, updatedFund)
      const feedback = { message: 'Your fund was updated.', succeed: true }
      return feedback
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not update your fund.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }
  async function deleteFund(fundID) {
    try {
      const response = await Delete(fundID)
      console.log(response.data);
      const { deletedFund, deletedRecords, updatedRecords } = response.data
      const index = funds.value.findIndex(fund => fund._id === deletedFund._id)
      funds.value.splice(index, 1)

      if (recordStore.records.length > 0) fixRelatedRecords(updatedRecords, deletedRecords)
      
      const feedback = {
        message: `Your fund was deleted, its records were related to "${defaultFund.value.name}" so you can still track them.`,
        succeed: true
      }
      return feedback
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not delete your fund.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }

  function fixRelatedRecords(updatedRecords, deletedRecords) {
    for (const updatedRecord of updatedRecords) {
      const index = recordStore.records.findIndex(record => record._id === updatedRecord._id)
      if (index !== -1) recordStore.records.splice(index, 1, updatedRecord)
    }
    for (const deletedRecord of deletedRecords) {
      const index = recordStore.records.findIndex(record => record._id === deletedRecord._id)
      if (index !== -1) recordStore.records.splice(index, 1)
    }
  }

  return { funds, defaultFund, getFunds, createFund, updateFund, deleteFund }
})
