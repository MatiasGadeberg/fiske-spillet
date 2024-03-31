import { FirebaseWrapper } from '../../shared/classes/FirebaseWrapper'
import { BoatInfo, EventData } from '../../shared/types/GameTypes';

const store = new FirebaseWrapper()

const teamIds: string[] = await store.getTeamsData().then(teams => teams.map(team => team.teamName));

const enableLogging = false;

const work = async () => {
    await Promise.all(
        teamIds.map(async (teamId) => {
            const teamData = await store.getTeamData(teamId);
            const boatPrice = 20000 * (1 + Math.floor(teamData.boats.length / 5) * 0.2);
            if (teamData.points >= boatPrice) {
                store.sendEvent<'buy'>({
                    type: 'buy',
                    teamId,
                    boatType: 'kutter',
                    amount: 1,
                    price: boatPrice
                });
                if (enableLogging) console.log(`${teamId} - buyBoat`)
            }
            Object.keys(teamData.fish).filter(key => teamData.fish[key].amount > 0).forEach((fishName) => {
                const fish: EventData<'sell'>['fish'] = {}
                fish[fishName] = {
                    fishAmount: teamData.fish[fishName].amount,
                    fishPrice: 60
                }
                store.sendEvent<'sell'>({
                    type: 'sell',
                    teamId: teamId,
                    fish: fish
                })
                if (enableLogging) console.log(`${teamId} - sellFish - ${fishName} ${fish[fishName]['fishAmount']}`)
            })
            await store.getTeamBoatsData(teamId).then(snapshot => {
                if (enableLogging) console.log(`${teamId} getTeamBoatsData`)
                snapshot.forEach(doc => {
                    const boatId = doc.id
                    const boat = doc.data() as BoatInfo;
                    if (boat.status == 'docked') {
                        store.sendEvent<'sail'>({
                            type: 'sail',
                            teamId: teamId,
                            boatId: boatId,
                            boatType: boat.type,
                            fishAreaNumber: [1, 1, 1, 2, 2, 3][Math.floor(Math.random() * 6)], // This is to assign a random area with 1 being most likely, then 2 and then 3
                            startTime: Date.now()
                        })
                        if (enableLogging) console.log(`${teamId} - sail ${boatId}`)
                    }
                })
            })
        })
    )
};

setInterval(work, 4000);
