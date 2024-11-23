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
    if (patrulje[3]) {
        await store.test(patrulje[3].toLowerCase(), {
            activeLogins: 0
        })
    } else {
        return
    }
}
