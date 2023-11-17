import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

import { useAuthStore } from "./authStore";
import { useRecordStore } from './recordStore';
import { Create, Update, Delete } from '../services/fundAPI';

export const useFundStore = defineStore('fund', () => {
  const recordStore = useRecordStore();
  const funds = useLocalStorage('vueUseFunds', []);
  const defaultFund = computed(() => funds.value.find(fund => fund.isDefault));
  const authStore = useAuthStore();

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
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  );

  const createFund = (data) => useService({
    service: Create,
    data: { ...data, token: authStore.auth.token },
    mutation: mutations.createFund
  });

  const updateFund = (data) => useService({
    service: Update,
    data: { ...data, token: authStore.auth.token },
    mutation: mutations.updateFund
  });

  const deleteFund = (data) => useService({
    service: Delete,
    data: { ...data, token: authStore.auth.token },
    mutation: mutations.deleteFund
  });

  return { funds, defaultFund, mutations, createFund, updateFund, deleteFund }
})
