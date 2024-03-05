import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameInfo, FishMarketEntry, BoatMarket, FishAreaInfo } from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'

export const useGameStore = defineStore('game', () => {
  const currentNumberOfTeams = ref(0)
  const timeToEndInMs = ref(0)
  const timeToStartInMs = ref(0)
  const gameState = ref('')
  const servertime = ref(0)
  const timeToStartLocale = ref('')
  const timeToEndLocale = ref('')
  const fishAreas = ref<FishAreaInfo[]>([])
  const fishMarket = ref<FishMarketEntry[]>([])
  const boatMarket = ref<BoatMarket[]>([]) 
  const firestore = useFirestoreStore()

  const updateGameData = (gameInfo: GameInfo): void => {
    currentNumberOfTeams.value = gameInfo.currentNumberOfTeams
    timeToEndInMs.value = gameInfo.timeToEndInMs
    timeToStartInMs.value = gameInfo.timeToStartInMs
    gameState.value = gameInfo.gameState
    servertime.value = gameInfo.serverTime
    timeToStartLocale.value = new Date(timeToStartInMs.value).toISOString().slice(11, 19)
    timeToEndLocale.value = new Date(timeToEndInMs.value).toISOString().slice(11, 19)
    fishMarket.value = gameInfo.fishMarketInfo
    boatMarket.value = gameInfo.boatMarketInfo
    fishAreas.value = gameInfo.fishingAreaInfo
  }

  const subscribeToGameData = (): void => {
    firestore.subscribe('games', 'fiskespil', (doc) => {
      const data = doc.data() as GameInfo | undefined
      if (data) {
        updateGameData(data)
      }
    })
  }

  return {
    currentNumberOfTeams,
    timeToEndInMs,
    timeToStartInMs,
    gameState,
    timeToStartLocale,
    timeToEndLocale,
    servertime,
    fishAreas,
    fishMarket,
    boatMarket,
    subscribeToGameData
  }
})
