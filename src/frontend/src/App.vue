<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import { useGameStore } from './stores/game';
import { useAuthStore } from './stores/auth';

const game = useGameStore()
const auth = useAuthStore()

game.subscribeToGameData()
game.subscribeToFishMarket()
game.subscribeToScores()
game.subscribeToAllBoatData()


const loggedIn = sessionStorage.getItem("loggedIn")
const teamName = sessionStorage.getItem("teamName")

if (loggedIn && teamName) {
    auth.setLogin(teamName, true)
}
</script>

<template>
  <div class="bg-slate-200 app-container font-sans flex flex-col h-screen">
    <TheHeader />
    <RouterView />
  </div>
</template>

<style scoped></style>
