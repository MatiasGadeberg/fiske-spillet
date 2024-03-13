import type { FishConstructorProps } from "./FishFactory";

export const fishConstructionInfo: FishConstructorProps[] = [
    {
        name: 'hummer',
        minPrice: 100,
        maxPrice: 400,
        startingSupply: 0,
        baseDemand: 23,
        priceChangeRate: 0.2
    },
    {
        name: 'torsk',
        minPrice: 30,
        maxPrice: 60,
        startingSupply: 0,
        baseDemand: 10,
        priceChangeRate: 1.5
    },
    {
        name: 'hornfisk',
        minPrice: 40,
        maxPrice: 120,
        startingSupply: 0,
        baseDemand: 30,
        priceChangeRate: 1
    },
    {
        name: 'rødspætte',
        minPrice: 5,
        maxPrice: 130,
        startingSupply: 0,
        baseDemand: 15,
        priceChangeRate: 0.8
    },
    {
        name: 'markrel',
        minPrice: 30,
        maxPrice: 100,
        startingSupply: 0,
        baseDemand: 30,
        priceChangeRate: 1
    },
    {
        name: 'tun',
        minPrice: 80,
        maxPrice: 200,
        startingSupply: 0,
        baseDemand: 35,
        priceChangeRate: 0.5
    }
]
