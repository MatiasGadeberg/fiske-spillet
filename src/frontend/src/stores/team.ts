import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  BoatInventoryInfo,
  FishInventoryInfo,
  GameInfo,
  TeamInfo
} from '../../../shared/types/GameTypes'

export const useTeamStore = defineStore('team', () => {
  const currentActivePlayers = ref(0)
  const teamId = ref('')
  const boatInventory = ref([] as BoatInventoryInfo[])
  const fishInventory = ref([] as FishInventoryInfo[])

  const updateTeamData = (teamInfo: TeamInfo): void => {
    currentActivePlayers.value = teamInfo.currentActivePlayers
    boatInventory.value = teamInfo.boatInventory
    fishInventory.value = teamInfo.fishInventory
  }

  const setTeamId = (teamName: string): void => {
    teamId.value = teamName
  }

  return {
    updateTeamData,
    currentActivePlayers,
    teamId,
    boatInventory,
    fishInventory,
    setTeamId
  }
})
