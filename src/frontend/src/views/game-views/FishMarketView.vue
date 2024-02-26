<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import FishCard from '../../components/FishCard.vue'

const game = useGameStore();

</script>

<template>
  <div class="bg-red-400">
    <div>
      <div class="flex justify-center flex-col items-center m-3 text-slate-200">
        <h1 class="font-bold text-4xl m-3">Velkommen til Fiskemarkedet</h1>
        <h2 class="text-2xl">Her kan I sælge de fisk I har fanget</h2>
      </div>
      <div class="fish-card-container flex flex-wrap justify-center" >
        <div v-for="fish in game.fishMarket" :key="fish.name" class="fish-card flex-grow min-w-[100px]">
         <FishCard :fish="fish" />
        </div>
      </div>
      <ul></ul>
    </div>
  </div>
</template>

<style scoped></style>
