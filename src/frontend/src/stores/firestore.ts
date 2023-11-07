import { ref } from 'vue'
import { defineStore } from 'pinia'
import { FirebaseWrapper } from '../../../shared/classes/FirebaseWrapper'
import type { DocumentSnapshot } from 'firebase/firestore'

export const useFirestoreStore = defineStore('firestore', () => {
  const firestore = new FirebaseWrapper()

  const subscribe = (
    collection: string,
    document: string,
    callback: (doc: DocumentSnapshot) => void
  ) => {
    firestore.subscribe(collection, document, callback)
  }

  const addPlayer = async (teamId: string) => {
    const team = await firestore.getTeamData(teamId)
    if (!team.data()) {
      firestore.setTeam({
        boatInventory: [],
        currentActivePlayers: 1,
        fishInventory: [],
        teamId
      })
    } else {
      firestore.updateTeam({
        currentActivePlayers: team.data()!.currentActivePlayers + 1,
        teamId
      })
    }
  }

  const removePlayer = async (teamId: string) => {
    const team = await firestore.getTeamData(teamId)
    if (team.data()) {
      firestore.updateTeam({
        currentActivePlayers: team.data()!.currentActivePlayers - 1,
        teamId
      })
    }
  }

  const joinGame = () => {
    console.log('test')
  }

  return {
    subscribe,
    joinGame,
    addPlayer,
    removePlayer
  }
})
