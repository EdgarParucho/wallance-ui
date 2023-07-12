import { defineStore } from 'pinia';
import { computed } from 'vue';
import { Create, Update, Delete } from '../services/fundAPI';
import { useLocalStorage } from '@vueuse/core';
import { useRecordStore } from './recordStore';
import { useCredentialStore } from "./credentialStore";

export const useFundStore = defineStore('fund', () => {
  const recordStore = useRecordStore();
  const funds = useLocalStorage('vueUseFunds', []);
  const defaultFund = computed(() => funds.value.find(fund => fund.isDefault));
  const credentialStore = useCredentialStore();

  const mutations = {
    setFunds: (data) => {
      funds.value = [...data]
      return 'Your funds were loaded.'
    },
    createFund: (data) => {
      funds.value.push(data)
      return 'Your fund was created.'
    },
    updateFund: (data) => {
      const index = funds.value.findIndex(fund => fund.id === data.id);
      funds.value.splice(index, 1, data);
      return `Fund updated: ${data.name}.`
    },
    deleteFund: (data) => {
      const index = funds.value.findIndex(fund => fund.id === data);
      funds.value.splice(index, 1);
      recordStore.getRecords();
      return 'Your fund was deleted.';
    }
  };

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
  );

  const createFund = (data) => useService({
    service: Create,
    data: { ...data, token: credentialStore.sessionToken },
    mutation: mutations.createFund
  });

  const updateFund = (data) => useService({
    service: Update,
    data: { ...data, token: credentialStore.sessionToken },
    mutation: mutations.updateFund
  });

  const deleteFund = (data) => useService({
    service: Delete,
    data: { ...data, token: credentialStore.sessionToken },
    mutation: mutations.deleteFund
  });

  return { funds, defaultFund, setFunds: mutations.setFunds, createFund, updateFund, deleteFund }
})
