import { defineStore } from 'pinia'
import { ref } from 'vue'
import users from '../../placeholders/users.json'

export const useUserStore = defineStore('users', () => {
  const session = ref({
    userLoged: {},
    sessionToken: null }
  )

  function login({ email, password }) {
    const queryStatus = (succeed, feedback) => { return { succeed, feedback } }
    try {
      const query = users.find(user => user.email === email && user.password === password)
      if (query === undefined) throw new Error('The provided credentials does not match in the database. Please check for typos, then try again.')
      session.value.userLoged = query
      return queryStatus(true, 'Your session is ready')
    } catch (error) {
      return queryStatus(false, `The login process failed. Error: ${error.message}`)
    }
  }

  return { login, session }
})