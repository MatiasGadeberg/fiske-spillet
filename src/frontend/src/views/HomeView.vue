<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useTeamStore } from '@/stores/team'
const game = useGameStore()
const team = useTeamStore()
</script>

<template>
  <main>
    <h1>There are currently {{ game.currentNumberOfTeams }} teams joined</h1>
    <h1>You have joined the team {{ team.teamId }}</h1>
    <h1>There are {{ team.currentActivePlayers }} players joined to your team</h1>
    <h1>Time on server is {{ new Date(game.servertime).toLocaleTimeString() }}</h1>
    <h1>Time to start is {{ new Date(game.timeToStartInMs).toISOString().slice(11, 19) }}</h1>
    <h1>Time to end is {{ new Date(game.timeToEndInMs).toISOString().slice(11, 19) }}</h1>
    <h1>Game state is {{ game.gameState }}</h1>
    <button @click="team.removePlayer()">Log af</button>
  </main>
</template>
