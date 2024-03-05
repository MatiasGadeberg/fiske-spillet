import { FishStock, FishStockProps } from "./FishStock.js";

export type FishAreaProps = {
    areaNumber: number;
    color: number;
    fishStockInput: FishStockProps[]
};

export class FishArea {
    public areaNumber: number;

    private color: number;
    private fishStocks: FishStock[];

    constructor(props: FishAreaProps) {
        this.areaNumber = props.areaNumber
        this.color = props.color
        this.fishStocks = props.fishStockInput.map((input) => new FishStock(input));
    }

    public getAreaInfo() {
        return {
            areaNumber: this.areaNumber,
            color: this.color,
            fishStocks: this.fishStocks.map((stock) => stock.getStockInfo()),
        }
    }

    public growStocks() {
        this.fishStocks.forEach((stock) => stock.grow())
    }

    public getFishRatios(fishNames: string[]) {
        const stocksToCatch = this.fishStocks.filter((stock) => fishNames.includes(stock.name))
        const totalFish = stocksToCatch.reduce((total, stock) => total + stock.currentAmount, 0) 
        return stocksToCatch.map((stock) => {
            return {
                name: stock.name,
                ratio: stock.currentAmount/totalFish,
                amountAvailable: stock.currentAmount
            }
        })
    }

    public removeStock(caughtFish: {name: string; amount: number}[]) {
        this.fishStocks.forEach((stock) => {
            caughtFish.forEach((fish) => {
                if (stock.name === fish.name) {
                    stock.remove(fish.amount)
                }
            })
        })
    }

}
