import { defineStore } from 'pinia'
import { PreValidate, Create, Update, Delete } from '../services/userAPI'
import { useLocalStorage } from '@vueuse/core'
import { useSessionStore } from './sessionStore';
import { computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = useLocalStorage('vueUseUser', {});
  const userID = computed(() => user.value._id);

  const sessionStore = useSessionStore();
  
  const setUser = (data) => user.value = data;

  const preValidate = (body) => new Promise((resolve, reject) => PreValidate(body)
    .then(({ data }) => {
      resolve(data)})
    .catch((error) => {
      let feedback = `Your code could not be generated.\n`
      if (error.response !== undefined) feedback += error.response.data
      else feedback += error.message
      reject(feedback)
    })
  )

  const create = (data) => new Promise((resolve, reject) => Create(data)
    .then((response) => resolve(response.data))
    .catch((error) => {
      let feedback = `Your user could not be created.\n`;
      if (error.response !== undefined) feedback += error.response.data;
      else feedback += error.message;
      reject(feedback);
    })
  )

  const updateEmail = (data) => {
    return new Promise((resolve, reject) => Update(data)
      .then((response) => {
        user.value = { ...response.data };
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
      sessionStore.logout();
      resolve('Your account was deleted.');
    })
    .catch((error) => {
      let feedback = `Your user could not be deleted.\n`;
      if (error.response !== undefined) feedback += error.response.data;
      else feedback += error.message;
      reject(feedback);
    })
  )

  return { user, userID, setUser, preValidate, create, updateEmail, updatePassword, erase };
});
