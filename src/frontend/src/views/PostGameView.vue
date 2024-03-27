<template>
    <div class="flex flex-col items-center text-center p-8 text-3xl bg-blue-800 text-amber-400 grow">
        <div class="my-4">
            <h1>Netoplevelsen 2024 er slut</h1>
            <h1>Tak fordi I spillede med!</h1>
            <h1>Herunder kan I se stillingen</h1>
        </div>
        <div class="flex justify-around items-start w-full text-xl font-bold" >
            <div>
                <h1 class="text-2xl font-normal">Væbner-rækken:</h1>
                <br/>
                <ol class="list-decimal text-start">
                    <li v-for="score in game.vScores" :key="score.teamName">
                            {{score.teamName }} 
                    </li>
                </ol>
            </div>
            <div>
                <h1 class="text-2xl font-normal">Senior-rækken:</h1>
                <br/>
                <ol class="list-decimal text-start">
                    <li v-for="score in game.sScores" :key="score.teamName">
                            {{score.teamName }} 
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

