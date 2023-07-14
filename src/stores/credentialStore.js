import { defineStore } from 'pinia';
import API from '../services/API';
import { RequestOTP, Sign, Login } from '../services/credentialAPI';
import { useLocalStorage } from '@vueuse/core';

import { useFundStore } from './fundStore';
import { useAccountStore } from './accountStore';
import { useRecordStore } from './recordStore';

export const useCredentialStore = defineStore('credential', () => {
  const accountStore = useAccountStore();
  const recordStore = useRecordStore();
  const fundStore = useFundStore();
  const credential = useLocalStorage("vueUseCredential", { token: null, exp: null });

  const mutations = {
    login: ({ email, token, funds, records }) => {
      accountStore.setUser({ email });
      recordStore.setRecords(records);
      fundStore.setFunds(funds);
      credential.value = token;
      API.defaults.headers.common['Authorization'] = "bearer " + token;
      return 'Good to have you. Get the most and enjoy.';
    },
    logout: () => {
      resetStores();
      return 'Your Session finished.';
    }
  };

  function resetStores() {
    credential.value.token = null;
    credential.value.exp = null;
    accountStore.email = null;
    recordStore.records = null;
    fundStore.funds = null;
  }

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then((response) => {
      resolve(
        mutation(response.data)
      )
    })
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  );

  const requestOTPValidation = (body) => new Promise((resolve, reject) => RequestOTP(body)
    .then(({ data }) => {
      resolve(data)})
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  );

  const sign = (data) => new Promise((resolve, reject) => Sign(data)
    .then((response) => resolve(response.data))
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  );

  const login = (data) => useService({
    service: Login,
    data,
    mutation: mutations.login
  });

  const logout = () => mutations.logout();

  return { requestOTPValidation, sign, login, logout, credential };
});
