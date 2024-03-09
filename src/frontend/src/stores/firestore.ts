import { defineStore } from 'pinia'
import { FirebaseWrapper } from '../../../shared/classes/FirebaseWrapper'
import type { DocumentSnapshot } from 'firebase/firestore'
import type { BoatInfo, Boats, EventData, ScoreInfo, TeamInfo } from '../../../shared/types/GameTypes'
import { Query, QuerySnapshot } from 'firebase/firestore/lite'

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

  const createTeam = async (teamName: string, teamData: TeamInfo) => {
    await firestore.setTeam(teamName, teamData)
  }

  const getTeamBoatData = (teamId: string, boatCallback: (boats: BoatInfo[]) => void) => {
      
      const callback = (snapshot: QuerySnapshot) => {
          const boats = snapshot.docs.map(doc => {
              const data = doc.data() as BoatInfo;
              data.boatId = doc.id
              return data
          })
          boatCallback(boats)
      }
          
      firestore.subscribeToTeamsBoatData(teamId, callback) 
    
  }

  const subscribeToScores = (callback: (scores: {vScore: ScoreInfo[]; sScore: ScoreInfo[]}) => void) => {
      firestore.subscribeToTeamsData((snapshot: QuerySnapshot) => {
          const vScore: ScoreInfo[] = []
          const sScore: ScoreInfo[] = []
          snapshot.forEach((doc) => {
              if (doc.data().category === 'senior') {
                  sScore.push({
                      teamName: doc.data().teamName,
                      points: doc.data().points
                  })
              }
              if (doc.data().category === 'væbner') {
                  vScore.push({
                      teamName: doc.data().teamName,
                      points: doc.data().points
                  })
              }
          })
          callback( {
                vScore,
                sScore
          })
      })
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

  const buyBoat = async (
    teamName: string,
    type: Boats,
    amount: number,
    price: number
  ) => {

    await firestore.sendEvent({
      type: 'buy',
      eventTarget: 'boat',
      teamName,
      boat: {
        amount,
        price,
        type,
      }
    })
  }

  const sendBoat = async (
    boatId: string,
    boatType: Boats,
    fishAreaNumber: number,
    startTime: number,
    teamName: string
  ) => {

    await firestore.sendEvent({
      type: 'sail',
      eventTarget: 'boat',
      teamName,
      boatId,
      boatType,
      fishAreaNumber,
      startTime
    })
  }

  return {
    subscribe,
    getTeamData,
    getTeamBoatData,
    createTeam,
    subscribeToScores,
    sellFish,
    buyBoat,
    sendBoat
  }
})
