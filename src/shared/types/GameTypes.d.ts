export type GameInfo = {
    currentNumberOfTeams: number;
    gameState: GameState;
    timeToEndInMs: number;
    timeToStartInMs: number;
};

export type FishMarket = {
    market: FishMarketEntry[];
}

export type BoatAndAreaInfo = {
    boatMarketInfo: BoatMarket[];
    fishingAreaInfo: FishAreaInfo[];
}

export type NumberOfTeams = {
    teams: number
}

export type GameState = "not-started" | "active" | "ended";

export type EventData = 
    | FishSellEvent 
    | BoatBuyEvent
    | BoatSailEvent
    | LoginEvent
    | LogoutEvent

export type FishSellEvent = {
    type: "sell";
    eventTarget: "fish";
    teamId: string;
    fish: {
        [fishName: string]: {
            fishAmount: number;
            fishPrice: number;
        };
    };
}

export type BoatBuyEvent = {
    type: "buy"
    eventTarget: "boat"
    teamId: string;
    amount: number;
    price: number;
    boatType: Boats;
}

export type BoatSailEvent = {
    type: "sail";
    eventTarget: "boat";
    teamId: string;
    boatId: string;
    boatType: Boats;
    fishAreaNumber: number;
    startTime: number;
}

export type LoginEvent = {
    type: "login"
    teamId: string;
}

export type LogoutEvent = {
    type: "logout"
    teamId: string;
}
    
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
