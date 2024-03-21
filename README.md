# Fiskespillet

## Start the game

1. Run `docker-compose up`
2. Visit `http://localhost:5173/`

## Restart the game

1. In Firebase do the following
   - Set `setupItems.startTime` to a time in the future
   - Empty out `events`, `teams` and `boats`
