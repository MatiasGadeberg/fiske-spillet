import type { FishConstructorProps } from "./FishFactory";

export const fishConstructionInfo: FishConstructorProps[] = [
    {
        name: 'hummer',
        minPrice: 100,
        maxPrice: 400,
        startingSupply: 0,
        demand: 300
    },
    {
        name: 'torsk',
        minPrice: 80,
        maxPrice: 100,
        startingSupply: 0,
        demand: 100
    },
    {
        name: 'hornfisk',
        minPrice: 20,
        maxPrice: 150,
        startingSupply: 0,
        demand: 200
    },
    {
        name: 'rødspætte',
        minPrice: 5,
        maxPrice: 150,
        startingSupply: 0,
        demand: 200
    },
    {
        name: 'markrel',
        minPrice: 50,
        maxPrice: 175,
        startingSupply: 0,
        demand: 70
    },
    {
        name: 'tun',
        minPrice: 80,
        maxPrice: 250,
        startingSupply: 0,
        demand: 150
    }
]
