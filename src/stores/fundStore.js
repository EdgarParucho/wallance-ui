import { defineStore } from 'pinia'
import { computed } from 'vue'
import { Find, Create, Update, Delete } from '../services/fundAPI'
import { useLocalStorage } from '@vueuse/core'
import { useRecordStore } from './recordStore'

export const useFundStore = defineStore('fund', () => {
  const recordStore = useRecordStore()
  const funds = useLocalStorage('vueUseFunds', [])
  const defaultFund = computed(() => funds.value.find(fund => fund.isDefault))
  
  const mutations = {
    getFunds: (data) => {
      funds.value = [...data]
      return 'Your funds were loaded.'
    },
    createFund: (data) => {
      const [createdFund] = data
      funds.value.push(createdFund)
      return 'Your fund was created.'
    },
    updateFund: (data) => {
      const [updatedFund] = data
      const index = funds.value.findIndex(fund => fund._id === updatedFund._id)
      funds.value.splice(index, 1, updatedFund)
      return 'Your fund was updated.'
    },
    deleteFund: (data) => {
      const { deletedFund, deletedRecords, updatedRecords } = data
      const index = funds.value.findIndex(fund => fund._id === deletedFund._id)
      funds.value.splice(index, 1)
      if (recordStore.records.length > 0) fixRelatedRecords(updatedRecords, deletedRecords)
      return 'Your fund was deleted.'
    }
  }
  
  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then((response) => resolve(
      mutation(response.data)
    ))
    .catch((error) => {
      let feedback = 'An error was detected while operating your funds.\n'
      if (error.response !== undefined) feedback += error.response.data
      else feedback += error.message
      reject(feedback)
    })
  )

  const getFunds = (userID) => useService({
    service: Find,
    data: userID,
    mutation: mutations.getFunds
  })

  const createFund = (fund) => useService({
    service: Create,
    data: fund,
    mutation: mutations.createFund
  })

  const updateFund = (fund) => useService({
    service: Update,
    data: fund,
    mutation: mutations.updateFund
  })

  const deleteFund = (fundID) => useService ({
    service: Delete,
    data: fundID,
    mutation: mutations.deleteFund
  })

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
