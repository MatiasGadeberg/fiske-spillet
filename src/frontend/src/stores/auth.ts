import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMqttStore } from '@/stores/mqtt'
import router from '@/router'
import { useTeamStore } from './team'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const mqtt = useMqttStore()
  const team = useTeamStore()

  function login(username: string, password: string = 'test') {
    console.log(`user ${username} logging in with password ${password}`)
    if (username) {
      isLoggedIn.value = true
      team.setTeamId(username)
      mqtt.connect()
      mqtt.publishPlayerJoined()

      router.push('/')
    }
  }

  return { isLoggedIn, login }
})
