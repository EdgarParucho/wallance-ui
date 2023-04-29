import { defineStore } from 'pinia'
import { Login, GetOTP, Create, UpdateEmail, UpdatePassword, DeleteAccount } from '../services/userAPI'
import { useLocalStorage } from '@vueuse/core'
import { useFundStore } from './fundStore';

export const useUserStore = defineStore('user', () => {
  const session = useLocalStorage('vueUseUser', { user: {}, token: null })
  const fundStore = useFundStore()

  async function login(credentials) {
    try {
      const response = await Login(credentials)
      const feedback = { message: 'You are logged in.', succeed: true }
      const [user] = response.data
      session.value.user = user
      return feedback
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not log in.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }
  
  function logout() {
    try {
      session.value = { user: {}, token: null }
      fundStore.funds = []
      return 'Your session finished.'
    } catch (error) {
      console.error(error);
      const feedback = {
        message: 'Could not log out.\n',
        succeed: false
      }
      if (error.response !== undefined) feedback.message += error.response.data
      else feedback.message += error.message
      return feedback 
    }
  }
  
  const newPromise = (Service, arg, mutation, pastVerb) => {
    return new Promise((resolve, reject) => {
      Service(arg)
        .then((response) => {
          const { data } = response
          mutation(data)
        })
        .then(() => {
          resolve(`Your account was ${pastVerb}.`)
        })
        .catch((error) => {
          let feedback = `Your account could not be ${pastVerb}.\n`
          if (error.response !== undefined) feedback += error.response.data
          else feedback += error.message
          reject(feedback)
        })
    })
  }

  function requestOTP(email) {
    return new Promise((resolve, reject) => {
      GetOTP(email)
        .then(() => resolve('A code was generated and sent to the provided email.'))
        .catch((error) => {
          let feedback = `Your code could not be generated.\n`
          if (error.response !== undefined) feedback += error.response.data
          else feedback += error.message
          reject(feedback)
        })
    })
  }

  function sign(credentials) {
    const Service = Create
    const arg = credentials
    const mutation = (data) => {
      const { user, token } = data
      session.value.user = user
      session.value.token = token
    }
    const pastVerb = 'created'
    return newPromise(Service, arg, mutation, pastVerb)
  }

  function updateEmail(data) {
    const Service = UpdateEmail
    const arg = data
    const mutation = (response) => {
      const { email } = response
      session.value.user.email = email
    }
    const pastVerb = 'updated'
    return newPromise(Service, arg, mutation, pastVerb)
  }

  function updatePassword(data) {
    return new Promise((resolve, reject) => {
      UpdatePassword(data)
        .then(() => resolve('Your password was updated'))
        .catch((error) => {
          let feedback = 'Your password could not be updated.\n'
          if (error.response !== undefined) feedback += error.response.data
          else feedback += error.message
          reject(feedback)
        })
    })
  }

  function deleteAccount(data) {
    const Service = DeleteAccount
    const arg = data
    const mutation = () => {
      session.value = { user: {}, token: null }
      fundStore.funds = []
    }
    const pastVerb = 'deleted'
    return newPromise(Service, arg, mutation, pastVerb)
  }
  

  return { session, login, requestOTP, sign, updatePassword, updateEmail, logout, deleteAccount };
});
