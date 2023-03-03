import { defineStore } from 'pinia'
import funds from '../../placeholders/funds.json'

export const useFundStore = defineStore('funds', () => {
  return { funds }
})