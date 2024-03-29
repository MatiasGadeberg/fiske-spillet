import { FirebaseWrapper } from '../../shared/classes/FirebaseWrapper'
import { BoatInfo, FishInventory, FishSellEvent } from '../../shared/types/GameTypes';

const store = new FirebaseWrapper()

const teamIds: string[] = await store.getTeamsData().then(teams => teams.map(team => team.teamName));

const work = async () => {
    await store.getDockedBoatsData().then(snapshot => {
        console.log(`getDockedBoatsData`)
        snapshot.forEach(doc => {
            const boatId = doc.id
            const boat = doc.data() as BoatInfo;
            store.sendEvent({
                type: 'sail',
                eventTarget: 'boat',
                teamId: boat.teamId,
                boatId: boatId,
                boatType: boat.type,
                fishAreaNumber: [1, 1, 1, 1, 1, 1, 2, 2, 2, 3][Math.floor(Math.random() * 10)], // This is to assign a random area with 1 being most likely, then 2 and then 3
                startTime: Date.now()
            })
            console.log(`${boat.teamId} - sail ${boatId}`)
        })
    })
    await Promise.all(
        teamIds.map(async (teamId) => {
            const teamData = await store.getTeamData(teamId);
            const boatPrice = 20000 * (1 + Math.floor(teamData.boats.length / 5) * 0.2);
            if (teamData.points >= boatPrice) {
                store.sendEvent({
                    type: 'buy',
                    eventTarget: 'boat',
                    teamId,
                    boatType: 'kutter',
                    amount: 1,
                    price: boatPrice
                });
                console.log(`${teamId} - buyBoat`)
            }
            Object.keys(teamData.fish).filter(key => teamData.fish[key].amount > 0).forEach((fishName) => {
                const fish: FishSellEvent['fish'] = {}
                fish[fishName] = {
                    fishAmount: teamData.fish[fishName].amount,
                    fishPrice: 60
                }
                store.sendEvent({
                    type: 'sell',
                    eventTarget: 'fish',
                    teamId: teamId,
                    fish: fish
                })
                console.log(`${teamId} - sellFish - ${fishName} ${fish[fishName]['fishAmount']}`)
            })
        })
    )
};

setInterval(work, 4000);
