import { defineStore } from 'pinia';
import { RequestOTP, Sign, Login, ResetPassword } from '../services/credentialAPI';
import { useLocalStorage } from '@vueuse/core';

import API from '../services/API';
import { useFundStore } from './fundStore';
import { useAccountStore } from './accountStore';
import { useRecordStore } from './recordStore';

export const useCredentialStore = defineStore('credential', () => {
  const accountStore = useAccountStore();
  const recordStore = useRecordStore();
  const fundStore = useFundStore();
  const credential = useLocalStorage("vueUseCredential", { token: null, exp: null });

  const mutations = {
    login: ({ token, funds, preferences }) => {
      resetStores();
      fundStore.mutations.setFunds(funds);
      credential.value = token;
      accountStore.setPreferences(preferences);
      API.defaults.headers.common['Authorization'] = "bearer " + credential.value.token;
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
    recordStore.records = [];
    fundStore.funds = [];
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

  const requestOTPValidation = (body) => new Promise((resolve, reject) => RequestOTP({ body, token: credential.value.token })
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

  const resetPassword = (body) => new Promise((resolve, reject) => ResetPassword(body)
    .then((response) => resolve(response.data))
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  )

  return { credential, requestOTPValidation, sign, login, logout, resetPassword };
});
