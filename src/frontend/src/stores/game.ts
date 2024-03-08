import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {  GameInfo,  FishMarketEntry,  BoatMarket,  FishAreaInfo, ScoreInfo } from '../../../shared/types/GameTypes.js'
import { useFirestoreStore } from './firestore'
import router from '@/router'

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
  const vScore = ref<ScoreInfo[]>([])
  const sScore = ref<ScoreInfo[]>([])

  const updateGameData = (gameInfo: GameInfo): void => {
      if (gameState.value !== gameInfo.gameState) {
          if (gameInfo.gameState === "not-started") {
              router.push('/pre-game')
          }
          if (gameInfo.gameState === "active") {
              router.push('/game/fish')
          }
          if (gameInfo.gameState === "ended") {
              router.push('/post-game')
          }
      }
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

  const getImageUrl = (type: 'boat' | 'fish', name: string) => {
      const path = `../../${type}Images/${name}.svg`

      return new URL(path , import.meta.url).toString()
  }


  return {
    currentNumberOfTeams,
    timeToEndInMs,
    timeToStartInMs,
    gameState,
    getImageUrl,
    timeToStartLocale,
    timeToEndLocale,
    servertime,
    fishAreas,
    fishMarket,
    boatMarket,
    subscribeToGameData
  }
})
