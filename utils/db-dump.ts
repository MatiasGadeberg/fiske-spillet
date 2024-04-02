import * as fs from 'fs'
import { FirebaseWrapper } from '../src/shared/classes/FirebaseWrapper'
import { TeamInfo } from '../src/shared/types/GameTypes';

const store = new FirebaseWrapper();

dumpDb();

async function dumpDb() {
    const teams: TeamInfo[] = await store.getTeamsData();
    const csvData = ['id, patruljenavn, patruljetype, point', ...teams.map((team) => {
        return `${team.dbId}, ${team.teamName}, ${team.category}, ${team.points}`
    })].join('\n')

    fs.writeFile('db-dump.csv', '\uFEFF' + csvData, 'utf8', (err) => {
        if (err) {
            console.log('Error during file write')
        } else {
            console.log('Successfully created file db-dump.csv')
        }
    });
}

