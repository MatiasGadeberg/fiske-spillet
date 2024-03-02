export type FishStockProps = {
    maxAmount: number;
    fishName: string;
    growthRate: number;
}

export class FishStock {
    public currentAmount: number
    public name: string; 

    private growthRate: number;
    private maxAmount: number;
    private baseGrowth: number 


    constructor(props: FishStockProps) {
        this.growthRate = props.growthRate;
        this.maxAmount = props.maxAmount;
        this.name = props.fishName;
        this.baseGrowth = this.maxAmount * 0.01;
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
}
