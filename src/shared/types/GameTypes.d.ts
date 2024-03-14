export type GameInfo = {
    currentNumberOfTeams: number;
    gameState: GameState;
    timeToEndInMs: number;
    timeToStartInMs: number;
    fishMarketInfo: FishMarketEntry[];
    boatMarketInfo: BoatMarket[];
    fishingAreaInfo: FishAreaInfo[];
};

export type GameState = "not-started" | "active" | "ended";

export type EventData = {
    type: "sell" | "buy" | "catch" | "sail" | "login" | "logout"; 
    eventTarget: "fish" | "boat" | "team" ;
    teamId: string;
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
    boatId?: string;
    boatType?: Boats;
    fishAreaNumber?: number;
    startTime?: number;
};

type FishAreaInfo = {
    areaNumber: number;
    color: number;
    fishStocks: {
        name: string;
        percentAvailable: number;
    }[];
}

type FishBaseInfo = {
    name: string;
    foundInAreas: FishingAreaInfo[];
};

type FishMarketFishInfo = FishBaseInfo & {
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
};

export type FishMarketEntry = {
    name: string;
    currentPrice: number;
    growth: "positive" | "negative" | "neutral";
    supply: number;
};

export type ScoreInfo = {
    teamName: string;
    points: number
}

export type BoatMarket = {
        type: Boats;
        price: number;
        cargo: number;
        speed: number;
        availableFish: string[]
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
    teamName: string;
    activeLogins: number;
    dbId?: number;
    points: number;
    login: string;
    password: string;
    category: 'væbner' | 'senior';
    boats: BoatInventoryInfo[];
    fish: FishInventory;
};

export type Boats = 'kutter' | 'fiskeskib' | 'hummerkutter' | 'trawler'


export type BoatInfo = {
    boatId: string;
    teamId: string;
    type: Boats; 
    name: string;
    inUse: boolean;
    speed: number;
    timeToDestinationInMs: number;
    destination: number | null;
    status: 'inbound' | 'outbound' | 'docked';
    cargo: {
        name: string,
        amount: number
    }[];
};

type FishInventoryInfo = FishBaseInfo & {
    amount: number;
};
