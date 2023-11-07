import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import { useTeamStore } from './team'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const team = useTeamStore()

  function login(username: string, password: string = 'test') {
    console.log(`user ${username} logging in with password ${password}`)
    if (username) {
      isLoggedIn.value = true
      team.setTeamId(username)

      router.push('/')
    }
  }

  const logout = () => {
    isLoggedIn.value = false
    router.push('/login')
  }

  return { isLoggedIn, login, logout }
})
