import { FishStock, FishStockProps } from "./FishStock";

export type FishAreaProps = {
    areaNumber: number;
    color: number;
    fishStockInput: FishStockProps[]
};

export class FishArea {
    private areaNumber: number;
    private color: number;
    private fishStocks: FishStock[]

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
}
