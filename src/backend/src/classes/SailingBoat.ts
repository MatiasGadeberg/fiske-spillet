import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper";
import type { BoatInfo } from "../../../shared/types/GameTypes";

export type SailingBoatProps = {
    boatId: string;
    teamId: string;
    boatSpeed: number;
    cargoLevel: number;
    availableFish: string[];
    store: FirebaseWrapper;
    destinationAreaNumber: number;
    startTime: number;
}

export class SailingBoat {
    public destination: number | null;
    public availableFish: string[];

    private baseAreaDistance = 120;
    private baseSpeed = 10;
    private baseCargoSize = 50;

    private store: FirebaseWrapper
    private boatId: string;
    private teamId: string;
    private arrivalTime: number;
    private travelTimeInMs: number;
    private status: BoatInfo['status']
    private cargo: BoatInfo['cargo']
    private inUse: boolean
    private cargoSize: number;

    constructor(props: SailingBoatProps) {
        this.boatId = props.boatId;
        this.teamId = props.teamId;
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
        let timeToDestination: number = this.arrivalTime - Date.now()
        let catchEvent = false
        if (timeToDestination <= this.travelTimeInMs/2 && this.status == "outbound") { 
            this.status = 'inbound'
            catchEvent = true
        } 
        if (timeToDestination <= 0) {
            await this.handleStoreFishEvent();
            this.inUse = false;
            this.status = 'docked';
            timeToDestination = 0;
            this.cargo = []
            this.destination = null;
        }

        await this.store.updateBoatData(this.boatId, {
            inUse: this.inUse,
            timeToDestinationInMs: timeToDestination,
            status: this.status,
            cargo: this.cargo,
            destination: this.destination
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
        const teamData = await this.store.getTeamData(this.teamId);
        this.cargo.forEach((fish) => teamData.fish[fish.name].amount += fish.amount)
        await this.store.updateTeamData(this.teamId, teamData);
    }
}
