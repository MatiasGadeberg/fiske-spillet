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

    private baseGrowthRate: number = 0.01

    constructor(props: FishStockProps) {
        this.growthRate = props.growthRate;
        this.baseMaxAmount = props.areaMax * props.percentInArea;
        this.maxAmount = this.baseMaxAmount;
        this.name = props.fishName;
        this.baseGrowth = this.maxAmount * this.baseGrowthRate;
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
            percentAvailable: this.currentAmount / this.maxAmount * 100
        }
    }

    public remove(amount: number) {
        this.currentAmount -= amount;
    }

    public updateMax(numberOfTeams: number) {
        const currentAmountPercent = this.currentAmount / this.maxAmount;
        this.maxAmount = this.baseMaxAmount * numberOfTeams;
        this.baseGrowth = this.maxAmount * this.baseGrowthRate;
        this.currentAmount = this.maxAmount * currentAmountPercent;
    }
}
