import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper.js";
import type { FishSellEvent } from "../../../shared/types/GameTypes.js";
import { FishConstructorProps, createFish } from "./FishFactory.js";
import { Fish } from "./Fish.js";

export type FishSellEventProcessorProps = {
    store: FirebaseWrapper;
    fishInput: FishConstructorProps[];
}
export class FishSellEventProcessor{
    private store: FirebaseWrapper
    private fish: Fish[];

    constructor(props: FishSellEventProcessorProps) {
        this.store = props.store;
        this.fish = props.fishInput.map((fishInfo) => {
            return createFish(fishInfo)
        })
    }

    public setup() {
        this.store.subscribeToFishSellEvents(events => this.handleEvents(events));
        this.store.subscribeToNumberOfTeams((numberOfTeams) => {
            this.fish.forEach((fish) => {
                fish.updateNumberOfTeams(numberOfTeams.teams)
            })
        })
    }

    public updateState() {
        this.fish.forEach((fish) => {
            fish.updatePrice();
            fish.decaySupply();
        })
    }

    public getFishMarketInfo() {
        return {
            market: this.fish.map((fish) => fish.getFishData())
        }
    }

    private handleEvents(events: FishSellEvent[]) {
        events.forEach(event => {
             this.handleFishSellEvent(event);
        });
    }

    private async handleFishSellEvent(event: FishSellEvent) {
        const teamData = await this.store.getTeamData(event.teamId);

        const fishToSell = Object.keys(event.fish)[0];
        const fishSellAmount = event.fish[fishToSell].fishAmount;
        const fishSellPrice = event.fish[fishToSell].fishPrice;
        const fishAvailable = teamData.fish[fishToSell].amount; 

        if (fishAvailable >= fishSellAmount) {
            teamData.fish[fishToSell].amount -= fishSellAmount;
            teamData.points += fishSellAmount * fishSellPrice
            this.addFishSupply(fishToSell, fishSellAmount);
            await this.store.updateTeamData(event.teamId, teamData);
        }
    }

    private addFishSupply(fishName: string, amount: number) {
        this.fish.forEach((fish) => {
            if (fish.name === fishName) {
                fish.addToSupply(amount)
            }
        })
    }
}
