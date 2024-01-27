<script setup lang="ts">
import GameView from './GameView.vue'
import PreGameView from './PreGameView.vue'
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>

<template>
  <main class="bg-slate-200 min-h-screen">
    <!-- <pre-game-view v-if="game.gameState.value !== 'active'"></pre-game-view> -->
    <game-view></game-view>
  </main>
</template>
