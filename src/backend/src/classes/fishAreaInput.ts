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
                growthRate: 0.0015,
                percentInArea: 0.2,
            },
            {
                fishName: 'markrel',
                growthRate: 0.002,
                percentInArea: 0.4,
            },
            {
                fishName: 'rødspætte',
                growthRate: 0.001,
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
                growthRate: 0.0005,
                percentInArea: 0.3,

            },
            {
                fishName: 'hornfisk',
                growthRate: 0.0012,
                percentInArea: 0.2,

            },
            {
                fishName: 'tun',
                growthRate: 0.0015,
                percentInArea: 0.2,

            },
            {
                fishName: 'markrel',
                growthRate: 0.0008,
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
                growthRate: 0.0005,
                percentInArea: 0.2,

            },
            {
                fishName: 'tun',
                growthRate: 0.001,
                percentInArea: 0.4,

            },
            {
                fishName: 'hornfisk',
                growthRate: 0.0015,
                percentInArea: 0.4,

            },
        ]
    }
]
