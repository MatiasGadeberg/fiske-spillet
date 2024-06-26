import { defineStore } from 'pinia'
import { FirebaseWrapper } from '../../../shared/classes/FirebaseWrapper'
import type { DocumentSnapshot } from 'firebase/firestore'
import type { BoatInfo, Boats, ScoreInfo, TeamInfo, EventData } from '../../../shared/types/GameTypes'
import { QuerySnapshot } from 'firebase/firestore/lite'

export const useFirestoreStore = defineStore('firestore', () => {
  const firestore = new FirebaseWrapper()

  const subscribe = (
    collection: string,
    document: string,
    callback: (doc: DocumentSnapshot) => void
  ) => {
    firestore.subscribe(collection, document, callback)
  }

  const login = async (teamId: string) => {
      await firestore.sendEvent<'login'>({
          type: "login",
          teamId,
      })
  }

  const logout = async (teamId: string) => {
      await firestore.sendEvent<'logout'>({
          type: "logout",
          teamId,
      })
  }

  const getTeamData = async (teamId: string) => {
    return await firestore.getTeamData(teamId)
  }

  const createTeam = async (teamId: string, teamData: TeamInfo) => {
    await firestore.setTeam(teamId, teamData)
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
              if (doc.data().category === 'vaebner') {
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
    teamId: string,
    fish: string,
    price: number,
    amount: number
  ) => {
    // firestore sendevent

    await firestore.sendEvent<'sell'>({
      type: 'sell',
      teamId,
      fish,
      price,
      amount
    })
  }

  const buyBoat = async (
    teamId: string,
    type: Boats,
    amount: number,
    price: number
  ) => {

    await firestore.sendEvent<'buy'>({
      type: 'buy',
      teamId,
      boatType: type,
      amount,
      price
    })
  }

  const sendBoat = async (
    boatId: string,
    boatType: Boats,
    fishAreaNumber: number,
    startTime: number,
    teamId: string
  ) => {

    await firestore.sendEvent<'sail'>({
      type: 'sail',
      teamId,
      boatId,
      boatType,
      fishAreaNumber,
      startTime
    })
  }

  return {
    subscribe,
    firestore,
    login,
    logout,
    getTeamData,
    getTeamBoatData,
    createTeam,
    subscribeToScores,
    sellFish,
    buyBoat,
    sendBoat
  }
})
