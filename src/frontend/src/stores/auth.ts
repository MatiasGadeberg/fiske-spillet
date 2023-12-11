import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import { useFirestoreStore } from './firestore'
import { pbkdf2Sync } from 'crypto'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const store = useFirestoreStore()
  const loginError = ref(false)
  const loginErrorMessage = ref('')

  async function login(teamName: string, password: string = 'test') {
    loginError.value = false
    loginErrorMessage.value = ''

    try {
      const teamData = await store.getTeamData(teamName)
      const hash = hashPassword(password, teamData.salt)
      if (hash === teamData.password) {
        setLogin()
      }
    } catch (error: any) {
      loginError.value = true
      loginErrorMessage.value = error
    }
  }

  async function createTeam(teamName: string, password: string, repeatPassword: string) {
    loginError.value = false
    loginErrorMessage.value = ''
    if (password !== repeatPassword) {
      loginError.value = true
      loginErrorMessage.value = 'Passwords do not match'
    }

    const teamData = await store.getTeamData(teamName)
    if (teamData) {
        loginError.value = true
        loginErrorMessage.value = `Team with name ${teamName} already exists`
    } else {
        const salt = Date.now().toString()
        const hash = hashPassword(password, salt)
        await store.createTeam(teamName, {
            password: hash,
            salt,
            points: 0
        })
        setLogin()
    }
  }

  function hashPassword(password: string, salt: string): string {
    return pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
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
