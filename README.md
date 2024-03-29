## Test performance
1. Make sure the game is runnning
2. Go into the `gameserver` docker container with `docker-compose exec gameserver sh`
3. Run `npx tsx src/firebasePerformanceTestSetup.ts --teams=10`. *You define the number of teams with the teams argument*
4. Run `npx tsx watch src/firebasePerformanceTest.ts`
