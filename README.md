# Fiskespillet

## Start the game

1. Run `docker-compose up`
2. Visit `http://localhost:5173/`

## Restart the game

1. In Firebase do the following
   - Set `setupItems.startTime` to a time in the future
   - Empty out `events`, `teams` and `boats`

## Test performance
1. Make sure the game is runnning
2. Go into the `gameserver` docker container with `docker-compose exec gameserver sh`
3. Run `npx tsx src/firebasePerformanceTestSetup.ts --teams=10`. *You define the number of teams with the teams argument*
4. Run `npx tsx watch src/firebasePerformanceTest.ts`
