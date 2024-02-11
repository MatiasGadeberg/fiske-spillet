import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BoatInventoryInfo, Boats, FishInventory, TeamInfo } from '../../../shared/types/GameTypes'
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
      updateTeamData(doc.data() as TeamInfo)
    })
  }

  const sellFish = async (fishName: string, sellingPrice: number, fishAmountToSell: number) => {
    await store.sellFish(teamId.value, fishName, sellingPrice, fishAmountToSell)
  }
  
  const buyBoat = async (type: Boats, amount: number, price: number) => {
    await store.buyBoat(teamId.value, type, amount, price)
  }

  return {
    updateTeamData,
    subscribeToTeamData,
    sellFish,
    buyBoat,
    points,
    teamId,
    boatInventory,
    fishInventory
  }
})
