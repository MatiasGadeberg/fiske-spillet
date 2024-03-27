<template>
  <div
  v-if="auth.isLoggedIn"
  class="bg-neutral-100 flex items-center justify-around h-auto px-2" 
>
      <div class="flex flex-col justify-center items-center basis-1/4 text-slate-500 font-bold"> 
        <h1 class="text-lg">Logget på som: {{ team.teamName }}</h1>
        <button @click="auth.logout">Log ud</button>
      </div>
      <div class="flex flex-col items-center justify-center basis-1/2"> 
        <img :src="getImageUrl().toString()" class="card-image object-fill h-20 rounded" />
            <h1 v-if="game.gameState === 'active'">
                Spillet slutter om : {{ game.timeToEndLocale }} 
            </h1>
      </div>
      <div  class="flex flex-col items-center justify-end basis-1/4"> 
        <div v-if="game.gameState !== 'not-started'">
            <h1 class="text-slate-500 font-bold text-lg">Placering: {{ teamRanking }}</h1>
            <h1 class="text-slate-500 font-bold text-lg">Score: {{ team.points.toLocaleString('da-DK', {maximumFractionDigits: 2})}} VM$</h1>
        </div>
      </div>
</div>
  <div v-else class="bg-indigo-500 flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8">
    <img :src="getImageUrl().toString()" class="card-image object-fill w-full h-20 rounded" />
  </div>
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game';
import { computed } from 'vue';

const team = useTeamStore()
const auth = useAuthStore()
const game = useGameStore()

const teamRanking = computed(() => {
    return team.teamCategory === 'vaebner' 
        ? game.vScores.findIndex((teamRanking) => teamRanking.teamName === team.teamName) + 1
        : game.sScores.findIndex((teamRanking) => teamRanking.teamName === team.teamName) + 1
})

function getImageUrl() {
  return new URL(`../assets/logo.svg`, import.meta.url)
}
</script>

<style scoped></style>
