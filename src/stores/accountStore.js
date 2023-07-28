import { defineStore } from 'pinia'
import { Update, Delete } from '../services/accountAPI'
import { useCredentialStore } from './credentialStore';

export const useAccountStore = defineStore('account', () => {
  
  const credentialStore = useCredentialStore();

  const updateEmail = (data) => {
    return new Promise((resolve, reject) => Update(data)
      .then(() => {
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

  return { updateEmail, updatePassword, erase };
});
