import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BoatInfo, Boats, FishInventory, TeamInfo } from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'

export const useTeamStore = defineStore('team', () => {
  const teamId = ref('')
  const boatInventory = ref([] as BoatInfo[])
  const fishInventory = ref({} as FishInventory)
  const points = ref(0)
  const store = useFirestoreStore()

  const updateTeamData = (teamInfo: TeamInfo): void => {
    fishInventory.value = teamInfo.fish
    points.value = teamInfo.points
  }

  const subscribeToTeamData = (teamName: string): void => {
    teamId.value = teamName
    store.subscribe('teams', teamName, (doc) => {
      updateTeamData(doc.data() as TeamInfo)
    })
  }
  
  const subscribeToTeamBoatData = (): void => {
      store.getTeamBoatData(teamId.value, handleBoatData)
  }

  const handleBoatData = (boats: BoatInfo[]) => {
      boatInventory.value = boats

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
    subscribeToTeamBoatData,
    sellFish,
    buyBoat,
    points,
    teamId,
    boatInventory,
    fishInventory
  }
})
