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
        cargoSize
        fishingAreas (collection)
            fishAreaName (document)
                timeToReach

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

-   [ ] Handles Game start
    -   [ ] Start new FishGame
        -   [x] Set start time
        -   [x] Set end time
        -   [ ] Create new fish market
        -   [ ] Create new fish area
    -   [ ] Subscribes to events collection changes
-   [x] Sends periodic game data (periodic updates mostly for timer, fish area info and fish market info could be on a push basis on document update)
-   [ ] Periodically evaluates game data
    -   [ ] Update fish market
        -   [ ] Optional - update demand based on game phase
        -   [ ] Remove fish from supply based on demand
        -   [ ] Update fish prices based on supply vs. demand
    -   [ ] Update fish area
        -   [ ] Add fish based on current amount and growth rate
        -   [ ] Cannot go above max
-   [ ] Updates team document on event
    -   [ ] On boat buy event
        -   [ ] Check that there is enough points to avoid using the same points multiple times
        -   [ ] Remove points based on price and buy amount
        -   [ ] Add boat to team boats collection
    -   [ ] On fish sell event
        -   [ ] Check team fish stock to avoid multiple sells of the same fish
        -   [ ] Remove fish from team stock based on amount
        -   [ ] Add points equal to fish price and sell amount
    -   [ ] On fish store event
        -   [ ] update amount of fishName document in fish collection
    -   [ ] On boat sail event
        -   [ ] Update boat with boatId field inUse to true
        -   [ ] Track boat progress i.e tracking how long til destingation (To be figured out )
            -   [ ] Periodically updates team boat document to track boat time to destination
                -   [ ] update boat time to destination based on old time to destination for boats with staus != docked
                -   [ ] if updated time to destination =< 0
                    -   [ ] if boat status = outbound
                        -   [ ] trigger fish catch event
                        -   [ ] change boat status to inbound
                        -   [ ] update boat time to destination
                    -   [ ] if boat status = inbound
                        -   [ ] trigger fish store event
                            -   [ ] On team document update fish collection with boat cargo
                        -   [ ] update boat status to docked
                        -   [ ] update boat cargo to be empty
    -   [ ] On fish catch event
        -   [ ] Check fish area for amount of fish available
        -   [ ] Update boat with boatId field cargo with fish according to boat type, amount available
-   [ ] Updates fishmarket info on fish sell event
    -   [ ] Add fish to supply
-   [ ] Updates fish area info on fish catch event
    -   [ ] Remove fish from amount in area

## User Browser

-   [x] Creates new team if team not in teams
    -   [x] setDoc on teams with teamName as identifier
        -   [x] Create starting boat inventory (might be empty)
        -   [x] Adds password
        -   [x] Add starting points (might be 0)
        -   [x] Create starting fish inventory (might be empty)
-   [x] Subscribes to team document for updates to points, boats and fish
-   [ ] Subscribes to game data for updates on game time, fish area info and fish market info
-   [ ] Allow users to send boat to fish area
    -   [ ] Choose boat and destination
    -   [ ] Trigger boat sail event
    -   [ ] Update team boatId document
        -   [ ] update boat status to outbound
        -   [ ] Updated boat time to destination
-   [ ] Allow users to buy boat
    -   [ ] Choose boat to buy
    -   [ ] Trigger boat buy event
-   [x] Allow users to sell fish
    -   [x] Choose fish type and amount
    -   [x] Trigger fish sell event
-   [ ] Sends events to events collection on user input
    -   [ ] On boat buy event
        -   [ ] Send event with
            -   [ ] teamId
            -   [ ] eventTarget boat
            -   [ ] eventType buy
            -   [ ] boat type
            -   [ ] current price
            -   [ ] amount
    -   [ ] On fish catch event
        -   [ ] Send event with
            -   [ ] teamId
            -   [ ] eventTarget fish
            -   [ ] eventType catch
            -   [ ] areaName
            -   [ ] fish
                -   [ ] fishName
                -   [ ] fishAmount
    -   [x] On fish sell event
        -   [x] Send event with
            -   [x] teamId
            -   [x] eventTarget fish
            -   [x] eventType sell
            -   [x] fish
                -   [x] fishName
                -   [x] fishAmount
                -   [x] fishPrice
    -   [ ] On boat sail event
        -   [ ] Send event with
            -   [ ] teamId
            -   [ ] boatId
            -   [ ] eventTarget boat
            -   [ ] eventType sail
            -   [ ] destination
            -   [ ] timeToDestinationInMs

## Coding thoughts

Create a series of fuctions to build up the fish - maybe stored in an array - in the game server

-   createFishPriceCalculator(ratelimit, minValue, maxValue, demandFunction)

```
return function(supply) {
price = max(min(demandFunction(supply)/supply * ratelimit, minValue), maxValue)
}
```
