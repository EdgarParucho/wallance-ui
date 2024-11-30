import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core';
import { useAuthStore } from './authStore';
import { UpdateUser, DeleteUser } from '../services/userAPI';
import router from '../router';

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore();
  const activeTheme = useLocalStorage('vueUseActiveTheme', 'light');

  function updateUser(payload) {
    return new Promise((resolve, reject) => UpdateUser(payload)
      .then(({ data }) => resolve(data))
      .catch((error) => {
        if (error.response?.status === 401 && !authStore.isAuthenticated) {
          reject('For security reasons, your session finished.')
          authStore.finishSession();
          router.replace('/');
        } else {
          const feedback = error.response?.data?.message || error.response?.data || error.message || error;
          reject(feedback);
        }
      })
    )
  }

  function setActiveTheme(themeSelected = 'light') {
    activeTheme.value = themeSelected;
  }

  function deleteUser() {
    return new Promise((resolve, reject) => DeleteUser()
      .then(() => {
        authStore.finishSession();
        resolve();
      })
      .catch((error) => {
        if (error.response?.status === 401 && !authStore.isAuthenticated) {
          reject('For security reasons, your session finished.');
          authStore.finishSession();
          router.replace('/');
        } else {
          const feedback = error.response?.data?.message || error.response?.data || error.message || error;
          reject(feedback);
        }
      })
    )
  }

  return { activeTheme, updateUser, deleteUser, setActiveTheme };
});
