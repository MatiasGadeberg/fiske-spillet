import { defineStore } from 'pinia'
import { FirebaseWrapper } from '../../../shared/classes/FirebaseWrapper'
import type { DocumentSnapshot } from 'firebase/firestore'
import type { EventData, TeamInfo } from '../../../shared/types/GameTypes'

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
    return await firestore.getTeamData(teamName)
  }

  const createTeam = async (teamName: string, teamdData: TeamInfo) => {
    await firestore.setTeam(teamName, teamdData)
  }

  const joinGame = () => {
    console.log('test')
  }

  const sellFish = async (
    teamName: string,
    fishName: string,
    sellingPrice: number,
    fishAmountToSell: number
  ) => {
    // firestore sendevent
    const fish: EventData['fish'] = {}
    fish[fishName] = {
      fishAmount: fishAmountToSell,
      fishPrice: sellingPrice
    }

    await firestore.sendEvent({
      type: 'sell',
      eventTarget: 'fish',
      teamName,
      fish
    })
  }

  return {
    subscribe,
    joinGame,
    getTeamData,
    createTeam,
    sellFish
  }
})
