<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>

<template>
  <div class="flex items-center justify-center bg-blue-800 grow text-4xl text-amber-400 flex-col p-4">
    <h1>Velkommen til Væbnermesterskabets Netoplevelse 2024</h1>
    <h1 class="text-amber-300">Ta med ud og Fisk</h1>
    <br/>
    <h2>Spillet begynder om: {{ game.timeToStartLocale }}</h2>
  </div>
</template>

<style scoped></style>
