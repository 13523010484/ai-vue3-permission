import { defineStore } from 'pinia'
import { login, logout } from '@/api/user'

export const useAuthStore = defineStore('auth', {
  actions: {
    login(payload: { operCode: string; password: string }) {
      return login(payload)
    },
    logout() {
      return logout()
    },
  },
})
