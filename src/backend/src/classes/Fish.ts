import { FishMarketEntry } from "../../../shared/types/GameTypes";

export type FishProps = {
    name: string;
    startingSupply: number;
    startingPrice: number;
    decayFunction: (supply: number, numberOfTeams: number) => number;
    priceCalculator: (supply: number, currentPrice: number, numberOfTeams: number) => number
}

export class Fish {
    public name: string;
    
    private supply: number;
    private price: number;
    private decayFunction: (supply: number, numberOfTeams: number) => number
    private priceCalculator: (supply: number, currentPrice: number, numberOfTeams: number) => number
    private growth: 'positive' | 'negative' | 'neutral'
    private numberOfTeams: number

    constructor(props: FishProps) {
        this.name = props.name;
        this.supply = props.startingSupply;
        this.price = props.startingPrice;
        this.growth = 'neutral'
        this.numberOfTeams = 0;
        this.decayFunction = props.decayFunction;
        this.priceCalculator = props.priceCalculator;
    }

    public updateNumberOfTeams(numberOfTeams: number) {
        this.numberOfTeams = numberOfTeams;
    }

    public addToSupply(amount: number) {
        this.supply += amount;
    }

    public getFishData(): FishMarketEntry {
        return {
            name: this.name,
            currentPrice: this.price,
            growth: this.growth,
            supply: this.supply
        }
    }

    public updatePrice() {
        const updatedPrice = this.priceCalculator(this.supply, this.price, this.numberOfTeams);
        this.growth = this.determineGrowth(updatedPrice, this.price);
        this.price = updatedPrice 
    }

    public decaySupply() {
        this.supply = this.decayFunction(this.supply, this.numberOfTeams)
    }

    private determineGrowth(newPrice: number, oldPrice: number) {
        if (newPrice > oldPrice) {
            return 'positive'
        } 
        if (newPrice < oldPrice) {
            return 'negative'
        } 
        return 'neutral'
    }
}

