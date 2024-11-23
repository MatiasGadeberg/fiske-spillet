import * as fs from 'fs'
import { FirebaseWrapper } from '../src/shared/classes/FirebaseWrapper'

let patruljer = fs
  .readFileSync("patruljeliste.csv", { encoding: "utf-8" })
  .split("\n")
  .map((line) => line.replace("\r", ""))
  .map((line) => line.split(","))

const store = new FirebaseWrapper()

patruljer.forEach((patrulje) => createTeam(patrulje))

async function createTeam(patrulje: any) {
    const startingFish = 0;
    const startingPoints = 40000;
    if (patrulje[3]) {
        const fishInventory: any = {
            'tun': {
                amount: startingFish
            },
            'rødspætte': {
                amount: startingFish
            },
            'hornfisk': {
                amount: startingFish
            },
            'markrel': {
                amount: startingFish
            },
            'torsk': {
                amount: startingFish
            },
            'hummer': {
                amount: startingFish
            },
        }
        const boatInventory: any[] = []
        await store.setTeam(patrulje[3].toLowerCase(), {
            teamName: patrulje[1],
            activeLogins: 0,
            dbId: patrulje[0],
            password: patrulje[4].toLowerCase(),
            login: patrulje[3].toLowerCase(),
            category: patrulje[2],
            points: startingPoints,
            fish: fishInventory,
            boats: boatInventory
        })
    } else {
        return
    }
}
