<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>

<template>
  <div>
    <h1>This is the pre game page</h1>
    <h2>Spillet er ikke startet endnu. Det starter om</h2>
    <h2>{{ new Date(game.timeToStartInMs).toISOString().slice(11, 19) }}</h2>
  </div>
</template>

<style scoped></style>
