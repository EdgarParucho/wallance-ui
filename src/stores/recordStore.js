import { defineStore } from 'pinia';
import { useDateFormat, useLocalStorage } from '@vueuse/core';
import { useAuthStore } from "./authStore";
import { useFundStore } from './fundStore';
import { Find, Create, Update, Delete } from '../services/recordAPI';
import router from '../router';

export const useRecordStore = defineStore('records', () => {

  const records = useLocalStorage('vueUseRecords', []);
  const sampleRecords = useLocalStorage('vueUseSample', []);
  const authStore = useAuthStore();
  const fundStore = useFundStore();

  const tagData = useLocalStorage("vueUseTagData", {
    0: [],
    1: [],
    2: [],
  });
  const typeSum = useLocalStorage("vueUseTypeSumByFund", {
    1: { total: 0, byFund: {} },
    2: { total: 0, byFund: {} }
  });
  const tagNames = useLocalStorage("vueUseTagNames", {
    0: [],
    1: [],
    2: []
  });

  function updateStore(recordData) {
    const tagIndexer = { 0: {}, 1: {}, 2: {} };
    const tagCounter = { 0: 0, 1: 0, 2: 0 };

    recordData.forEach(({ fundID, type, date, tag, amount, otherFundID }) => {
      const tagName = tag || "Not tagged";
      const tagNotIndexed = tagIndexer[type][tagName] === undefined;
      const index = tagNotIndexed ? tagCounter[type] : tagIndexer[type][tagName];

      if (tagNotIndexed) {
        tagIndexer[type][tagName] = tagCounter[type];
        tagCounter[type]++;
        insertTag(type, tagName);
      }

      updateSumByType({ type, fundID, amount, otherFundID });
      updateTagData({ type, index, amount, date });
    });
  }

  function resetState() {
    tagData.value = {
      0: [],
      1: [],
      2: []
    };
    tagNames.value = {
      0: [],
      1: [],
      2: []
    };
    typeSum.value = {
      1: { total: 0, byFund: {} },
      2: { total: 0, byFund: {} }
    };
  }

  function insertTag(type, tagName) {
    const tagMonthlySum = { "01": 0, "02": 0, "03": 0, "04": 0, "05": 0, "06": 0, "07": 0, "08": 0, "09": 0, "10": 0, "11": 0, "12": 0 };
    tagNames.value[type].push(tagName);
    tagData.value[type].push({ tagName, tagSum: 0, tagMonthlySum });
  }

  function updateSumByType({ type, fundID, amount, otherFundID }) {
    validateFundNamespace(fundID);
    if (type === 0) {
      validateFundNamespace(otherFundID);
      typeSum.value[1].byFund[otherFundID] -= amount;
      typeSum.value[1].byFund[fundID] += amount;
    } else {
      typeSum.value[type].byFund[fundID] += amount;
      typeSum.value[type].total += amount;
    }
  }

  function validateFundNamespace(fundID) {
    const namespaceExists = typeSum.value[1].byFund[fundID] !== undefined;
    if (namespaceExists) return;
    typeSum.value[1].byFund[fundID] = 0;
    typeSum.value[2].byFund[fundID] = 0;
  }

  function updateTagData({ type, index, amount, date }) {
    const month = useDateFormat(new Date(date), 'MM').value;
    tagData.value[type][index].tagSum += amount;
    tagData.value[type][index].tagMonthlySum[month] += amount;
  }

  const mutations = {
    setRecords: ({ data, message }) => {
      resetState();
      updateStore(data);  
      if (data.length > 0) records.value = [...data];
      return message;
    },
    setSample: ({ data, message }) => {
      sampleRecords.value = [...data];
      return message;
    },
    createRecord: ({ data, message }) => {
      data.funds.forEach((fund) => fundStore.mutations.updateFund({ data: fund }));
      resetState();
      updateStore(records.value);  
      return message;
    },
    updateRecord: ({ data, message }) => {
      const index = records.value.findIndex(r => r.id === data.record.id)
      records.value.splice(index, 1, data.record);
      data.funds.forEach((fund) => fundStore.mutations.updateFund({ data: fund }));
      resetState();
      updateStore(records.value);  
      return message;
    },
    deleteRecord: ({ data, message }) => {
      const index = records.value.findIndex(r => r.id === data.record.id)
      records.value.splice(index, 1);
      data.funds.forEach((fund) => fundStore.mutations.updateFund({ data: fund }));
      resetState();
      updateStore(records.value);  
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

  const getRecords = (data = { filters: {} }, forSample = false) => {
    return useService({
      service: Find,
      data: { ...data, token: authStore.auth.token },
      mutation: forSample ? mutations.setSample : mutations.setRecords,
    })
  };

  const createRecord = (data) => useService({
    service: Create,
    data: { ...data, token: authStore.auth.token },
    mutation: mutations.createRecord
  });

  const updateRecord = (data) => useService({
    service: Update,
    data: { ...data, token: authStore.auth.token },
    mutation: mutations.updateRecord
  });

  const deleteRecord = (data) => useService({
    service: Delete,
    data: { ...data, token: authStore.auth.token  },
    mutation: mutations.deleteRecord
  });

  return {
    records,
    sampleRecords,
    getRecords,
    setRecords: mutations.setRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    tagData,
    tagNames,
    typeSum,
  };
})
