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

type FishingAreaInfo = {
    name: string;
    waterType: "shallow" | "semi-deep" | "deep";
    distanceFromShore: number;
};

type FishBaseInfo = {
    type: string;
    foundInAreas: FishingAreaInfo[];
};

type FishMarketFishInfo = FishBaseInfo & {
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
};

type FishingAreaFishInfo = FishBaseInfo & {
    maxAmount: number;
    currentAmount: number;
    available: boolean;
};

export type TeamInfo = {
    teamId: string;
    currentActivePlayers: number;
    boatInventory: BoatInventoryInfo[];
    fishInventory: FishInventoryInfo[];
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
