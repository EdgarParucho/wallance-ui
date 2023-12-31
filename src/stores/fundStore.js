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
    setFunds: (payload) => {
      funds.value = [...payload]
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

  const useService = ({ service, payload, mutation }) => new Promise((resolve, reject) => service(payload)
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

  const createFund = (payload) => useService({
    service: Create,
    payload,
    mutation: mutations.createFund
  });

  const updateFund = (payload) => useService({
    service: Update,
    payload,
    mutation: mutations.updateFund
  });

  const deleteFund = (payload) => useService({
    service: Delete,
    payload,
    mutation: mutations.deleteFund
  });

  return { funds, defaultFund, mutations, createFund, updateFund, deleteFund }
})
