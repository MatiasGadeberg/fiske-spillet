<template>
    <div class="flex flex-col items-center text-center p-8 text-3xl bg-blue-800 text-amber-400 grow">
        <div class="my-4">
            <h1>Netoplevelsen 2024 er slut</h1>
            <h1>Tak fordi I spillede med!</h1>
            <h1>Herunder kan I se stillingen</h1>
        </div>
        <div class="flex justify-around items-start w-full">
            <div>
                <h1>Væbner rækken:</h1>
                <ol class="list-decimal">
                    <li v-for="score in game.vScores" :key="score.teamName">
                            {{score.teamName }} : {{ score.points }} VM$
                    </li>
                </ol>
            </div>
            <div>
                <h1>Senior rækken:</h1>
                <ol class="list-decimal">
                    <li v-for="score in game.sScores" :key="score.teamName">
                            {{score.teamName }} : {{ score.points }} VM$
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';

const game = useGameStore()

</script>

