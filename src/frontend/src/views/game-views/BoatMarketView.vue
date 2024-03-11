<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import BoatCard from '../../components/BoatCard.vue'
import { useTeamStore } from '@/stores/team';
import { computed } from 'vue';

const game = useGameStore()
const team = useTeamStore()

const priceIncrease = computed(() => {
    return  Math.floor(team.boatInventory.length / 5) * game.boatPriceIncreaseFactor * 100;
})

</script>

<template>
  <div class="bg-violet-500">
    <div>
      <div class="flex justify-center flex-col items-center text-slate-200 m-5">
        <h1 class="font-bold text-4xl m-3">Velkommen til Rederiet</h1>
        <h2 class="text-2xl">Her kan I købe flere både til jeres beholding</h2>
        <h2>I ejer lige nu {{ team.boatInventory.length }} både jeres priser stiger derfor med {{ priceIncrease.toFixed(0) }}%</h2>
      </div>
      <div class="boat-card-container flex flex-wrap">
        <div v-for="boat in game.boatMarket" :key="boat.type" class="boat-card flex-grow">
          <BoatCard 
            :boat="boat" 
          />
        </div>
      </div>
      <ul></ul>
    </div>
  </div>
</template>

<style scoped></style>
