import { Fish } from './Fish.js'

export type FishConstructorProps = {
    name: string;
    startingSupply: number;
    minPrice: number;
    maxPrice: number;
    demand: number;
}

export function createFish(props: FishConstructorProps) {
    const demandFunction = createDemandFunction(props.demand)
    const priceCalculator = createPriceCalculator(props.minPrice, props.maxPrice, demandFunction) 
    return new Fish({
        name: props.name,
        startingSupply: props.startingSupply,
        decayFunction: createDecayFunction(),
        priceCalculator,
        startingPrice: props.maxPrice/2
    })
}

function createDecayFunction() {
    return function(supply: number) {
        return Math.max(supply * 0.98, 0)
    }
}


function createDemandFunction(demand: FishConstructorProps["demand"]) {
    return function(supply: number) {
        if (!supply) {
            return demand
        } else {
            return demand
        }
    }
}

function createPriceCalculator(minPrice: number, maxPrice: number, demandFunction: (supply: number) => number) {
    return function(supply: number, currentPrice: number) {

        let calculatedPrice: number;
        if (supply === 0) {
            calculatedPrice = maxPrice
        } else if (demandFunction(supply) > supply) {
            calculatedPrice = currentPrice * 1.005
        } else {
            calculatedPrice = currentPrice * 0.995
        }

        return Math.max(Math.min(calculatedPrice, maxPrice), minPrice); 
    }
}

