import { FirebaseWrapper } from '../../shared/classes/FirebaseWrapper'
import { FishSellEvent } from '../../shared/types/GameTypes';

const store = new FirebaseWrapper()

const args = getArgs();

await createTeams(args.teams);

async function createTeams(count: number): Promise<string[]> {
    const fishInventory: any = {
        'tun': {
            amount: 0
        },
        'rødspætte': {
            amount: 0
        },
        'hornfisk': {
            amount: 0
        },
        'markrel': {
            amount: 0
        },
        'torsk': {
            amount: 0
        },
        'hummer': {
            amount: 0
        },
    }
    const boatInventory: any[] = []
    let teamIds: string[] = [];

    for (let i = 0; i < count; i++) {
        await store.setTeam(`team${i}`, {
            teamName: `team${i}`,
            activeLogins: 0,
            password: `team${i}`,
            login: `team${i}`,
            category: 'væbner',
            points: 20000,
            fish: fishInventory,
            boats: boatInventory
        })
        teamIds.push(`team${i}`);
    }

    return teamIds;
}

function getArgs() {
    return process.argv.reduce((args, arg) => {
        // long arg
        if (arg.slice(0, 2) === "--") {
            const longArg = arg.split("=");
            const longArgFlag = longArg[0].slice(2);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === "-") {
            const flags = arg.slice(1).split("");
            flags.forEach((flag) => {
                args[flag] = true;
            });
        }
        return args;
    }, {});
}