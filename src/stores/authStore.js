import { computed } from "vue";
import { defineStore } from 'pinia';
import { RequestOTP, Login } from '../services/authAPI';
import { useLocalStorage } from '@vueuse/core';
import API from '../services/API';
import { useFundStore } from './fundStore';
import { useUserStore } from './userStore';
import { useRecordStore } from './recordStore';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore();
  const recordStore = useRecordStore();
  const fundStore = useFundStore();
  const auth = useLocalStorage("vueUseAuth", { token: null, exp: null });

  const tokenIsValid = computed(() => {
    const tokenHasData = (auth.value.token !== "" && auth.value.token !== null && auth.value.token !== undefined);
    const expirationDate = new Date(auth.value.exp * 1000);
    const tokenIsNotExpired = expirationDate > new Date();
    return tokenHasData && tokenIsNotExpired;
  })

  const mutations = {
    login: ({ data, message }) => {
      resetStores();
      fundStore.mutations.setFunds(data.funds);
      auth.value = data.token;
      userStore.setPreferences(data.preferences);
      API.defaults.headers.common['Authorization'] = "bearer " + auth.value.token;
      return message;
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
    recordStore.sampleRecords = [];
    fundStore.funds = [];
  }

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then(({ data }) => resolve(mutation(data)))
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  );

  const requestOTP = (body) => new Promise((resolve, reject) => RequestOTP({ body, token: auth.value.token })
    .then(({ data }) => resolve(data))
    .catch((error) => {
      if (error.response?.status === 401 && !tokenIsValid.value) {
        reject("For security reasons, your session finished.")
        mutations.logout();
        router.replace("/")
      } else {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      }
    })
  );

  const login = (data) => useService({
    service: Login,
    data,
    mutation: mutations.login
  });

  const logout = () => mutations.logout();

  return { auth, tokenIsValid, requestOTP, login, logout, refreshToken: mutations.refreshToken };
});
