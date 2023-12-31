import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameInfo } from '../../../shared/types/GameTypes'
import { useFirestoreStore } from './firestore'

export const useGameStore = defineStore('game', () => {
  const currentNumberOfTeams = ref(0)
  const timeToEndInMs = ref(0)
  const timeToStartInMs = ref(0)
  const gameState = ref('')
  const servertime = ref(0)
  const firestore = useFirestoreStore()

  const updateGameData = (gameInfo: GameInfo): void => {
    currentNumberOfTeams.value = gameInfo.currentNumberOfTeams
    timeToEndInMs.value = gameInfo.timeToEndInMs
    timeToStartInMs.value = gameInfo.timeToStartInMs
    gameState.value = gameInfo.gameState
    servertime.value = gameInfo.serverTime
  }

  firestore.subscribe('games', 'fiskespil', (doc) => {
    const data = doc.data() as GameInfo | undefined
    if (data) {
      updateGameData(data)
    }
  })

  return {
    currentNumberOfTeams,
    timeToEndInMs,
    timeToStartInMs,
    gameState,
    servertime
  }
})
