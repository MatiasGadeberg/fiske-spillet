import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BoatInventoryInfo, FishInventory, TeamInfo } from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'

export const useTeamStore = defineStore('team', () => {
  const teamId = ref('')
  const boatInventory = ref([] as BoatInventoryInfo[])
  const fishInventory = ref({} as FishInventory)
  const points = ref(0)
  const store = useFirestoreStore()

  const updateTeamData = (teamInfo: TeamInfo): void => {
    boatInventory.value = teamInfo.boats
    fishInventory.value = teamInfo.fish
    points.value = teamInfo.points
  }

  const subscribeToTeamData = (teamName: string): void => {
    teamId.value = teamName
    store.subscribe('teams', teamName, (doc) => {
      console.log('Recieved team data:' + JSON.stringify(doc.data()))
      updateTeamData(doc.data() as TeamInfo)
    })
  }

  const sellFish = (fishName: string, sellingPrice: number, fishAmountToSell: number) => {
    store.sellFish(teamId.value, fishName, sellingPrice, fishAmountToSell)
  }

  return {
    updateTeamData,
    subscribeToTeamData,
    sellFish,
    points,
    teamId,
    boatInventory,
    fishInventory
  }
})
