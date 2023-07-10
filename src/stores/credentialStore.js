import { defineStore } from 'pinia';
import { RequestOTP, Sign, Login } from '../services/credentialAPI';
import { useLocalStorage } from '@vueuse/core';
import { useFundStore } from './fundStore';
import { useAccountStore } from './accountStore';
import API from '../services/API';
import { useRecordStore } from './recordStore';

export const useCredentialStore = defineStore('credential', () => {

  const accountStore = useAccountStore();
  const recordStore = useRecordStore();
  const fundStore = useFundStore();
  const sessionToken = useLocalStorage('vueUseSessionToken', "");

  const mutations = {
    login: ({ email, token, funds, records }) => {
      accountStore.setUser({ email });
      recordStore.setRecords(records);
      fundStore.setFunds(funds);
      sessionToken.value = token;
      API.defaults.headers.common['Authorization'] = "bearer " + token;
      return 'Good to have you. Get the most and enjoy.';
    },
    logout: () => {
      resetStores();
      return 'Your Session finished.';
    }
  };

  function resetStores() {
    sessionToken.value = null;
    accountStore.email = "";
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
      let feedback = 'An error was detected while operating your account.\n';
      if (error.response !== undefined) feedback += error.response.data;
      else feedback += error.message;
      reject(feedback);
    })
  );

  const requestOTPValidation = (body) => new Promise((resolve, reject) => RequestOTP(body)
    .then(({ data }) => {
      resolve(data)})
    .catch((error) => {
      let feedback = `Your code could not be generated.\n`
      if (error.response !== undefined) feedback += error.response.data
      else feedback += error.message
      reject(feedback)
    })
  );

  const sign = (data) => new Promise((resolve, reject) => Sign(data)
    .then((response) => resolve(response.data))
    .catch((error) => {
      let feedback = `Your user could not be created.\n`;
      if (error.response !== undefined) feedback += error.response.data;
      else feedback += error.message;
      reject(feedback);
    })
  );

  const login = (data) => useService({
    service: Login,
    data,
    mutation: mutations.login
  });

  const logout = () => mutations.logout();

  return { requestOTPValidation, sign, login, logout, sessionToken };
});
