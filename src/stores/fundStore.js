import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { Create, Update, Delete } from '../services/fundAPI';
import { useLocalStorage } from '@vueuse/core';
import { useRecordStore } from './recordStore';
import { useCredentialStore } from "./credentialStore";
import { storeToRefs } from 'pinia';

export const useFundStore = defineStore('fund', () => {
  const recordStore = useRecordStore();
  const { records } = storeToRefs(recordStore);
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
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  );

  const createFund = (data) => useService({
    service: Create,
    data: { ...data, token: credentialStore.credential.token },
    mutation: mutations.createFund
  });

  const updateFund = (data) => useService({
    service: Update,
    data: { ...data, token: credentialStore.credential.token },
    mutation: mutations.updateFund
  });

  const deleteFund = (data) => useService({
    service: Delete,
    data: { ...data, token: credentialStore.credential.token },
    mutation: mutations.deleteFund
  });

  watch(() => records.value,
  (records) => {
    funds.value.forEach(fund => {
      const fundRecordsAmounts = records.filter(record => record.fundID === fund.id || record.otherFundID === fund.id);
      fund.balance = fundRecordsAmounts.reduce((balance, record) => {
        const recordAmount = record.fundID === fund.id ? record.amount : -record.amount;
        return balance + recordAmount;
      }, 0);
  
      fund.balance = fund.balance.toFixed(2)
    })
  }, { immediate: true });
  
  return { funds, defaultFund, setFunds: mutations.setFunds, createFund, updateFund, deleteFund }
})
