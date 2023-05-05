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
      const updatedFund = data;
      const index = funds.value.findIndex(fund => fund._id === updatedFund._id);
      funds.value.splice(index, 1, updatedFund);
      return 'Your fund was updated.'
    },
    deleteFund: (data) => {
      const _id = data;
      const index = funds.value.findIndex(fund => fund._id === _id);
      funds.value.splice(index, 1);
      if (recordStore.records.length > 0) {
        const fundsIDs = funds.value.map(fund => fund._id);
        recordStore.getRecords(fundsIDs);
      }
      return 'Your fund was deleted.';
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

  const getFunds = (data) => useService({
    service: Find,
    data,
    mutation: mutations.getFunds
  })

  const createFund = (data) => useService({
    service: Create,
    data,
    mutation: mutations.createFund
  })

  const updateFund = (data) => useService({
    service: Update,
    data,
    mutation: mutations.updateFund
  })

  const deleteFund = (data) => useService({
    service: Delete,
    data,
    mutation: mutations.deleteFund
  })

  return { funds, defaultFund, getFunds, createFund, updateFund, deleteFund }
})
