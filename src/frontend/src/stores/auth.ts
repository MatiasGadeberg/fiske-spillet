import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import { useFirestoreStore } from './firestore'
import { useTeamStore } from './team'
import type {
  BoatMarket,
  FishInventory,
} from '../../../shared/types/GameTypes'
import { useGameStore } from './game'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const store = useFirestoreStore()
  const team = useTeamStore();
  const game = useGameStore();
  const loginError = ref(false)
  const loginErrorMessage = ref('')

  async function login(login: string, password: string = 'test') {
    const cleanedLogin = login.trim().toLowerCase()
    const cleanedPassword = password.trim().toLowerCase()
    loginError.value = false
    loginErrorMessage.value = ''

    const teamData = await store.getTeamData(cleanedLogin)
    if (!teamData) {
      loginError.value = true
      loginErrorMessage.value = `Holdet med login ${login} eksisterer ikke`
    } else {
      if (cleanedPassword === teamData.password) {
        setLogin(login)
      } else {
        loginError.value = true
        loginErrorMessage.value = 'Forkert kodeord'
      }
    }
  }

  async function createTeam(login: string, password: string, repeatPassword: string) {
    const cleanedLogin = login.trim().toLowerCase()
    const cleanedPassword = password.trim().toLowerCase()
    const cleanedRepeatPassword = repeatPassword.trim().toLowerCase()
    loginError.value = false
    loginErrorMessage.value = ''
    if (cleanedPassword !== cleanedRepeatPassword) {
      loginError.value = true
      loginErrorMessage.value = 'Kodeordene er ikke ens'
    }

    const teamData = await store.getTeamData(cleanedLogin)
    if (teamData) {
      loginError.value = true
      loginErrorMessage.value = `Holdet med login ${cleanedLogin} eksisterer allerede`
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
      await store.createTeam(cleanedLogin, {
          teamName: login,
          activeLogins: 0,
          password: cleanedPassword,
          login: cleanedLogin,
          category: 'senior',
          points: 20000,
          fish: fishInventory,
          boats: boatInventory
      })
    
      setLogin(cleanedLogin)
    }
  }

  function setLogin(login: string, refresh: boolean = false) {
    const cleanedLogin = login.trim().toLowerCase()
    isLoggedIn.value = true
    sessionStorage.setItem("loggedIn", "true")
    sessionStorage.setItem("teamName", cleanedLogin)
    team.subscribeToTeamData(cleanedLogin)
    team.subscribeToTeamBoatData()
    if (!refresh) {
        store.login(cleanedLogin);
        if (game.gameState === 'active') {
            router.push('/game/fish')
        } else if ( game.gameState === 'not-started') {
            router.push('/pre-game')
        } else {
            router.push('/post-game')
        }
    }
  }

  const logout = async () => {
    isLoggedIn.value = false
    const teamId = sessionStorage.getItem("teamName")
    if (teamId) await store.logout(teamId)
    sessionStorage.removeItem("loggedIn")
    sessionStorage.removeItem("teamName")
    router.push('/login')
  }

  return { isLoggedIn, login, setLogin, logout, createTeam, loginError, loginErrorMessage }
})
