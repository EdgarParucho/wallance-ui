import { defineStore } from 'pinia';
import { RequestOTP, Sign, Login } from '../services/authAPI';
import { useLocalStorage } from '@vueuse/core';

import API from '../services/API';
import { useFundStore } from './fundStore';
import { useUserStore } from './userStore';
import { useRecordStore } from './recordStore';

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore();
  const recordStore = useRecordStore();
  const fundStore = useFundStore();
  const auth = useLocalStorage("vueUseAuth", { token: null, exp: null });

  const mutations = {
    login: ({ token, funds, preferences }) => {
      resetStores();
      fundStore.mutations.setFunds(funds);
      auth.value = token;
      userStore.setPreferences(preferences);
      API.defaults.headers.common['Authorization'] = "bearer " + auth.value.token;
      return 'Good to have you. Get the most and enjoy.';
    },
    logout: () => {
      resetStores();
      return 'Your Session finished.';
    },
    refreshToken: (token) => auth.value = token
  };

  function resetStores() {
    auth.value.token = null;
    auth.value.exp = null;
    userStore.preferences = { templates: [], queries: [], darkMode: false, FirstStepsStatus: [], language: null };
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

  const requestOTP = (body) => new Promise((resolve, reject) => RequestOTP({ body, token: auth.value.token })
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

  return { auth, requestOTP, sign, login, logout, refreshToken: mutations.refreshToken };
});
