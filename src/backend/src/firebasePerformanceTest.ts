import { FirebaseWrapper } from '../../shared/classes/FirebaseWrapper'
import { BoatInfo } from '../../shared/types/GameTypes';

const store = new FirebaseWrapper()

const teamIds: string[] = await store.getTeamsData().then(teams => teams.map(team => team.teamName));

const enableLogging = false;

const work = async () => {
    await store.getDockedBoatsData().then(snapshot => {
        const teamBoats = new Map();
        teamIds.forEach((id) => teamBoats.set(id, 0));
        if (enableLogging) console.log(`getDockedBoatsData`)
        snapshot.forEach(doc => {
            const boatId = doc.id
            const boat = doc.data() as BoatInfo;
            if (teamBoats.get(boat.teamId) < 2) {
                store.sendEvent<'sail'>({
                    type: 'sail',
                    teamId: boat.teamId,
                    boatId: boatId,
                    boatType: boat.type,
                    fishAreaNumber: [1, 2, 3][Math.floor(Math.random() * 3)], // This is to assign a random area with 1 being most likely, then 2 and then 3
                    startTime: Date.now()
                })
                teamBoats.set(boat.teamId, teamBoats.get(boat.teamId) + 1);
                if (enableLogging) console.log(`${boat.teamId} - sail ${boatId}`)
            }
        })
    })
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
                store.sendEvent<'sell'>({
                    type: 'sell',
                    teamId: teamId,
                    fish: fishName,
                    amount: teamData.fish[fishName].amount,
                    price: 60
                })
                if (enableLogging) console.log(`${teamId} - sellFish - ${fishName} ${teamData.fish[fishName].amount}`)
            })
        })
    )
};

setInterval(work, 1000);
