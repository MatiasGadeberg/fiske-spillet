import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {  GameInfo,  FishMarketEntry,  BoatMarket,  FishAreaInfo, ScoreInfo, FishMarket, BoatAndAreaInfo } from '../../../shared/types/GameTypes.js'
import { useFirestoreStore } from './firestore.js'
import router from '@/router'

export const useGameStore = defineStore('game', () => {
  const currentNumberOfTeams = ref(0)
  const timeToEndInMs = ref(0)
  const timeToStartInMs = ref(0)
  const gameState = ref('')
  const timeToStartLocale = ref('')
  const timeToEndLocale = ref('')
  const fishAreas = ref<FishAreaInfo[]>([])
  const fishMarket = ref<FishMarketEntry[]>([])
  const boatMarket = ref<BoatMarket[]>([]) 
  const store = useFirestoreStore()
  const vScores = ref<ScoreInfo[]>([])
  const sScores = ref<ScoreInfo[]>([])
  const boatPriceIncrease= 10000;

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
    timeToStartLocale.value = new Date(timeToStartInMs.value).toISOString().slice(11, 19)
    timeToEndLocale.value = new Date(timeToEndInMs.value).toISOString().slice(11, 19)
  }

  const subscribeToGameData = (): void => {
      store.firestore.subscribeToGameData((data: GameInfo) => {
          updateGameData(data)
      })
  }

  const subscribeToFishMarket = (): void => {
      store.firestore.subscribeToFishMarket((market: FishMarket) => {
          fishMarket.value = market.market
      })
  }

  const subscribeToAreaInfo = (): void => {
      store.firestore.subscribeToAreaInfo((data: BoatAndAreaInfo) => {
          boatMarket.value = data.boatMarketInfo
          fishAreas.value = data.fishingAreaInfo
      })
  }

  const subscribeToScores = (): void => {
      store.subscribeToScores((scores) => {
          vScores.value = scores.vScore.sort((a, b) => b.points - a.points)
          sScores.value = scores.sScore.sort((a, b) => b.points - a.points)

      })
  }

  const getImageUrl = (type: 'boat' | 'fish', name: string) => {
      const path = `../../${type}Images/${name}.svg`

      return new URL(path , import.meta.url).toString()
  }


  return {
    subscribeToScores,
    subscribeToGameData,
    subscribeToFishMarket,
    subscribeToAreaInfo,
    currentNumberOfTeams,
    timeToEndInMs,
    timeToStartInMs,
    gameState,
    getImageUrl,
    timeToStartLocale,
    timeToEndLocale,
    fishAreas,
    fishMarket,
    boatMarket,
    vScores,
    sScores,
    boatPriceIncrease
  }
})
