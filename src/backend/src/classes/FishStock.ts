export type FishStockProps = {
    percentInArea: number;
    fishName: string;
    growthRate: number;
    areaMax: number;
}

export class FishStock {
    public currentAmount: number
    public name: string; 

    private growthRate: number;
    private maxAmount: number;
    private baseMaxAmount: number;
    private baseGrowth: number;

    private baseGrowthRate: number = 0.25;

    constructor(props: FishStockProps) {
        this.growthRate = props.growthRate/100;
        this.baseMaxAmount = props.areaMax * props.percentInArea;
        this.maxAmount = this.baseMaxAmount;
        this.name = props.fishName;
        this.baseGrowth = this.maxAmount * this.baseGrowthRate/100;
        this.currentAmount = 0 //this.maxAmount;
    }

    public grow() {
        this.currentAmount += this.currentAmount * this.growthRate + this.baseGrowth
        if (this.currentAmount > this.maxAmount) {
            this.currentAmount = this.maxAmount;
        }
    }

    public getStockInfo() {
        return {
            name: this.name,
            percentAvailable: this.currentAmount / this.maxAmount * 100,
        }
    }

    public remove(amount: number) {
        this.currentAmount -= amount;
    }

    public updateMax(numberOfTeams: number) {
        const multiplier = numberOfTeams === 0 ? 1 : numberOfTeams;
        const currentAmountPercent = this.currentAmount / this.maxAmount;
        this.maxAmount = this.baseMaxAmount * multiplier;
        this.baseGrowth = this.maxAmount * this.baseGrowthRate/100;
        this.currentAmount = this.maxAmount * currentAmountPercent;
    }
}
