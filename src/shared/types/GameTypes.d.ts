export type GameInfo = {
    serverTime: number;
    currentNumberOfTeams: number;
    gameState: GameState;
    timeToEndInMs: number;
    timeToStartInMs: number;
    fishMarketInfo: FishMarket;
    boatMarketInfo: BoatMarket;
    fishingAreaInfo: FishingAreaFishInfo[];
};

export type GameState = "not-started" | "active" | "ended";

export type EventData = {
    type: "sell" | "buy" | "catch";
    eventTarget: "fish" | "boat";
    teamName: string;
    fish?: {
        [fishName: string]: {
            fishAmount: number;
            fishPrice: number;
        };
    };
    boat?: {
        type: Boats;
        amount: number;
        price: number;
    };
    fishAreaName?: string;
};

type FishingAreaInfo = {
    name: string;
    waterType: "shallow" | "semi-deep" | "deep";
    distanceFromShore: number;
};

type FishBaseInfo = {
    name: string;
    foundInAreas: FishingAreaInfo[];
};

type FishMarketFishInfo = FishBaseInfo & {
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
};

export type FishMarket = {
    [fishName: string]: {
        currentPrice: number;
        growth: "positive" | "negative" | "neutral";
        supply: number;
    };
};

export type BoatMarket = {
    [boatName: string]: {
        price: number;
        cargo: number;
        speed: number;
        availableFish: string[]
    }
}

export type FishInventory = {
    [fishName: string]: {
        amount: number;
    };
};

type FishingAreaFishInfo = FishBaseInfo & {
    maxAmount: number;
    currentAmount: number;
    available: boolean;
};

export type TeamInfo = {
    points: number;
    password: string;
    boats: BoatInventoryInfo[];
    fish: FishInventory;
};

export type Boats = 'kutter' | 'fiskeskib' | 'hummerskib' | 'trawler'


export type BoatInfo = {
    teamId: string,
    type: Boats; 
    inUse: boolean;
    timeToDestinationInMs: number | null; 
    destination: string | null;
    status: 'inbound' | 'outbound' | 'docked';
    cargo: {
        [fishName: string]: {
            amount: number
        }
    }
};

type BoatInventoryInfo = BoatBaseInfo & {
    id: string;
    inUse: boolean;
    currentHealth: number;
    timeToHarborInMs: number;
};

type FishInventoryInfo = FishBaseInfo & {
    amount: number;
};
