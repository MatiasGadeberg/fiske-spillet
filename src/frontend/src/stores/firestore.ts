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

  const getTeamData = async (teamName: string) => {
    const team = await firestore.getTeamData(teamName)
    if (team.exists()) {
      return team.data() as { points: number; password: string }
    } else {
      return null
    }
  }

  const createTeam = async (teamName: string, teamdData: { points: number; password: string }) => {
    await firestore.setTeam(teamName, teamdData)
  }

  const joinGame = () => {
    console.log('test')
  }

  return {
    subscribe,
    joinGame,
    getTeamData,
    createTeam
  }
})
