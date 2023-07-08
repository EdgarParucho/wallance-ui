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
        let feedback = `Your email could not be updated.\n`;
        if (error.response !== undefined) feedback += error.response.data;
        else feedback += error.message;
        reject(feedback);
      })
  )}

  const updatePassword = (data) => {
    return new Promise((resolve, reject) => Update(data)
      .then(() => {
        resolve('Password updated successfully');
      })
      .catch((error) => {
        let feedback = `Your password could not be updated.\n`;
        if (error.response !== undefined) feedback += error.response.data;
        else feedback += error.message;
        reject(feedback);
      })
    )}

  const erase = (data) => new Promise((resolve, reject) => Delete(data)
    .then(() => {
      credentialStore.logout();
      resolve('Your account was deleted.');
    })
    .catch((error) => {
      let feedback = `Your account could not be deleted.\n`;
      if (error.response !== undefined) feedback += error.response.data;
      else feedback += error.message;
      reject(feedback);
    })
  )

  return { account, setUser, updateEmail, updatePassword, erase };
});
