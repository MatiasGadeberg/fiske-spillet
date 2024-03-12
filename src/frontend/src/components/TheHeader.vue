<template>
  <div
  v-if="auth.isLoggedIn"
  class="bg-neutral-100 flex items-center justify-around h-16 px-2" 
>
      <div class="flex flex-col justify-center items-center basis-1/4 text-slate-500 font-bold"> 
        <h1 class="text-lg">Logget på som: {{ team.teamName }}</h1>
        <button @click="auth.logout">Log ud</button>
      </div>
      <div class="flex items-center justify-center basis-1/2"> 
        <img :src="getImageUrl().toString()" class="card-image object-fill h-20 rounded" />
      </div>
      <div class="flex items-center justify-end basis-1/4"> 
        <h1 class="text-slate-500 font-bold text-lg">Jeres hold har {{ team.points.toLocaleString('da-DK', {maximumFractionDigits: 2})}} VM$</h1>
      </div>
</div>
  <div v-else class="bg-indigo-500 flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8">
    <img :src="getImageUrl().toString()" class="card-image object-fill w-full h-20 rounded" />
  </div>
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'

const team = useTeamStore()
const auth = useAuthStore()

function getImageUrl() {

  return new URL(`../assets/logo.svg`, import.meta.url)
}
</script>

<style scoped></style>
