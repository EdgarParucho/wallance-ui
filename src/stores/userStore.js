import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('users', () => {
  const users = ref([
    { email: 'edpn@gmail.com', password: 'anepicsong' },
    { email: 'clara@enterprenours.com', password: 'supersecret' }
  ])
  const session = ref({})

  function tryLogin(credentials) {
   const loginStatus = (succeed, feedback) => { return { succeed, feedback } }
    const userQueryResult = users.value.find(user => user.email === credentials.email)
    if(userQueryResult === undefined) return loginStatus(false, 'The email you provided is not registered. Please check for any typo or sign up.')
    if(userQueryResult.password !== credentials.password) return loginStatus(false, 'The password provided is incorrect. Please check for any typo and try again.')
    session.value = userQueryResult
    return loginStatus(true, 'Your session is ready')
  }

  return { tryLogin }
})