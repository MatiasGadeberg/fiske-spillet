import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { BoatInfo, Boats, FishInventory, TeamInfo } from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'

export const useTeamStore = defineStore('team', () => {
  const store = useFirestoreStore()
  const teamName = ref('')
  const teamCategory = ref('')
  const teamId = ref('')
  const activeLogins = ref(0)
  const points = ref(0)
  const boatInventory: Ref<BoatInfo[]> = ref([])
  const fishInventory: Ref<FishInventory> = ref({})
  const selectedBoat: Ref<string | null> = ref(null)

  const updateTeamData = (teamInfo: TeamInfo): void => {
    teamName.value = teamInfo.teamName
    activeLogins.value = teamInfo.activeLogins
    fishInventory.value = teamInfo.fish
    points.value = teamInfo.points
    teamCategory.value = teamInfo.category
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
      store.sendBoat(boat.boatId, boat.type, fishAreaNumber, startTime, teamId.value)
      selectedBoat.value = null
    }
  }

  const subscribeToTeamData = (login: string): void => {
    teamId.value = login
    store.subscribe('teams', login, (doc) => {
      updateTeamData(doc.data() as TeamInfo)
    })
  }

  const subscribeToTeamBoatData = (): void => {
    store.getTeamBoatData(teamId.value, handleBoatData)
  }

  const handleBoatData = (boats: BoatInfo[]) => {
    boatInventory.value = boats.sort((a, b) => a.endTime - b.endTime)
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
    teamName,
    activeLogins,
    teamCategory,
    teamId,
    selectedBoat,
    boatInventory,
    fishInventory
  }
})
