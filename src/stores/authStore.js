import { defineStore } from 'pinia';
import { GetUser } from '../services/userAPI';
import { useLocalStorage } from '@vueuse/core';
import { useFundStore } from './fundStore';
import { useRecordStore } from './recordStore';
import { useAuth0 } from '@auth0/auth0-vue';
import { ref, watch } from 'vue';
import API from '../services/API';

export const useAuthStore = defineStore('auth', () => {
  const recordStore = useRecordStore();
  const fundStore = useFundStore();
  const accessToken = useLocalStorage('vueUseAccessToken', '');
  const { isAuthenticated } = useAuth0();
  const loggingIn = ref(false);
  const inDemoMode = useLocalStorage('vueUseInDemoMode', false)

  const mutations = {
    login: ({ data, message }, inDemo) => {
      resetStores();
      inDemoMode.value = inDemo;
      fundStore.mutations.setFunds(data.funds);
      if (!inDemo) recordStore.records = data.records;
      return message;
    },
  };

  function resetStores() {
    accessToken.value = '';
    inDemoMode.value = false;
    recordStore.records = [];
    recordStore.sampleRecords = [];
    fundStore.funds = [];
  }

  function login({ inDemoMode = false }) {
    loggingIn.value = true;
    return GetUser({ inDemoMode })
      .then(({ data }) => mutations.login(data, inDemoMode))
      .catch((error) => error.response?.data?.message || error.response?.data || error.message || error)
      .finally(() => loggingIn.value = false)
  }

  function finishSession() {
    resetStores();
  };

  watch(() => accessToken.value, (token) => {
    API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }, { immediate: true })

  return {
    accessToken,
    isAuthenticated,
    loggingIn,
    inDemoMode,
    login,
    finishSession,
  };
});
