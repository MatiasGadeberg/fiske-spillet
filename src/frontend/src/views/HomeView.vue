<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import PreGameView from './PreGameView.vue';
import GameView from './GameView.vue';
import PostGameView from './PostGameView.vue';
import { computed, type Component } from 'vue';
import router from '@/router';

const game = useGameStore()

const currentView = computed(() => {
    let component: Component = PreGameView
    if (game.gameState === "active") {
        router.push('/game/fish')
        component = GameView
    }
    if (game.gameState === "ended") {
        router.push('/post-game')
        component = PostGameView
    }
        
    return  component
})

</script>

<template>
  <main class="bg-slate-200 min-h-screen">
    <component :is="currentView"></component>
  </main>
</template>
