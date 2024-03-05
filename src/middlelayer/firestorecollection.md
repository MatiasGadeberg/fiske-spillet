# Critical bugs - must fix
- [ ] Images not in frontend container
- [ ] Ocean slice colors not working properly
- [ ] Sending ships sailing does not work properly in a lot of cases - users try to send without luck

# Outstanding features - must fix
- [ ] Pre-game welcome screen
- [ ] Post-game overview page
- [ ] Updating team to include senior/væbner category and teamName, login, password
- [ ] Time till end visible to users
- [ ] Actual thought through prices, growth rates, boat prices etc.
- [ ] Dynamic Stock sizes, and demand

# Recommended features - Nice to have
- [ ] Sorting of owned boats based on status and type
- [ ] Unique names for all boats in harbor
- [ ] Distinct grafics on boats
- [ ] Visualization of where a boat is currently heading
- [ ] Price drop / raise dependant on difference between supply and demand
- [ ] Dynamic boat pricing
- [ ] Current ranking page during gameplay
- [ ] Thousands seperator on Current amount

# Reccomended features - If time allows
- [ ] Visualize historic market prices
- [ ] Max / Min visualization on fish card
- [ ] Over fishing penalty
- [ ] Limited boat slots but possibility to sell boats
- [ ] Market is only open at certain times

# Notes from playtest 
Growth rates way to high / boats catch way to little
Time left should be visible
!! Handling boat sail events take to long 
Både priser skal reguleres - måske dynamisk pris
Fiskemarked - torsk, markrel, tun var ikke så dynamisk
Fiskemarked - min/max pris
pris afhængig af demand
Rigtig mange skibe til hodle
Mulighed for at sælge skibe?
Bådene i havnen - det er svært at se forskel
Hvor er skibet påvej hen ? 
Sortere skibene efter docker/time to dock
Historiske kurser?
Længere opdatering i kurserne
Børsen har åben i forskellige tider
Vente lobby
Slut skærm Stillingen
Billeder kommer ikke med på containeren
Område farverne
Radioreje

# Firestore collection data structure

```
teams (collection)
    teamName (document)
        password
        points
        boats (collection)
            boatId (document)
                boatType
                inUse
                currentHealth
                timeToDestinationInMs
                destination (fishAreaName or harbor)
                status (outbound, inbound, docked)
                cargo (collection)
                    fishName (document)
                        amount
        fish (collection)
            fishName (document)
                amount

boats (collection)
    boatType (document)
        maxHealth
        speed
        cargoSize
        fishingAreas (collection)
            fishAreaName (document)
                timeToReach
        fish: fishName[]
            

fish (collection)
    fishName (document)
       minPrice
       maxPrice
       foundInAreas (collection)
            areaName (document)
                waterType

events (collection)
    evnentId (document)
        teamName
        eventType (sell, buy, catch)
        eventTarget (fish, boat)
        fish (collection)
            fishName (document)
                fishAmount
                fishPrice
        boat (collection)
            boatType (document)
                boatPrice
                boatAmount
        fishAreaName

games (collection)
    fiskespil (document)
        gameState
        serverTime
        timeToEndInMs
        timeToStartInMs
        fishMarketInfo (collection)
            fishName (document)
                supply
                demand
                currentPrice
                growth (positive | negative | neutral)
                minPrice
                maxPrice
        fishAreaInfo (collection)
            areaName (document)
                openForFishing
                fish (collection)
                    fishname (document)
                        maxAmount
                        currentAmount
                        available
```

# Design Notes

## Gameserver

-   [x] Handles Game start
    -   [x] Start new FishGame
        -   [x] Set start time
        -   [x] Set end time
        -   [x] Create new fish market
        -   [x] Create new boat market
        -   [x] Create new fish area
    -   [x] Subscribes to events collection changes
