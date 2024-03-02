import { FishStockProps } from "./FishStock";

export type FishAreaConstructorProps = {
    areaNumber: number;
    color: number;
    fishStocks: FishStockProps[]
}

export const areas: FishAreaConstructorProps[] = [
    {
        areaNumber: 1,
        color: 300,
        fishStocks : [
            {
                fishName: 'torsk',
                growthRate: 0.001,
                maxAmount: 1000,
            },
            {
                fishName: 'markrel',
                growthRate: 0.001,
                maxAmount: 1000,
            },
            {
                fishName: 'rødspætte',
                growthRate: 0.001,
                maxAmount: 1000,
            },
        ]
    },
    {
        areaNumber: 2,
        color: 500,
        fishStocks : [
            {
                fishName: 'torsk',
                growthRate: 0.001,
                maxAmount: 1000,

            },
            {
                fishName: 'hornfisk',
                growthRate: 0.001,
                maxAmount: 1000,

            },
            {
                fishName: 'tun',
                growthRate: 0.001,
                maxAmount: 1000,

            },
            {
                fishName: 'markrel',
                growthRate: 0.001,
                maxAmount: 1000,

            },
        ]
    },
    {
        areaNumber: 3,
        color: 700,
        fishStocks :  [
            {
                fishName: 'hummer',
                growthRate: 0.001,
                maxAmount: 1000,

            },
            {
                fishName: 'tun',
                growthRate: 0.001,
                maxAmount: 1000,

            },
            {
                fishName: 'hornfisk',
                growthRate: 0.001,
                maxAmount: 1000,

            },
        ]
    }
]
