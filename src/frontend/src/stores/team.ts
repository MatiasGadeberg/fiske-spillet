import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  BoatInventoryInfo,
  FishInventoryInfo,
  TeamInfo
} from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'

export const useTeamStore = defineStore('team', () => {
  const teamId = ref('')
  const boatInventory = ref([] as BoatInventoryInfo[])
  const fishInventory = ref([] as FishInventoryInfo[])
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

  return {
    updateTeamData,
    subscribeToTeamData,
    points,
    teamId,
    boatInventory,
    fishInventory
  }
})
