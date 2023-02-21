import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('users', () => {
  const users = ref([
    { email: 'edpn@gmail.com', password: 'anepicsong' },
  ])
  const session = ref({})

  function login(credentials) {
    let queryStatus = { succeed: false, feedback: '' }
    try {
      const queryStatus = (succeed, feedback) => { return { succeed, feedback } }
      const userQueryResult = users.value.find(user => user.email === credentials.email)
      if(userQueryResult === undefined) return queryStatus(false, 'The email you provided is not registered. Please check for any typo or sign up.')
      if(userQueryResult.password !== credentials.password) return queryStatus(false, 'The password provided is incorrect. Please check for any typo and try again.')
      session.value = userQueryResult
      return queryStatus(true, 'Your session is ready')
    } catch (error) {
      console.error(error)
      queryStatus = { succeed: false, feedback: `The login process failed. ${error.message}` }
      return queryStatus
    }
  }

  return { login }
})