-   [x] Sends periodic game data (periodic updates mostly for timer, fish area info and fish market info could be on a push basis on document update)
-   [x] Periodically evaluates game data
    -   [x] Update fish market
        -   [-] Optional - update demand based on game phase
        -   [x] Remove fish from supply based on demand
        -   [x] Update fish prices based on supply vs. demand
    -   [x] Update fish area
        -   [x] Add fish based on current amount and growth rate
        -   [x] Cannot go above max
-   [ ] Updates team document on event
    -   [x] On boat buy event
        -   [x] Check that there is enough points to avoid using the same points multiple times
        -   [x] Remove points based on price and buy amount
        -   [x] Create new boat(s) in boats collection based on event details
        -   [x] Add boatId to team boats array
    -   [x] On fish sell event
        -   [x] Check team fish stock to avoid multiple sells of the same fish
        -   [x] Remove fish from team stock based on amount
        -   [x] Add points equal to fish price and sell amount
    -   [ ] On fish store event
        -   [ ] update amount of fishName document in fish collection
    -   [ ] On boat sail event
        -   [x] Update boat with boatId field inUse to true
        -   [ ] Track boat progress i.e tracking how long til destingation (To be figured out )
            -   [ ] Periodically updates boat document to track boat time to destination
                -   [x] update boat time to destination based on old time to destination for boats with staus != docked
                -   [x] if updated time to destination =< 0
                    -   [x] if boat status = outbound
                        -   [x] trigger fish catch event
                        -   [x] change boat status to inbound
                        -   [x] update boat time to destination
                    -   [ ] if boat status = inbound
                        -   [ ] trigger fish store event
                            -   [ ] On team document update fish collection with boat cargo
                        -   [x] update boat status to docked
                        -   [x] update boat cargo to be empty
    -   [x] On fish catch event
        -   [x] Check fish area for amount of fish available
        -   [x] Update boat with boatId field cargo with fish according to boat type, amount available
-   [x] Updates fishmarket info on fish sell event
    -   [x] Add fish to supply
-   [x] Updates fish area info on fish catch event
    -   [x] Remove fish from amount in area

## User Browser

-   [x] Creates new team if team not in teams
    -   [x] setDoc on teams with teamName as identifier
        -   [x] Create starting boat inventory (might be empty)
        -   [x] Adds password
        -   [x] Add starting points (might be 0)
        -   [x] Create starting fish inventory (might be empty)
-   [x] Subscribes to team document for updates to points, boats and fish
-   [x] Subscribes to game data for updates on game time, fish area info and fish market info
-   [x] Allow users to send boat to fish area
    -   [x] Choose boat and destination
    -   [x] Trigger boat sail event
-   [x] Allow users to buy boat
    -   [x] Choose boat to buy
    -   [x] Trigger boat buy event
-   [x] Allow users to sell fish
    -   [x] Choose fish type and amount
    -   [x] Trigger fish sell event
-   [x] Sends events to events collection on user input
    -   [x] On boat buy event
        -   [x] Send event with
            -   [x] teamId
            -   [x] eventTarget boat
            -   [x] eventType buy
            -   [x] boat type
            -   [x] current price
            -   [x] amount
    -   [x] On fish sell event
        -   [x] Send event with
            -   [x] teamId
            -   [x] eventTarget fish
            -   [x] eventType sell
            -   [x] fish
                -   [x] fishName
                -   [x] fishAmount
                -   [x] fishPrice
    -   [x] On boat sail event
        -   [x] Send event with
            -   [x] eventTarget boat
            -   [x] eventType sail
            -   [x] boatId
            -   [x] destination

## Coding thoughts

Create a series of fuctions to build up the fish - maybe stored in an array - in the game server

-   createFishPriceCalculator(ratelimit, minValue, maxValue, demandFunction)

```
return function(supply) {
price = max(min(demandFunction(supply)/supply * ratelimit, minValue), maxValue)
return price
}
```

## Options for tracking boats:
### Object in each team document
Each team has a object with all their boats i.e

