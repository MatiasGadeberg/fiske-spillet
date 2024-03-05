import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper";
import type { BoatInfo } from "../../../shared/types/GameTypes";

export type SailingBoatProps = {
    boatId: string;
    teamName: string;
    boatSpeed: number;
    cargoLevel: number;
    availableFish: string[];
    store: FirebaseWrapper;
    destinationAreaNumber: number;
    startTime: number;
}

export class SailingBoat {
    public destination: number;
    public availableFish: string[];

    private baseAreaDistance = 120;
    private baseSpeed = 10;
    private baseCargoSize = 80;

    private store: FirebaseWrapper
    private boatId: string;
    private teamName: string;
    private arrivalTime: number;
    private travelTimeInMs: number;
    private status: BoatInfo['status']
    private cargo: BoatInfo['cargo']
    private inUse: boolean
    private cargoSize: number;

    constructor(props: SailingBoatProps) {
        this.boatId = props.boatId;
        this.teamName = props.teamName;
        this.store = props.store;
        this.destination = props.destinationAreaNumber;
        this.availableFish = props.availableFish;

        this.status = 'outbound';
        this.inUse = true;
        this.cargo = [];
        this.cargoSize = this.baseCargoSize * props.cargoLevel;

        const travelTimeInSeconds =  props.destinationAreaNumber * (this.baseAreaDistance - this.baseSpeed * (props.boatSpeed - 1))
        this.travelTimeInMs = travelTimeInSeconds * 1000;
        this.arrivalTime = Date.now() + this.travelTimeInMs;
    }

    public async sail(){
        let timeToDestination: number | null = this.arrivalTime - Date.now()
        let catchEvent = false
        if (timeToDestination <= this.travelTimeInMs/2 && this.status == "outbound") { 
            this.status = 'inbound'
            catchEvent = true
        } 
        if (timeToDestination <= 0) {
            await this.handleStoreFishEvent();
            this.inUse = false;
            this.status = 'docked';
            timeToDestination = null
            this.cargo = []
        }

        await this.store.updateBoatData(this.boatId, {
            inUse: this.inUse,
            timeToDestinationInMs: timeToDestination,
            status: this.status,
            cargo: this.cargo
        })

        return { inUse: this.inUse, catchEvent}
    }

    public catchFish(fishRatios: {name: string; ratio: number, amountAvailable: number}[]) {
        this.cargo = fishRatios.map((fish) => {
            return {
                name: fish.name,
                amount: Math.floor(Math.min(fish.ratio * this.cargoSize, fish.amountAvailable)),
            }
        })
        return this.cargo
    }

    private async handleStoreFishEvent() {
        const teamData = await this.store.getTeamData(this.teamName);
        this.cargo.forEach((fish) => teamData.fish[fish.name].amount += fish.amount)
        await this.store.updateTeamData(this.teamName, teamData);
    }
}
