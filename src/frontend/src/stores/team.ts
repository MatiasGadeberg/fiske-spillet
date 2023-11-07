import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  BoatInventoryInfo,
  FishInventoryInfo,
  GameInfo,
  TeamInfo
} from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'
import { useAuthStore } from './auth'

export const useTeamStore = defineStore('team', () => {
  const currentActivePlayers = ref(0)
  const teamId = ref('')
  const boatInventory = ref([] as BoatInventoryInfo[])
  const fishInventory = ref([] as FishInventoryInfo[])
  const store = useFirestoreStore()
  const auth = useAuthStore()

  const updateTeamData = (teamInfo: TeamInfo): void => {
    currentActivePlayers.value = teamInfo.currentActivePlayers
    boatInventory.value = teamInfo.boatInventory
    fishInventory.value = teamInfo.fishInventory
  }

  const setTeamId = (teamName: string): void => {
    teamId.value = teamName
    store.addPlayer(teamId.value)
  }

  const removePlayer = async () => {
    await store.removePlayer(teamId.value)
    auth.logout()
  }

  return {
    updateTeamData,
    currentActivePlayers,
    teamId,
    boatInventory,
    fishInventory,
    setTeamId,
    removePlayer
  }
})
