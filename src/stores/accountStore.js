import { defineStore } from 'pinia'
import { Update, Delete } from '../services/accountAPI'
import { useCredentialStore } from './credentialStore';
import { useLocalStorage } from '@vueuse/core';
import { watch } from 'vue';

export const useAccountStore = defineStore('account', () => {
  const preferences = useLocalStorage("vueUsePreferences", {})
  const credentialStore = useCredentialStore();

  const setPreferences = (preferencesValues) => preferences.value = preferencesValues;
  const updateAccount = (data) => {
    return new Promise((resolve, reject) => Update({ ...data, token: credentialStore.credential.token })
      .then(() => {
        resolve('Account updated successfully');
      })
      .catch((error) => {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      })
    )
  }

  const erase = (data) => new Promise((resolve, reject) => Delete({ ...data, token: credentialStore.credential.token })
    .then(() => {
      credentialStore.logout();
      resolve('Your account was deleted.');
    })
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

  return { preferences, updateAccount, erase, setPreferences };
});
