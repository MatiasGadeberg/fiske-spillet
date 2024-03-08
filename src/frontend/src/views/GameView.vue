<template>
  <div class="game-view flex flex-col flex-grow overflow-auto">
    <div class="flex justify-center bg-neutral-100 text-lg">
        <h1>
            Spillet slutter om : {{ game.timeToEndLocale }} 
        </h1>
    </div>
    <div class="flex">
      <router-link to="/game/boat" class="flex-grow outline">
        <div class="bg-violet-500 p-2 text-center hover:bg-violet-600 text-white">Rederiet</div>
      </router-link>
      <router-link to="/game/fish" class="flex-grow">
        <div class="bg-red-300 p-2 text-center hover:bg-red-400 text-white">Fiskemarkedet</div>
      </router-link>
      <router-link to="/game/ocean" class="flex-grow">
        <div class="bg-blue-300 p-2 text-center hover:bg-blue-600 text-white">Havet</div>
      </router-link>
    </div>

    <router-view class="grow overflow-auto" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';


const game = useGameStore()
</script>

<style scoped></style>
