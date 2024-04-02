<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>

<template>
  <div class="flex items-center justify-center gap-2 bg-blue-800 grow text-3xl text-amber-400 flex-col p-4">
    <div class="flex justify-center flex-col items-center">
        <h1>Velkommen til Væbnermesterskabets Netoplevelse 2024</h1>
        <h1 class="text-amber-300">Ta med ud og Fisk</h1>
        <br/>
        <h2>Spillet begynder om: {{ game.timeToStartLocale }}</h2>
        <br/>
        <p>
        Følg med i vores live stream fra kl. 18.00 
        <a class="font-bold underline text-underline-offset-8 text-amber-300" 
            href="https://mesterskabet.dk/streaming" 
            target="_blank"
            >HER</a>
        </p>
    </div>
  </div>
</template>

<style scoped></style>
