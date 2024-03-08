import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { BoatInfo, Boats, FishInventory, TeamInfo } from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'

export const useTeamStore = defineStore('team', () => {
  const store = useFirestoreStore()
  const teamName = ref('')
  const teamLogin = ref('')
  const points = ref(0)
  const boatInventory: Ref<BoatInfo[]> = ref([])
  const fishInventory: Ref<FishInventory> = ref({})
  const selectedBoat: Ref<string | null> = ref(null)

  const updateTeamData = (teamInfo: TeamInfo): void => {
    teamName.value = teamInfo.teamName
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

  const sendBoat = (fishAreaNumber: number, startTime: number) => {
        const boat = boatInventory.value.find(boat => boat.boatId === selectedBoat.value);
      if (boat) {
          store.sendBoat(boat.boatId, boat.type, fishAreaNumber, startTime, teamLogin.value)
          selectedBoat.value = null
      }
  }

  const subscribeToTeamData = (login: string): void => {
      teamLogin.value = login
    store.subscribe('teams', login, (doc) => {
      updateTeamData(doc.data() as TeamInfo)
    })
  }
  
  const subscribeToTeamBoatData = (): void => {
      store.getTeamBoatData(teamLogin.value, handleBoatData)
  }

  const handleBoatData = (boats: BoatInfo[]) => {
      boatInventory.value = boats

  }

  const sellFish = async (fishName: string, sellingPrice: number, fishAmountToSell: number) => {
    await store.sellFish(teamLogin.value, fishName, sellingPrice, fishAmountToSell)
  }
  
  const buyBoat = async (type: Boats, amount: number, price: number) => {
    await store.buyBoat(teamLogin.value, type, amount, price)
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
    teamName,
    teamLogin,
    selectedBoat,
    boatInventory,
    fishInventory
  }
})
