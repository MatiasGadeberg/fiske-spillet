import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { BoatInfo, Boats, FishInventory, TeamInfo } from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'
import { setSyntheticLeadingComments } from 'typescript'

export const useTeamStore = defineStore('team', () => {
  const store = useFirestoreStore()
  const teamId = ref('')
  const points = ref(0)
  const boatInventory: Ref<BoatInfo[]> = ref([])
  const fishInventory: Ref<FishInventory> = ref({})
  const selectedBoat: Ref<string | null> = ref(null)

  const updateTeamData = (teamInfo: TeamInfo): void => {
    fishInventory.value = teamInfo.fish
    points.value = teamInfo.points
  }

  const updateSelectedBoat = (boatId: string) => {
      if (selectedBoat.value === boatId) {
          selectedBoat.value = null
      } else {
          selectedBoat.value = boatId
      }
  }

  const sendBoat = (fishAreaNumber: number) => {
      if (selectedBoat.value) {
          store.sendBoat(selectedBoat.value, fishAreaNumber, teamId.value)
          selectedBoat.value = null
      }

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
    updateSelectedBoat,
    subscribeToTeamData,
    subscribeToTeamBoatData,
    sellFish,
    buyBoat,
    sendBoat,
    points,
    teamId,
    selectedBoat,
    boatInventory,
    fishInventory
  }
})
