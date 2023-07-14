import { defineStore } from 'pinia'
import { Update, Delete } from '../services/accountAPI'
import { useLocalStorage } from '@vueuse/core'
import { useCredentialStore } from './credentialStore';

export const useAccountStore = defineStore('account', () => {
  
  const account = useLocalStorage('vueUseUser', {});
  const credentialStore = useCredentialStore();
  const setUser = (data) => account.value = data;

  const updateEmail = (data) => {
    return new Promise((resolve, reject) => Update(data)
      .then((response) => {
        account.value = { ...response.data };
        resolve('Email updated successfully');
      })
      .catch((error) => {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      })
  )}

  const updatePassword = (data) => {
    return new Promise((resolve, reject) => Update(data)
      .then(() => {
        resolve('Password updated successfully');
      })
      .catch((error) => {
        const feedback = error.response?.data?.message || error.response?.data || error.message || error;
        reject(feedback);
      })
    )}

  const erase = (data) => new Promise((resolve, reject) => Delete(data)
    .then(() => {
      credentialStore.logout();
      resolve('Your account was deleted.');
    })
    .catch((error) => {
      const feedback = error.response?.data?.message || error.response?.data || error.message || error;
      reject(feedback);
    })
  )

  return { account, setUser, updateEmail, updatePassword, erase };
});
