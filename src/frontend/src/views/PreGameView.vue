<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>

<template>
  <div>
    <h1>Spillet er ikke startet endnu. Det starter om</h1>
    <h2>{{ game.timeToStartLocale }}</h2>
  </div>
</template>

<style scoped></style>
