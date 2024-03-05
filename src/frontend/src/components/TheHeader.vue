<template>
  <div
    v-if="auth.isLoggedIn"
    class="bg-neutral-100 flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8"
  >
    <h1 class="text-slate-500 font-bold text-lg">Logget på som: {{ team.teamId }}</h1>
    <h1 class="text-slate-500 font-bold text-lg">Tid til slut: {{ game.timeToEndLocale }}</h1>
    <img :src="getImageUrl().toString()" class="card-image object-fill w-full h-20 rounded" />
    <h1 class="text-slate-500 font-bold text-lg">Jeres hold har {{ team.points.toFixed(2) }} VM$</h1>
  </div>
  <div v-else class="bg-indigo-500 flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8">
    <img :src="getImageUrl().toString()" class="card-image object-fill w-full h-20 rounded" />
  </div>
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game';

const team = useTeamStore()
const auth = useAuthStore()
const game = useGameStore()

function getImageUrl() {

  return new URL(`../assets/logo.svg`, import.meta.url)
}
</script>

<style scoped></style>
