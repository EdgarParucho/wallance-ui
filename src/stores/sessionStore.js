import { defineStore } from 'pinia';
import { Login } from '../services/sessionAPI';
import { useLocalStorage } from '@vueuse/core';
import { useFundStore } from './fundStore';
import { useUserStore } from './userStore';

export const useSessionStore = defineStore('session', () => {
  const session = useLocalStorage('vueUseSession', { user: {}, token: null });
  const fundStore = useFundStore();
  const userStore = useUserStore();
  const userID = session.value.user._id;

  const mutations = {
    login: (data) => {
      session.value.user = data;
      userStore.user = data;
      return 'Welcome';
    },
    logout: () => {
      session.value = { user: {}, token: null };
      fundStore.funds = [];
      return 'Your session finished.';
    }
  };

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then((response) => resolve(
      mutation(response.data)
    ))
    .catch((error) => {
      let feedback = 'An error was detected while operating your account.\n';
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

  return { session, login, logout, userID };
});
