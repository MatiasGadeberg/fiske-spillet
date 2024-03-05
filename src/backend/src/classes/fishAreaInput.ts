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
                growthRate: 0.0015,
                maxAmount: 10000,
            },
            {
                fishName: 'markrel',
                growthRate: 0.002,
                maxAmount: 5000,
            },
            {
                fishName: 'rødspætte',
                growthRate: 0.001,
                maxAmount: 15000,
            },
        ]
    },
    {
        areaNumber: 2,
        color: 500,
        fishStocks : [
            {
                fishName: 'torsk',
                growthRate: 0.0005,
                maxAmount: 5000,

            },
            {
                fishName: 'hornfisk',
                growthRate: 0.0012,
                maxAmount: 7500,

            },
            {
                fishName: 'tun',
                growthRate: 0.0015,
                maxAmount: 6000,

            },
            {
                fishName: 'markrel',
                growthRate: 0.0008,
                maxAmount: 10000,

            },
        ]
    },
    {
        areaNumber: 3,
        color: 700,
        fishStocks :  [
            {
                fishName: 'hummer',
                growthRate: 0.0005,
                maxAmount: 2000,

            },
            {
                fishName: 'tun',
                growthRate: 0.001,
                maxAmount: 10000,

            },
            {
                fishName: 'hornfisk',
                growthRate: 0.0015,
                maxAmount: 7500,

            },
        ]
    }
]
