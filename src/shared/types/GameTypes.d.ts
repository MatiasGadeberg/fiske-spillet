export type GameInfo = {
    currentNumberOfTeams: number;
    gameActive: boolean;
    timeToEndInMs: number;
    timeToStartInMs: number;
    fishMarketInfo: FishMarketFishInfo[];
    fishingAreaInfo: FishingAreaFishInfo[];
};

type FishBaseInfo = {
    name: string;
};

type FishMarketFishInfo = FishBaseInfo & {
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
};

type FishingAreaFishInfo = FishBaseInfo & {
    currentAmount: number;
    available: boolean;
};

export type Teaminfo = {
    currentActivePlayers: number;
    boatInventory: BoatInventoryInfo[];
    fishInventory: FishInventoryInfo[];
};

type BoatInventoryInfo = {
    type: string;
    inUse: boolean;
    id: string;
    health: number;
    timeToHarborInMs: number;
};

type FishInventoryInfo = FishBaseInfo & {
    amount: number;
};
