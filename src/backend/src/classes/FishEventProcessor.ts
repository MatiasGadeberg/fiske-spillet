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
        const sortedEvents: { [teamId: string]: EventData<'sell'>[] } = {};
        events.forEach((event) => {
            if (sortedEvents[event.teamId]) {
                sortedEvents[event.teamId].push(event)
            } else {
                sortedEvents[event.teamId] = [event]
            }
        });
        const teamsData = await Promise.all(
            Object.values(sortedEvents).map(async (teamEvents) => {
                const teamId = teamEvents[0].teamId;
                const teamData = await this.store.getTeamData(teamId);
                const eventIds: string[] = [];
                teamEvents.forEach((event) => {
                    eventIds.push(event.eventId);
                    if (teamData.fish[event.fish].amount >= event.amount) {
                        teamData.fish[event.fish].amount -= event.amount;
                        teamData.points += event.amount * event.price;
                        this.addFishSupply(event.fish, event.amount);
                    }
                });
                return {
                    teamId,
                    eventIds,
                    teamData,
                }
            })
        );
        this.store.updateTeamsData(teamsData);
    }

    private addFishSupply(fishName: string, amount: number) {
        this.fish.forEach((fish) => {
            if (fish.name === fishName) {
                fish.addToSupply(amount)
            }
        })
    }
}
