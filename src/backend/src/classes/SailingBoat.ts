import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper";
import type { BoatInfo } from "../../../shared/types/GameTypes";

export type SailingBoatProps = {
    boatId: string;
    boatSpeed: number;
    store: FirebaseWrapper;
    destinationAreaNumber: number;
    startTime: number;
}

export class SailingBoat {
    private baseAreaDistance = 120;
    private baseSpeed = 10;

    private store: FirebaseWrapper
    private boatId: string;
    private arrivalTime: number;
    private startTime: number
    private travelTimeInMs: number;
    private status: BoatInfo['status']
    private cargo: BoatInfo['cargo']
    private inUse: boolean

    constructor(props: SailingBoatProps) {
        this.boatId = props.boatId;
        this.startTime = props.startTime;
        this.store = props.store;

        this.status = 'outbound';
        this.inUse = true;
        this.cargo = {};

        const travelTimeInSeconds =  props.destinationAreaNumber * (this.baseAreaDistance - this.baseSpeed * (props.boatSpeed - 1))
        this.travelTimeInMs = travelTimeInSeconds * 1000;
        this.arrivalTime = Date.now() + this.travelTimeInMs;
    }

    public async sail(){
        let timeToDestination: number | null = this.arrivalTime - this.startTime
        if (timeToDestination <= this.travelTimeInMs/2 && this.status == "outbound") { 
            this.status = 'inbound'
        } 
        if (timeToDestination <= 0) {
            this.inUse = false;
            this.status = 'docked';
            timeToDestination = null
        }

        await this.store.updateBoatData(this.boatId, {
            inUse: this.inUse,
            timeToDestinationInMs: timeToDestination,
            status: this.status,
            cargo: this.cargo
        })

        return this.inUse
    }
}
