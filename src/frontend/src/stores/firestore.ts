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
    const team = await firestore.getTeamData(teamName)
    if (team.exists()) {
      return team.data() as { points: number; password: string }
    } else {
      return null
    }
  }

  const createTeam = async (teamName: string, teamdData: TeamInfo) => {
    await firestore.setTeam(teamName, teamdData)
  }

  const joinGame = () => {
    console.log('test')
  }

  const sellFish = (
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

    firestore.sendEvent({
      type: 'sell',
      eventTarget: 'fish',
      teamName,
      fish
    })
    console.log(
      `Selling ${fishAmountToSell} ${fishName} for team ${teamName} at a selling price of ${sellingPrice}`
    )
  }

  return {
    subscribe,
    joinGame,
    getTeamData,
    createTeam,
    sellFish
  }
})
