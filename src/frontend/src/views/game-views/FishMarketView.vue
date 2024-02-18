<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import FishCard from '../../components/FishCard.vue'

const game = useGameStore();
const fishMarket = game.fishMarket
const fishArray = Object.keys(fishMarket).map((fishName) => {
    return { name: fishName }
}).sort((a,b) => a.name.localeCompare(b.name))

</script>

<template>
  <div class="bg-green-300">
    <div>
      <div class="flex justify-center flex-col items-center">
        <h1 class="font-bold text-4xl m-3">Velkommen til Fiskemarkedet</h1>
        <h2 class="text-2xl">Her kan I sælge de fisk I har fanget</h2>
      </div>
      <div class="fish-card-container flex flex-wrap justify-center" >
        <div v-for="fish in fishArray" :key="fish.name" class="fish-card flex-grow min-w-[100px] ">
          <FishCard :name="fish.name" />
        </div>
      </div>
      <ul></ul>
    </div>
  </div>
</template>

<style scoped></style>
