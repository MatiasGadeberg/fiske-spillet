import { Fish } from './Fish.js'

export type FishConstructorProps = {
    name: string;
    startingSupply: number;
    minPrice: number;
    maxPrice: number;
    baseDemand: number;
    priceChangeRate: number;
}

export function createFish(props: FishConstructorProps) {
    const demandFunction = createDemandFunction(props.baseDemand)
    const priceCalculator = createPriceCalculator(
        props.minPrice, 
        props.maxPrice, 
        props.priceChangeRate, 
        demandFunction
    ) 
    return new Fish({
        name: props.name,
        startingSupply: props.startingSupply,
        decayFunction: createDecayFunction(demandFunction),
        priceCalculator,
        startingPrice: props.maxPrice/2
    })
}

function createDecayFunction( demandFunction: (supply: number, numberOfTeams: number) => number) {
    return function(supply: number, numberOfTeams: number) {
        return Math.max(supply - demandFunction(supply, numberOfTeams), 0)
    }
}


function createDemandFunction(baseDemand: FishConstructorProps["baseDemand"]) {
    return function(supply: number, numberOfTeams: number) {
        if (!supply) {
            return baseDemand * numberOfTeams;
        } else {
            return baseDemand * numberOfTeams
        }
    }
}

function createPriceCalculator(
        minPrice: number, 
        maxPrice: number, 
        priceChangeRate: number, 
        demandFunction: (supply: number, numberOfTeams: number) => number
) {
    return function(supply: number, currentPrice: number, numberOfTeams: number) {

        let calculatedPrice: number;
        if (demandFunction(supply, numberOfTeams) > supply) {
            calculatedPrice = currentPrice * (1 + priceChangeRate/100)
        } else {
            calculatedPrice = currentPrice * (1 - priceChangeRate/100)
        }

        return Math.max(Math.min(calculatedPrice, maxPrice), minPrice); 
    }
}

