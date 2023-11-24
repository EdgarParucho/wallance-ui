import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { useAuthStore } from "./authStore";
import { useRecordStore } from './recordStore';
import { Create, Update, Delete } from '../services/fundAPI';
import router from '../router';

export const useFundStore = defineStore('fund', () => {
  const recordStore = useRecordStore();
  const funds = useLocalStorage('vueUseFunds', []);
  const defaultFund = computed(() => funds.value.find(fund => fund.isDefault));
  const authStore = useAuthStore();

  const mutations = {
    setFunds: (data) => {
      funds.value = [...data]
      return
    },
    createFund: ({ data, message }) => {
      funds.value.push(data)
      return message;
    },
    updateFund: ({ data, message = "Fund updated." }) => {
      const index = funds.value.findIndex(fund => fund.id === data.id);
      funds.value.splice(index, 1, data);
      return message;
    },
    deleteFund: ({ data, message }) => {
      const index = funds.value.findIndex(fund => fund.id === data);
      funds.value.splice(index, 1);
      recordStore.getRecords();
      return message;
    }
  };

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then(({ data }) => resolve(
      mutation(data)
    ))
    .catch((error) => {
      if (error.response?.status === 401 && !authStore.tokenIsValid) {
        reject("For security reasons, your session finished.")
        authStore.logout();
        router.replace("/")
      } else {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      }
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
