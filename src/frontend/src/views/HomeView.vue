<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>

<template>
  <main>
    <h1>There are currently {{ game.currentNumberOfTeams }} teams joined</h1>
    <h1>Time on server is {{ new Date(game.servertime).toLocaleTimeString() }}</h1>
    <h1>Time to start is {{ new Date(game.timeToStartInMs).toISOString().slice(11, 19) }}</h1>
    <h1>Time to end is {{ new Date(game.timeToEndInMs).toISOString().slice(11, 19) }}</h1>
    <h1>Game state is {{ game.gameState }}</h1>
  </main>
</template>