```typescript
team = {
    boats: {
        boat1: {
            boatType: 'kutter',
            inUse: true
            timeToDestinationInMs: 1000,
            destination: harbor,
            status: inbound,
            cargo: {
                markrel: {
                    amount: 10
                },
                hornfisk: {
                    amount: 5
                }
            }
        },
        boat2: {
            boatType: 'hummerskib',
            inUse: false
            timeToDestinationInMs: null,
            destination: null,
            status: docked,
            cargo: {}
        }
    }
}
```

pros:
- team data subscription will handle getting all updates to boats for the frontend

cons: 
- Server update of all boats becomes tricky

### List in each team object
Each team has an array of objects with their boat data

```typescript
team = {
    boats: [
         {
            boatId: boat1,
            boatType: 'kutter',
            inUse: true
            timeToDestinationInMs: 1000,
            destination: harbor,
            status: inbound,
            cargo: {
                markrel: {
                    amount: 10
                },
                hornfisk: {
                    amount: 5
                }
            }
        },
         {
        boatId: boat2,
        boatType: 'hummerskib',
        inUse: false
        timeToDestinationInMs: null,
        destination: null,
        status: docked,
        cargo: {}
    }
]
}
```

pros:
- Easier on frontend to loop over boats and show card

cons: 
- Also problems with server update of boats and if one boat makes update to array can the database then figure out not to
override all the other parts of the array

### Seperate boat collection and team array of ID'a
A new main collection is started on the database 'boats' with auto-generated ID's
Each document has the following fields

```typescript
 [boatId]: {
    teamId: team1,
    boatType: 'kutter',
    inUse: true
    timeToDestinationInMs: 1000,
    destination: harbor,
    status: inbound,
    cargo: {
        markrel: {
            amount: 10
        },
        hornfisk: {
            amount: 5
        }
    }
}
```
And teams then only have an array of boatId's

```typescript
team = {
    boats: [
        'boat1',
        'boat2'
    ]
}
```

pro: 
- server can on boat sail events create a boat object in a sailingBoats array and loop over this for boat updates
- Each boat object can update its own individual document very easily
- Frontend can create a boat card by looping over the array

con:
- Each boat object on the frontend needs to subscribe to its own data updates? So no central store? Maybe not a con?

Handling fish area growth:

```typescript
game.updateState


updateState() {
    updateFishArea()
    update fish market
}

updateFishArea() {
    for each fishArea
        area.growFish
}

//FishArea
growFish
    for each stock in fishStocks 
        stock.grow

FishStock
    maxAmount
    currentAmount
    fishName
    growthRate
    baseGrowth = maxAmount * 0.01

    public grow
        this.currentAmount = this.currentAmount * this.growthRate + this.baseGrowth

    getStockInfo 
        return {
            fishName
            percentAvailable: this.currentAmount / this.maxAmount * 100
        }
```

Handling fish catch event:
Of the fish in the area - what fish can the boat catch?
Of the fish that can be caught - what is the ration between the fish amounts?
Using the ratios the boat cargo number - How many of each fish is caught?
Create cargo object with fish and amount, remove amount from each stock in area

```typescript

// Fish Game function
    if boat.caught
        area = area.find(area.areaNumber === boat.destination)
        fishRatios = area.getFishRatios(boat.canCatch)
        cargo = boat.catch(fishRatios)
        area.reduceStocks(cargo)

// FishArea function
fishToCatch = boat.canCatch.filter(fish => areaFishArray.includes(fish))

// FishArea function
fishData = area.stocks.map(stock => { 
        currentAmount: stock.currentAmount
        name: stock.name
    }
)

// FishArea function
totalFish = fishData.reduce((fish, total) => return total + fish.cureentAmount, 0)
fishRatios = fishdata.map((fish) => {
    ratio: fish.currentAmount / totalFish,
    name: fish.name
})

// SailingBoat function
cargo = fishRatios.map((fish) => {
    name: fish.name,
    amount: boat.cargoSize * fish.ratio
})

// FishArea function
Stock.forEach(stock => {
    cargo.forEach( cargo => {
        Stock.name === cargo.name
            Stock.remove(cargo.amount)
    }
}


```

