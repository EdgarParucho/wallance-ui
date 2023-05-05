import { defineStore } from 'pinia'
import { Create, UpdateEmail, UpdatePassword, DeleteAccount } from '../services/userAPI'
import { Login, GetOTP } from '../services/sessionAPI'
import { useLocalStorage } from '@vueuse/core'
import { useFundStore } from './fundStore';

export const useUserStore = defineStore('user', () => {
  const session = useLocalStorage('vueUseUser', { user: {}, token: null })
  const fundStore = useFundStore()

  const mutations = {
    login: (data) => {
      const [user] = data
      session.value.user = user
      return 'Welcome'
    },
    logout: () => {
      session.value = { user: {}, token: null }
      fundStore.funds = []
      return 'Your session finished.'
    },
    sign: (data) => {
      const { user, token } = data
      session.value.user = user
      session.value.token = token
    },
    updateEmail: (data) => {
      const { email } = data
      session.value.user.email = email
    }
  }

  const useService = ({ service, data, mutation }) => new Promise((resolve, reject) => service(data)
    .then((response) => resolve(
      mutation(response.data)
    ))
    .catch((error) => {
      let feedback = 'An error was detected while operating your account.\n'
      if (error.response !== undefined) feedback += error.response.data
      else feedback += error.message
      reject(feedback)
    })
  )

  const login = (data) => useService({
    service: Login,
    data,
    mutation: mutations.login
  })

  const logout = () => mutations.logout()

  const sign = (data) => useService( {
    service: Create,
    data,
    mutation: mutations.sign
  })

  const updateEmail = (data) => useService({
    service: UpdateEmail,
    data,
    mutation: mutations.updateEmail
  })

  const updatePassword = (data) => UpdatePassword(data)
    .then(() => 'Your password was updated')
    .catch((error) => {
      let feedback = 'Your password could not be updated.\n'
      if (error.response !== undefined) feedback += error.response.data
      else feedback += error.message
      return feedback
    })

  const deleteAccount = (data) => useService({
    service: DeleteAccount,
    data,
    mutation: mutations.logout
  })

  const requestOTP = (email) => GetOTP(email)
    .then(() => 'A code was generated and sent to the provided email.')
    .catch((error) => {
      let feedback = `Your code could not be generated.\n`
      if (error.response !== undefined) feedback += error.response.data
      else feedback += error.message
      return feedback
    })

  return { session, login, requestOTP, sign, updatePassword, updateEmail, logout, deleteAccount };
});
