export type GameInfo = {
    serverTime: number;
    currentNumberOfTeams: number;
    gameState: GameState;
    timeToEndInMs: number;
    timeToStartInMs: number;
    fishMarketInfo: FishMarketFishInfo[];
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
        [boatType: string]: {
            boatAmount: number;
            boatPrice: number;
        };
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
    };
};

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

type BoatBaseInfo = {
    type: string;
    shallowWaterSpeed: number;
    semiDeepWaterSpeed: number;
    deepWaterSpeed: number;
    maxHealth: number;
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
