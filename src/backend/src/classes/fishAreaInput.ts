import { FishStockProps } from "./FishStock";

export type FishAreaConstructorProps = {
    areaNumber: number;
    color: number;
    baseAreaMax: number;
    fishStocks: Omit<FishStockProps, 'areaMax'>[]
}

export const areas: FishAreaConstructorProps[] = [
    {
        areaNumber: 1,
        color: 300,
        baseAreaMax: 3000,
        fishStocks : [
            {
                fishName: 'torsk',
                growthRate: 3.5,
                percentInArea: 0.2,
            },
            {
                fishName: 'markrel',
                growthRate: 3.5,
                percentInArea: 0.4,
            },
            {
                fishName: 'rødspætte',
                growthRate: 2.5,
                percentInArea: 0.4,
            },
        ]
    },
    {
        areaNumber: 2,
        color: 500,
        baseAreaMax: 2000,
        fishStocks : [
            {
                fishName: 'torsk',
                growthRate: 3.5,
                percentInArea: 0.3,

            },
            {
                fishName: 'hornfisk',
                growthRate: 2.5,
                percentInArea: 0.2,

            },
            {
                fishName: 'tun',
                growthRate: 3,
                percentInArea: 0.2,

            },
            {
                fishName: 'markrel',
                growthRate: 3.5,
                percentInArea: 0.3,

            },
        ]
    },
    {
        areaNumber: 3,
        color: 700,
        baseAreaMax: 2000,
        fishStocks :  [
            {
                fishName: 'hummer',
                growthRate: 3,
                percentInArea: 0.2,

            },
            {
                fishName: 'tun',
                growthRate: 3,
                percentInArea: 0.4,

            },
            {
                fishName: 'hornfisk',
                growthRate: 2.5,
                percentInArea: 0.4,

            },
        ]
    }
]
