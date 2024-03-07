import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import { useFirestoreStore } from './firestore'
import { useTeamStore } from './team'
import type {
  BoatMarket,
  FishInventory,
} from '../../../shared/types/GameTypes'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const store = useFirestoreStore()
  const team = useTeamStore()
  const loginError = ref(false)
  const loginErrorMessage = ref('')

  async function login(login: string, password: string = 'test') {
    loginError.value = false
    loginErrorMessage.value = ''

    const teamData = await store.getTeamData(login)
    if (!teamData) {
      loginError.value = true
      loginErrorMessage.value = `Holdet med login ${login} eksisterer ikke`
    } else {
      if (password === teamData.password) {
        setLogin(login)
      } else {
        loginError.value = true
        loginErrorMessage.value = 'Forkert kodeord'
      }
    }
  }

  async function createTeam(login: string, password: string, repeatPassword: string) {
    loginError.value = false
    loginErrorMessage.value = ''
    if (password !== repeatPassword) {
      loginError.value = true
      loginErrorMessage.value = 'Kodeordene er ikke ens'
    }

    const teamData = await store.getTeamData(login)
    if (teamData) {
      loginError.value = true
      loginErrorMessage.value = `Holdet med login ${login} eksisterer allerede`
    } else {
      const fishInventory: FishInventory = {
          'tun': {
              amount: 0
          },
          'rødspætte': {
              amount: 0
          },
          'hornfisk': {
              amount: 0
          },
          'markrel': {
              amount: 0
          },
          'torsk': {
              amount: 0
          },
          'hummer': {
              amount: 0
          },
      }
      const boatInventory: BoatMarket[] = []
      await store.createTeam(login, {
          teamName: login,
          password,
          login,
          category: 'senior',
          points: 10000,
          fish: fishInventory,
          boats: boatInventory
      })
    
      setLogin(login)
    }
  }

  function setLogin(login: string, refresh: boolean = false) {
    isLoggedIn.value = true
    sessionStorage.setItem("loggedIn", "true")
    sessionStorage.setItem("teamName", login)
    team.subscribeToTeamData(login)
    team.subscribeToTeamBoatData()
    if (!refresh) {
        router.push('/game')
    }
  }

  const logout = () => {
    isLoggedIn.value = false
    sessionStorage.removeItem("loggedIn")
    sessionStorage.removeItem("teamName")
    router.push('/login')
  }

  return { isLoggedIn, login, setLogin, logout, createTeam, loginError, loginErrorMessage }
})
