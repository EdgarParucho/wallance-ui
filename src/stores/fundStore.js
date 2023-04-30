import { defineStore } from 'pinia'
import { computed } from 'vue'
import { Find, Create, Update, Delete } from '../services/fundAPI'
import { useLocalStorage } from '@vueuse/core'
import { useRecordStore } from './recordStore'

export const useFundStore = defineStore('fund', () => {
  const funds = useLocalStorage('vueUseFunds', [])
  const defaultFund = computed(() => funds.value.find(fund => fund.isDefault))
  const recordStore = useRecordStore()
  
  const useService = (Service, arg, mutation, pastVerb) => {
    return new Promise((resolve, reject) => {
      Service(arg)
        .then((response) => {
          const { data } = response
          mutation(data)
        })
        .then(() => resolve(`Fund(s) ${pastVerb}.`))
        .catch((error) => {
          let feedback = `Your fund(s) could not be ${pastVerb}.\n`
          if (error.response !== undefined) feedback += error.response.data
          else feedback += error.message
          reject(feedback)
        })
    })
  }
  
  function getFunds(userID) {
    const Service = Find
    const arg = userID
    const mutation = (data) => funds.value = [...data]
    const pastVerb = 'loaded'
    return useService(Service, arg, mutation, pastVerb)
  }

  function createFund(fund) {
    const Service = Create
    const arg =  fund
    const mutation = (data) => {
      const [createdFund] = data
      funds.value.push(createdFund)
    }
    const pastVerb = 'created'
    return useService(Service, arg, mutation, pastVerb)
  }

  function updateFund(fund) {
    const Service = Update
    const arg = fund
    const mutation = (data) => {
      const [updatedFund] = data
      const index = funds.value.findIndex(f => f._id === fund._id)
      funds.value.splice(index, 1, updatedFund)
    }
    const pastVerb = 'updated'
    return useService(Service, arg, mutation, pastVerb)
  }
  
  function deleteFund(fundID) {
    const Service = Delete
    const arg = fundID
    const mutation = (data) => {
      const { deletedFund, deletedRecords, updatedRecords } = data
      const index = funds.value.findIndex(fund => fund._id === deletedFund._id)
      funds.value.splice(index, 1)
      if (recordStore.records.length > 0) fixRelatedRecords(updatedRecords, deletedRecords)
    }
    const pastVerb = 'deleted'
    return useService(Service, arg, mutation, pastVerb)
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
