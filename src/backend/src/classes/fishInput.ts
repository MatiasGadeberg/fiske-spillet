import type { FishConstructorProps } from "./FishFactory";

export const fishConstructionInfo: FishConstructorProps[] = [
    {
        name: 'hummer',
        minPrice: 5,
        maxPrice: 40,
        startingSupply: 0,
        demand: 300
    },
    {
        name: 'torsk',
        minPrice: 5,
        maxPrice: 100,
        startingSupply: 100,
        demand: 40
    },
    {
        name: 'hornfisk',
        minPrice: 5,
        maxPrice: 100,
        startingSupply: 100,
        demand: 40
    },
    {
        name: 'rødspætte',
        minPrice: 5,
        maxPrice: 100,
        startingSupply: 100,
        demand: 4
    },
    {
        name: 'markrel',
        minPrice: 5,
        maxPrice: 100,
        startingSupply: 100,
        demand: 40
    },
    {
        name: 'tun',
        minPrice: 40,
        maxPrice: 150,
        startingSupply: 100,
        demand: 80
    }
]
