import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameInfo, FishMarket, BoatMarket } from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'

export const useGameStore = defineStore('game', () => {
  const currentNumberOfTeams = ref(0)
  const timeToEndInMs = ref(0)
  const timeToStartInMs = ref(0)
  const gameState = ref('')
  const servertime = ref(0)
  const timeToStartLocale = ref('')
  const fishMarket = ref({} as FishMarket)
  const boatMarket = ref({} as BoatMarket)
  const firestore = useFirestoreStore()

  boatMarket.value = {
      'trawler': {
          price: 25000,
          cargo: 7,
          speed: 4,
          availableFish: [ 'hornfisk', 'rødspætte']
      },
      'fiskeskib': {
          price: 100000,
          cargo: 10,
          speed: 3,
          availableFish: ['torsk', 'markrel', 'hornfisk', 'rødspætte']
      },
      'hummerskib': {
          price: 50000,
          cargo: 4,
          speed: 6,
          availableFish: ['hummer']
      },
      'kutter': {
          price: 10000,
          cargo: 3,
          speed: 9,
          availableFish: ['torsk', 'markrel']
      }
  }

  const updateGameData = (gameInfo: GameInfo): void => {
    currentNumberOfTeams.value = gameInfo.currentNumberOfTeams
    timeToEndInMs.value = gameInfo.timeToEndInMs
    timeToStartInMs.value = gameInfo.timeToStartInMs
    gameState.value = gameInfo.gameState
    servertime.value = gameInfo.serverTime
    timeToStartLocale.value = new Date(timeToStartInMs.value).toISOString().slice(11, 19)
    fishMarket.value = gameInfo.fishMarketInfo
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
    servertime,
    fishMarket,
    boatMarket,
    subscribeToGameData
  }
})
