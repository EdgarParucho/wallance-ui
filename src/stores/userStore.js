import { watch } from 'vue';
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core';
import { useAuthStore } from './authStore';
import { Update, Delete, ResetPassword } from '../services/userAPI'
import { Sign } from '../services/authAPI';
import router from '../router';

export const useUserStore = defineStore('user', () => {
  const preferences = useLocalStorage("vueUsePreferences", { templates: [], queries: [], darkMode: false, FirstStepsStatus: [], language: null });
  const authStore = useAuthStore();

  const setPreferences = (preferencesValues) => preferences.value = preferencesValues;

  const updateUser = (payload) => {
    return new Promise((resolve, reject) => Update(payload)
      .then(({ data }) => {
        if (data.data?.token) authStore.refreshToken(data.data);
        resolve(data.message);
      })
      .catch((error) => {
        if (error.response?.status === 401 && !authStore.tokenIsValid) {
          reject("For security reasons, your session finished.")
          authStore.logout();
          router.replace("/")
        } else {
          const feedback = error.response?.data?.message || error.response?.data || error.message || error;
          reject(feedback);
        }
      })
    )
  }

  const deleteUser = () => new Promise((resolve, reject) => Delete()
    .then(({ data }) => {
      authStore.logout();
      resolve(data);
    })
    .catch((error) => {
      if (error.response?.status === 401 && !authStore.tokenIsValid) {
        reject("For security reasons, your session finished.")
        authStore.logout();
        router.replace("/")
      } else {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      }
    })
  )

  const resetPassword = (body) => new Promise((resolve, reject) => ResetPassword(body)
    .then(({ data }) => resolve(data))
    .catch((error) => {
      if (error.response?.status === 401 && !authStore.tokenIsValid) {
        reject("For security reasons, your session finished.")
        authStore.logout();
        router.replace("/")
      } else {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      }
    })
  )

  watch(() => preferences.value.darkMode,
    (isDarkMode) => {
      if (isDarkMode) document.querySelector("html").className =  "dark";
    }, { immediate: true }
  )

  return { preferences, updateUser, deleteUser, setPreferences, resetPassword };
});
