import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import { useFirestoreStore } from './firestore'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const store = useFirestoreStore()
  const loginError = ref(false)
  const loginErrorMessage = ref('')

  async function login(teamName: string, password: string = 'test') {
    loginError.value = false
    loginErrorMessage.value = ''

    const teamData = await store.getTeamData(teamName)
    if (!teamData) {
      loginError.value = true
      loginErrorMessage.value = `Holdet med navn ${teamName} eksisterer ikke`
    } else {
      if (password === teamData.password) {
        setLogin()
      } else {
        loginError.value = true
        loginErrorMessage.value = 'Forkert kodeord'
      }
    }
  }

  async function createTeam(teamName: string, password: string, repeatPassword: string) {
    loginError.value = false
    loginErrorMessage.value = ''
    if (password !== repeatPassword) {
      loginError.value = true
      loginErrorMessage.value = 'Kodeordene er ikke ens'
    }

    const teamData = await store.getTeamData(teamName)
    if (teamData) {
      loginError.value = true
      loginErrorMessage.value = `Holdet med navn ${teamName} eksisterer allerede`
    } else {
      await store.createTeam(teamName, {
        password,
        points: 0
      })
      setLogin()
    }
  }

  function setLogin() {
    isLoggedIn.value = true
    router.push('/')
  }

  const logout = () => {
    isLoggedIn.value = false
    router.push('/login')
  }

  return { isLoggedIn, login, logout, createTeam, loginError, loginErrorMessage }
})
