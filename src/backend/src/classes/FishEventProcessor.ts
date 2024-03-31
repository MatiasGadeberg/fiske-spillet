import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper.js";
import type { EventData } from "../../../shared/types/GameTypes.js";
import { FishConstructorProps, createFish } from "./FishFactory.js";
import { Fish } from "./Fish.js";

export type FishEventProcessorProps = {
    store: FirebaseWrapper;
    fishInput: FishConstructorProps[];
}
export class FishEventProcessor{
    private store: FirebaseWrapper
    private fish: Fish[];

    constructor(props: FishEventProcessorProps) {
        this.store = props.store;
        this.fish = props.fishInput.map((fishInfo) => {
            return createFish(fishInfo)
        })
    }

    public setup() {
        this.store.subscribeToFishSellEvents(events => this.handleFishSellEvents(events));
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

    private async handleFishSellEvents(events: EventData<'sell'>[]) {
        await Promise.all(
            events.map(async (event) => {
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
                await this.store.setEventProcessed(event.eventId);
            })
        )
    }

    private addFishSupply(fishName: string, amount: number) {
        this.fish.forEach((fish) => {
            if (fish.name === fishName) {
                fish.addToSupply(amount)
            }
        })
    }
}
