export type GameState = "not-started" | "active" | "ended";

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

export type EventType = 'sell' | 'buy' | 'sail' | 'login' | 'logout';

type BaseEvent = {
    teamId: string;
    eventId: string;
    isProcessed: boolean;
}

type EventPayload<T extends EventType> = 
    T extends 'sell' ? FishSellEventPayload :
    T extends 'buy' ? BoatBuyEventPayload :
    T extends 'sail' ? BoatSailEventPayload :
    T extends 'login' ? LoginEventPayload :
    T extends 'logout' ? LogoutEventPayload :
    {};

export type EventData<T extends EventType> = BaseEvent & {
    type: T
} & EventPayload<T>;

type FishSellEventPayload = {
    fish: {
        [fishName: string]: {
            fishAmount: number;
            fishPrice: number;
        };
    };
}

type BoatBuyEventPayload = {
    amount: number;
    price: number;
    boatType: Boats;
}

type BoatSailEventPayload = {
    boatId: string;
    boatType: Boats;
    fishAreaNumber: number;
    startTime: number;
}

type LoginEventPayload = {}

type LogoutEventPayload = {}
    
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
    category: 'vaebner' | 'senior';
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
    cargoSize: number;
    availableFish: string[];
    startTime: number | null;
    endTime: number | null;
    catchTime: number | null;
    destination: number | null;
    status: BoatStatus;
    cargo: {
        name: string,
        amount: number
    }[];
};

export type BoatStatus = 'inbound' | 'outbound' | 'docked'; 

type FishInventoryInfo = FishBaseInfo & {
    amount: number;
};
