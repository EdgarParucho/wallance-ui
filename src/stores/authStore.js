import { defineStore } from 'pinia';
import { RequestOTP, Login } from '../services/authAPI';
import { useLocalStorage } from '@vueuse/core';
import { useFundStore } from './fundStore';
import { useUserStore } from './userStore';
import { useRecordStore } from './recordStore';
import { useAuth0 } from '@auth0/auth0-vue';
import { watch } from 'vue';
import router from '../router';
import API from '../services/API';

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore();
  const recordStore = useRecordStore();
  const fundStore = useFundStore();
  const accessToken = useLocalStorage("vueUseAccessToken", "");
  // const isAuth = useLocalStorage("vueUseIsAuthenticated", false);
  const { isAuthenticated } = useAuth0();

  const mutations = {
    login: ({ data, message }) => {
      resetStores();
      fundStore.mutations.setFunds(data.funds);
      userStore.setPreferences(data.preferences);
      return message;
    },
    logout: () => resetStores(),
    refreshToken: (token) => accessToken.value = token
  };

  function resetStores() {
    accessToken.value = null;
    userStore.preferences = { templates: [], queries: [], darkMode: false, FirstStepsStatus: [], language: null };
    recordStore.records = [];
    recordStore.sampleRecords = [];
    fundStore.funds = [];
  }

  const useService = ({ service, payload, mutation }) => new Promise((resolve, reject) => service(payload)
    .then(({ data }) => resolve(mutation(data)))
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  );

  const requestOTP = (body) => new Promise((resolve, reject) => RequestOTP({ body, token: accessToken.value })
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

  const login = (payload) => useService({
    service: Login,
    payload,
    mutation: mutations.login
  });

  const logout = () => mutations.logout();

  watch(() => accessToken.value, (token) => {
    API.defaults.headers.common['Authorization'] = "Bearer " + token;
    // isAuth.value = isAuthenticated.value;
  }, { immediate: true })

  return {
    accessToken,
    isAuthenticated,
    requestOTP,
    login,
    logout,
    refreshToken: mutations.refreshToken
  };
});
