import { FirebaseWrapper } from '../../shared/classes/FirebaseWrapper'

const store = new FirebaseWrapper()

const args: any = getArgs();

await createTeams(args.teams);
store.setNumberOfTeams({teams: args.teams})

async function createTeams(count: number) {
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

    for (let i = 0; i < count; i++) {
        store.setTeam(`team${i}`, {
            teamName: `team${i}`,
            activeLogins: 0,
            password: `team${i}`,
            login: `team${i}`,
            category: 'vaebner',
            points: 20000,
            fish: fishInventory,
            boats: boatInventory
        })
    }
}

function getArgs() {
    return process.argv.reduce((args, arg) => {
        // long arg
        if (arg.slice(0, 2) === "--") {
            const longArg = arg.split("=");
            const longArgFlag: string = longArg[0].slice(2);
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
    }, {} as any);
}
