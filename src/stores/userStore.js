import { watch } from 'vue';
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core';

import { useAuthStore } from './authStore';
import { Update, Delete, ResetPassword } from '../services/userAPI'

export const useUserStore = defineStore('user', () => {
  const preferences = useLocalStorage("vueUsePreferences", { templates: [], queries: [], darkMode: false, FirstStepsStatus: [], language: null });
  const authStore = useAuthStore();

  const setPreferences = (preferencesValues) => preferences.value = preferencesValues;
  const updateUser = (data) => {
    return new Promise((resolve, reject) => Update({ ...data, token: authStore.auth.token })
      .then(() => {
        resolve('Account updated successfully');
      })
      .catch((error) => {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      })
    )
  }

  const deleteUser = (data) => new Promise((resolve, reject) => Delete({ ...data, token: authStore.auth.token })
    .then(() => {
      authStore.logout();
      resolve('Your account was deleted.');
    })
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  )

  const resetPassword = (body) => new Promise((resolve, reject) => ResetPassword(body)
    .then((response) => resolve(response.data))
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  )

  watch(() => preferences.value.darkMode,
    (isDarkMode) => {
      if (isDarkMode) document.querySelector("html").className =  "dark";
    }, { immediate: true }
  )

  return { preferences, updateUser, deleteUser, setPreferences, resetPassword };
});
